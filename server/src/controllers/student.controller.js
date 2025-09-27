import { Book } from "../models/book.model.js";
import { Borrow } from "../models/borrow.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

// Get all available books
const getAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({ availableCopies: { $gt: 0 } })
        .select("-__v")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, books, "Books fetched successfully")
    );
});

// Get book by ID with availability info
const getBookById = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
        throw new apiError(404, "Book not found");
    }

    // Get borrowing information
    const activeBorrows = await Borrow.find({ 
        book: bookId, 
        isReturned: false 
    }).populate('student', 'username fullname email');

    const bookInfo = {
        ...book.toObject(),
        activeBorrows: activeBorrows.map(borrow => ({
            student: borrow.student,
            borrowedDate: borrow.borrowedDate,
            dueDate: borrow.dueDate,
            daysRemaining: borrow.getDaysRemaining(),
            isOverdue: borrow.isOverdue()
        }))
    };

    return res.status(200).json(
        new apiResponse(200, bookInfo, "Book details fetched successfully")
    );
});

// Borrow a book
const borrowBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { studentId } = req.body; // Get studentId from request body instead of JWT

    if (!studentId) {
        throw new apiError(400, "Student ID is required");
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
        throw new apiError(404, "Book not found");
    }

    // Check if book is available
    if (!book.isAvailable()) {
        // Get information about when it will be available
        const activeBorrows = await Borrow.find({ 
            book: bookId, 
            isReturned: false 
        }).sort({ dueDate: 1 });

        const nextAvailableDate = activeBorrows.length > 0 ? activeBorrows[0].dueDate : null;
        
        return res.status(400).json(
            new apiResponse(400, {
                available: false,
                nextAvailableDate,
                message: "Book is currently not available"
            }, "Book not available")
        );
    }

    // Check if student already has this book borrowed
    const existingBorrow = await Borrow.findOne({
        student: studentId,
        book: bookId,
        isReturned: false
    });

    if (existingBorrow) {
        throw new apiError(400, "You have already borrowed this book");
    }

    // Check if student has any overdue books
    const overdueBooks = await Borrow.find({
        student: studentId,
        isReturned: false,
        dueDate: { $lt: new Date() }
    });

    if (overdueBooks.length > 0) {
        throw new apiError(400, "You have overdue books. Please return them before borrowing new ones");
    }

    // Create borrow record
    const borrow = new Borrow({
        student: studentId,
        book: bookId
    });

    await borrow.save();

    // Update book availability
    book.borrowBook();
    await book.save();

    // Populate the borrow record
    await borrow.populate([
        { path: 'student', select: 'username fullname email semester' },
        { path: 'book', select: 'title author isbn' }
    ]);

    return res.status(201).json(
        new apiResponse(201, {
            borrow,
            daysRemaining: borrow.getDaysRemaining(),
            dueDate: borrow.dueDate
        }, "Book borrowed successfully")
    );
});

// Return a book
const returnBook = asyncHandler(async (req, res) => {
    const { borrowId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
        throw new apiError(400, "Student ID is required");
    }

    // Find the borrow record
    const borrow = await Borrow.findOne({
        _id: borrowId,
        student: studentId,
        isReturned: false
    }).populate('book');

    if (!borrow) {
        throw new apiError(404, "Borrow record not found or already returned");
    }

    // Calculate fine
    const fineAmount = borrow.calculateFine();

    // Return the book
    borrow.returnBook();
    await borrow.save();

    // Update book availability
    const book = await Book.findById(borrow.book._id);
    book.returnBook();
    await book.save();

    return res.status(200).json(
        new apiResponse(200, {
            borrow,
            fineAmount,
            message: fineAmount > 0 ? `Book returned with fine of $${fineAmount}` : "Book returned successfully"
        }, "Book returned successfully")
    );
});

// Get student's borrowed books
const getMyBorrowedBooks = asyncHandler(async (req, res) => {
    const { studentId } = req.query;

    if (!studentId) {
        throw new apiError(400, "Student ID is required");
    }

    const borrowedBooks = await Borrow.find({
        student: studentId,
        isReturned: false
    })
    .populate('book', 'title author isbn category')
    .sort({ borrowedDate: -1 });

    const booksWithDetails = borrowedBooks.map(borrow => ({
        _id: borrow._id,
        book: borrow.book,
        borrowedDate: borrow.borrowedDate,
        dueDate: borrow.dueDate,
        daysRemaining: borrow.getDaysRemaining(),
        isOverdue: borrow.isOverdue(),
        fineAmount: borrow.calculateFine(),
        renewalCount: borrow.renewalCount,
        canRenew: borrow.renewalCount < 2
    }));

    return res.status(200).json(
        new apiResponse(200, booksWithDetails, "Borrowed books fetched successfully")
    );
});

// Get student's borrowing history
const getMyBorrowingHistory = asyncHandler(async (req, res) => {
    const { studentId } = req.query;

    if (!studentId) {
        throw new apiError(400, "Student ID is required");
    }

    const history = await Borrow.find({
        student: studentId
    })
    .populate('book', 'title author isbn category')
    .sort({ borrowedDate: -1 });

    return res.status(200).json(
        new apiResponse(200, history, "Borrowing history fetched successfully")
    );
});

// Renew a book
const renewBook = asyncHandler(async (req, res) => {
    const { borrowId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
        throw new apiError(400, "Student ID is required");
    }

    const borrow = await Borrow.findOne({
        _id: borrowId,
        student: studentId,
        isReturned: false
    }).populate('book', 'title author');

    if (!borrow) {
        throw new apiError(404, "Borrow record not found");
    }

    if (borrow.isOverdue()) {
        throw new apiError(400, "Cannot renew overdue books. Please return and pay the fine first");
    }

    const renewed = borrow.renewBook();
    if (!renewed) {
        throw new apiError(400, "Maximum renewal limit reached");
    }

    await borrow.save();

    return res.status(200).json(
        new apiResponse(200, {
            borrow,
            daysRemaining: borrow.getDaysRemaining(),
            dueDate: borrow.dueDate,
            renewalCount: borrow.renewalCount
        }, "Book renewed successfully")
    );
});

// Get overdue books
const getOverdueBooks = asyncHandler(async (req, res) => {
    const { studentId } = req.query;

    if (!studentId) {
        throw new apiError(400, "Student ID is required");
    }

    const overdueBooks = await Borrow.find({
        student: studentId,
        isReturned: false,
        dueDate: { $lt: new Date() }
    })
    .populate('book', 'title author isbn')
    .sort({ dueDate: 1 });

    const overdueWithDetails = overdueBooks.map(borrow => ({
        _id: borrow._id,
        book: borrow.book,
        borrowedDate: borrow.borrowedDate,
        dueDate: borrow.dueDate,
        fineAmount: borrow.calculateFine(),
        daysOverdue: Math.ceil((new Date() - borrow.dueDate) / (1000 * 60 * 60 * 24))
    }));

    return res.status(200).json(
        new apiResponse(200, overdueWithDetails, "Overdue books fetched successfully")
    );
});

// Search books
const searchBooks = asyncHandler(async (req, res) => {
    const { query, category } = req.query;

    let searchCriteria = { availableCopies: { $gt: 0 } };

    if (query) {
        searchCriteria.$or = [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } },
            { isbn: { $regex: query, $options: 'i' } }
        ];
    }

    if (category) {
        searchCriteria.category = { $regex: category, $options: 'i' };
    }

    const books = await Book.find(searchCriteria)
        .select("-__v")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, books, "Search results fetched successfully")
    );
});

export {
    getAllBooks,
    getBookById,
    borrowBook,
    returnBook,
    getMyBorrowedBooks,
    getMyBorrowingHistory,
    renewBook,
    getOverdueBooks,
    searchBooks
};
