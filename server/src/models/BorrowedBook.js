import mongoose from "mongoose";

const BorrowedBookSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  borrow_date: { type: Date, default: Date.now, required: true },
  due_date: { type: Date, required: true },
  return_date: { type: Date },
  status: { type: String, enum: ['borrowed', 'returned'], default: 'borrowed' },
  fine: { type: Number, default: 0 }, // Calculated overdue fine for this transaction
  is_overdue: { type: Boolean, default: false }
});

// module.exports = mongoose.model('BorrowedBook', BorrowedBookSchema);
const BorrowedBook = mongoose.model('BorrowedBook', BorrowedBookSchema);
export default BorrowedBook;