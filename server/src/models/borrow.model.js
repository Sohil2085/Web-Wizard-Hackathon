import mongoose, { Schema } from "mongoose";

const borrowSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    borrowedDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        default: null
    },
    isReturned: {
        type: Boolean,
        default: false
    },
    fineAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    finePaid: {
        type: Boolean,
        default: false
    },
    renewalCount: {
        type: Number,
        default: 0,
        max: 2 // Maximum 2 renewals
    }
}, { timestamps: true });

// Calculate due date (2 weeks from borrow date)
borrowSchema.pre('save', function(next) {
    if (this.isNew && !this.dueDate) {
        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
        this.dueDate = twoWeeksFromNow;
    }
    next();
});

// Method to calculate fine
borrowSchema.methods.calculateFine = function() {
    if (this.isReturned) {
        return this.fineAmount;
    }
    
    const now = new Date();
    const daysOverdue = Math.max(0, Math.ceil((now - this.dueDate) / (1000 * 60 * 60 * 24)));
    
    // Fine calculation: $1 per day overdue
    const fine = daysOverdue * 1;
    this.fineAmount = fine;
    return fine;
};

// Method to check if book is overdue
borrowSchema.methods.isOverdue = function() {
    if (this.isReturned) return false;
    return new Date() > this.dueDate;
};

// Method to get days remaining before fine
borrowSchema.methods.getDaysRemaining = function() {
    if (this.isReturned) return 0;
    
    const now = new Date();
    const daysRemaining = Math.ceil((this.dueDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysRemaining);
};

// Method to return book
borrowSchema.methods.returnBook = function() {
    this.isReturned = true;
    this.returnDate = new Date();
    this.calculateFine();
};

// Method to renew book
borrowSchema.methods.renewBook = function() {
    if (this.renewalCount < 2 && !this.isReturned) {
        this.renewalCount += 1;
        // Extend due date by 2 weeks
        const newDueDate = new Date(this.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 14);
        this.dueDate = newDueDate;
        return true;
    }
    return false;
};

export const Borrow = mongoose.model("Borrow", borrowSchema);
