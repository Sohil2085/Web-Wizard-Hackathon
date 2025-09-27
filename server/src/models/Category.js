import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  times_issued: { type: Number, default: 0 } // For most popular category calculation
});

// module.exports = mongoose.model('Category', CategorySchema);
const Category = mongoose.model('Category', CategorySchema);
export default Category;