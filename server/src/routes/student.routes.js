import { Router } from "express";
import {
    getAllBooks,
    getBookById,
    borrowBook,
    returnBook,
    getMyBorrowedBooks,
    getMyBorrowingHistory,
    renewBook,
    getOverdueBooks,
    searchBooks
} from "../controllers/student.controller.js";

const router = Router();

// Book routes
router.route("/books").get(getAllBooks);
router.route("/books/search").get(searchBooks);
router.route("/books/:bookId").get(getBookById);

// Borrowing routes
router.route("/borrow/:bookId").post(borrowBook);
router.route("/return/:borrowId").post(returnBook);
router.route("/renew/:borrowId").post(renewBook);

// Student's personal routes
router.route("/my-books").get(getMyBorrowedBooks);
router.route("/my-history").get(getMyBorrowingHistory);
router.route("/overdue").get(getOverdueBooks);

export default router;
