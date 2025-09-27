import mongoose from 'mongoose';
import { Book } from '../models/book.model.js';
import { connectDB } from '../../db/index.js';

const sampleBooks = [
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    category: "Computer Science",
    description: "A comprehensive introduction to algorithms and data structures.",
    publishedYear: 2009,
    pages: 1312,
    totalCopies: 8,
    availableCopies: 5,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    publisher: "MIT Press",
    language: "English",
    edition: "3rd Edition"
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Programming",
    description: "A handbook of agile software craftsmanship.",
    publishedYear: 2008,
    pages: 464,
    totalCopies: 5,
    availableCopies: 3,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    publisher: "Prentice Hall",
    language: "English",
    edition: "1st Edition"
  },
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    isbn: "978-0465050659",
    category: "Design",
    description: "Revised and expanded edition of the classic design book.",
    publishedYear: 2013,
    pages: 368,
    totalCopies: 4,
    availableCopies: 2,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    publisher: "Basic Books",
    language: "English",
    edition: "Revised Edition"
  },
  {
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    isbn: "978-0596517748",
    category: "Programming",
    description: "The definitive guide to JavaScript's good features.",
    publishedYear: 2008,
    pages: 176,
    totalCopies: 6,
    availableCopies: 4,
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=400&fit=crop",
    publisher: "O'Reilly Media",
    language: "English",
    edition: "1st Edition"
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "978-0735211292",
    category: "Self-Help",
    description: "An easy and proven way to build good habits and break bad ones.",
    publishedYear: 2018,
    pages: 320,
    totalCopies: 8,
    availableCopies: 6,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    publisher: "Avery",
    language: "English",
    edition: "1st Edition"
  },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    isbn: "978-0201616224",
    category: "Programming",
    description: "Your journey to mastery in software development.",
    publishedYear: 1999,
    pages: 352,
    totalCopies: 3,
    availableCopies: 1,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    publisher: "Addison-Wesley",
    language: "English",
    edition: "1st Edition"
  },
  {
    title: "System Design Interview",
    author: "Alex Xu",
    isbn: "978-1736049112",
    category: "Computer Science",
    description: "An insider's guide to system design interviews.",
    publishedYear: 2020,
    pages: 320,
    totalCopies: 5,
    availableCopies: 3,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    publisher: "Self-Published",
    language: "English",
    edition: "1st Edition"
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "978-0374533557",
    category: "Psychology",
    description: "A groundbreaking tour of the mind and explains the two systems that drive the way we think.",
    publishedYear: 2011,
    pages: 499,
    totalCopies: 6,
    availableCopies: 4,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    publisher: "Farrar, Straus and Giroux",
    language: "English",
    edition: "1st Edition"
  },
  {
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    isbn: "978-1285741550",
    category: "Mathematics",
    description: "A comprehensive textbook covering single and multivariable calculus.",
    publishedYear: 2015,
    pages: 1368,
    totalCopies: 10,
    availableCopies: 7,
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=400&fit=crop",
    publisher: "Cengage Learning",
    language: "English",
    edition: "8th Edition"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0061120084",
    category: "Literature",
    description: "A gripping tale of racial injustice and childhood innocence.",
    publishedYear: 1960,
    pages: 281,
    totalCopies: 12,
    availableCopies: 9,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    publisher: "J.B. Lippincott & Co.",
    language: "English",
    edition: "1st Edition"
  }
];

const seedBooks = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Insert sample books
    const insertedBooks = await Book.insertMany(sampleBooks);
    console.log(`Successfully seeded ${insertedBooks.length} books`);

    // Display summary
    console.log('\n📚 Books seeded successfully:');
    insertedBooks.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} by ${book.author} (${book.availableCopies}/${book.totalCopies} available)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
};

// Run the seed function
seedBooks();
