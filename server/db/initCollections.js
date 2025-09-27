// const mongoose = require('mongoose');
// const Book = require('../models/Book');
// const Student = require('../models/Student');
// const BorrowedBook = require('../models/BorrowedBook');
// const Category = require('../models/Category'); // If using Category model

// // Connect to DB (or import from db/index.js if that's where connection is set up)
// require('./index'); // adjust path to match your connection file

// // Dummy data to trigger table/collection creation
// async function createInitialDocs() {
//   await Book.create({ title: "Dummy Book", author: "Author", ISBN: "12345", category: "Fiction", copies_total: 1, copies_available: 1 ,image: "http://example.com/image.jpg"});
//   await Student.create({ name: "John Doe", email: "john@example.com" });
//   await Category.create({ name: "Fiction" });
//   await BorrowedBook.create({
//     book: "dummy-book-id", // Use actual ObjectId after first book creation for real data
//     student: "dummy-student-id",
//     borrow_date: new Date(),
//     due_date: new Date(Date.now() + 7*24*60*60*1000)
//   });
//   console.log("Dummy documents created, collections now exist.");
// }
// createInitialDocs();

// db/initCollections.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../src/models/Book.js";
import Student from "../src/models/Student.js";
import BorrowedBook from "../src/models/BorrowedBook.js";
import Category from "../src/models/Category.js";
import connectDB from "./index.js"; // your db connection

dotenv.config();

const createInitialDocs = async () => {
  try {
    await connectDB();

    const fictionCategory = await Category.create({ name: "Fiction" });

    const book = await Book.create({
      title: "Dummy Book",
      author: "Author",
      ISBN: "12345",
      category: fictionCategory.name,
      copies_total: 1,
      copies_available: 1,
      image: "http://example.com/image.jpg"
    });

    const student = await Student.create({
      name: "John Doe",
      email: "john@example.com"
    });

    await BorrowedBook.create({
      book: book._id,
      student: student._id,
      borrow_date: new Date(),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    console.log("✅ Dummy documents created, collections now exist.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating dummy documents:", err);
    process.exit(1);
  }
};

createInitialDocs();
