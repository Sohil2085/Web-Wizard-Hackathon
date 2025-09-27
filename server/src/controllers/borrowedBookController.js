const BorrowedBook = require('../models/BorrowedBook');
const Book = require('../models/Book');

// Borrow book
exports.borrowBook = async (req, res) => {
  try {
    const { bookId, studentId, due_date } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies < 1)
      return res.status(400).json({ message: 'Book not available' });

    const borrowedBook = new BorrowedBook({
      book: bookId,
      student: studentId,
      due_date,
    });
    await borrowedBook.save();

    book.availableCopies -= 1;
    book.times_issued += 1;
    await book.save();

    res.status(201).json({ message: 'Book borrowed', borrowedBook });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Return book
exports.returnBook = async (req, res) => {
  try {
    const borrowedBook = await BorrowedBook.findById(req.params.id).populate('book');
    if (!borrowedBook) return res.status(404).json({ message: 'Record not found' });

    borrowedBook.status = 'returned';
    borrowedBook.return_date = new Date();
    borrowedBook.is_overdue = borrowedBook.return_date > borrowedBook.due_date;
    borrowedBook.fine = borrowedBook.is_overdue ? 50 : 0; // Example fine
    await borrowedBook.save();

    const book = borrowedBook.book;
    book.availableCopies += 1;
    await book.save();

    res.json({ message: 'Book returned', borrowedBook });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all borrowed books
exports.getBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await BorrowedBook.find()
      .populate('book')
      .populate('student');
    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
