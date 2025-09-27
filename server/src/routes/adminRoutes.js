const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const categoryController = require('../controllers/categoryController');
const studentController = require('../controllers/studentController');
const borrowedBookController = require('../controllers/borrowedBookController');

// Book routes
router.post('/books', bookController.addBook);
router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBookById);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);

// Category routes
router.post('/categories', categoryController.addCategory);
router.get('/categories', categoryController.getCategories);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Student routes
router.post('/students', studentController.addStudent);
router.get('/students', studentController.getStudents);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);

// BorrowedBook routes
router.post('/borrow', borrowedBookController.borrowBook);
router.post('/return/:id', borrowedBookController.returnBook);
router.get('/borrowed', borrowedBookController.getBorrowedBooks);

module.exports = router;
