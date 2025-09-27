// init.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./index.js"; // your DB connection
import User from "../models/user.js";
import BorrowedBook from "../models/BorrowedBook.js";

dotenv.config();

const init = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log("MongoDB connected via connectDB");

        // 1️⃣ Initialize User collection with dummy data
        await User.deleteMany({});
        const users = await User.insertMany([
            { username: "john_doe", email: "john@example.com", fullname: "John Doe", role: "student", password: "123456" },
            { username: "jane_smith", email: "jane@example.com", fullname: "Jane Smith", role: "student", password: "123456" },
            { username: "librarian1", email: "lib1@example.com", fullname: "Librarian One", role: "admin", password: "123456" }
        ]);
        console.log("✅ Dummy users inserted");

        // 2️⃣ Delete all data from BorrowedBook collection
        await BorrowedBook.deleteMany({});
        console.log("✅ BorrowedBook collection cleared");

        // 3️⃣ Insert new borrowed book data
        // Replace ObjectId("...") with actual Book IDs
        const borrowedBooks = await BorrowedBook.insertMany([
            { book: mongoose.Types.ObjectId(), student: users[0]._id, due_date: new Date("2025-10-04") },
            { book: mongoose.Types.ObjectId(), student: users[1]._id, due_date: new Date("2025-10-05") }
        ]);
        console.log("✅ New borrowed books inserted");

        console.log("🎉 Database initialization complete");
        // DO NOT disconnect, keep the connection alive for further operations
    } catch (err) {
        console.error("❌ Error initializing database:", err);
    }
};

init();
