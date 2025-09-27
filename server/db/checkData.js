import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../src/models/Book.js";
import Student from "../src/models/Student.js";
import BorrowedBook from "../src/models/BorrowedBook.js";
import Category from "../src/models/Category.js";
import connectDB from "./index.js";

dotenv.config();

const checkData = async () => {
  try {
    await connectDB();

    const books = await Book.find();
    const students = await Student.find();
    const categories = await Category.find();
    const borrowed = await BorrowedBook.find();

    console.log("Books:", books);
    console.log("Students:", students);
    console.log("Categories:", categories);
    console.log("BorrowedBooks:", borrowed);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkData();
