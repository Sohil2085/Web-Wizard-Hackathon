// import mongoose from "mongoose";

// const BookSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   author: { type: String, required: true },
//   ISBN: { type: String, required: true, unique: true },
//   category: { type: String, required: true },
//   copies_total: { type: Number, required: true },
//   copies_available: { type: Number, required: true },
//   times_issued: { type: Number, default: 0 }, // For most issued ranking
//   image: { type: String }
// });

// // module.exports = mongoose.model('Book', BookSchema);
// const Book = mongoose.model("Book", BookSchema);
// export default Book;

import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true }, // friend used lowercase
    category: { type: String, required: true },
    totalCopies: { type: Number, required: true },
    availableCopies: { type: Number, required: true },
    times_issued: { type: Number, default: 0 }, // both schemas
    description: { type: String },             // friend
    publishedYear: { type: Number },           // friend
    publisher: { type: String },               // friend
    image: { type: String }                    // yours
  },
  { timestamps: true } // adds createdAt, updatedAt
);

const Book = mongoose.model("Book", BookSchema);
export default Book;
