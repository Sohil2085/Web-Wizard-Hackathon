import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    author: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    publishedYear: {
        type: Number,
        required: false
    },
    pages: {
        type: Number,
        required: false
    },
    totalCopies: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    availableCopies: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    image: {
        type: String,
        required: false,
        default: ""
    },
    publisher: {
        type: String,
        required: false,
        trim: true
    },
    language: {
        type: String,
        required: false,
        default: "English"
    },
    edition: {
        type: String,
        required: false,
        default: "1st Edition"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Method to check if book is available
bookSchema.methods.isAvailable = function() {
    return this.availableCopies > 0 && this.isActive;
};

// Method to borrow a book
bookSchema.methods.borrowBook = function() {
    if (this.availableCopies > 0) {
        this.availableCopies -= 1;
        return true;
    }
    return false;
};

// Method to return a book
bookSchema.methods.returnBook = function() {
    if (this.availableCopies < this.totalCopies) {
        this.availableCopies += 1;
        return true;
    }
    return false;
};

// Static method to get available books
bookSchema.statics.getAvailableBooks = function() {
    return this.find({ 
        availableCopies: { $gt: 0 },
        isActive: true 
    });
};

// Static method to search books
bookSchema.statics.searchBooks = function(query, category) {
    let searchCriteria = { 
        availableCopies: { $gt: 0 },
        isActive: true 
    };

    if (query) {
        searchCriteria.$or = [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } },
            { isbn: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ];
    }

    if (category && category !== 'all') {
        searchCriteria.category = { $regex: category, $options: 'i' };
    }

    return this.find(searchCriteria);
};

export const Book = mongoose.model("Book", bookSchema);
