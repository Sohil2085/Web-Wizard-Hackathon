import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  books_issued_count: { type: Number, default: 0 }, // For ranking by books issued
  due_charges: { type: Number, default: 0 } // Total fine owed
});

// module.exports = mongoose.model('Student', StudentSchema);
const Student = mongoose.model('Student', StudentSchema);
export default Student;