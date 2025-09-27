import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./index.js"; // your DB connection

dotenv.config();

const dropStudents = async () => {
  try {
    await connectDB();

    // Drop the 'students' collection completely
    const collections = await mongoose.connection.db.listCollections({ name: "students" }).toArray();
    if (collections.length > 0) {
      await mongoose.connection.db.dropCollection("students");
      console.log("✅ Student collection permanently deleted");
    } else {
      console.log("⚠️ Student collection does not exist");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error deleting Student collection:", err);
    process.exit(1);
  }
};

dropStudents();
