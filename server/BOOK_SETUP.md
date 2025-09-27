# Book Borrowing System Setup

## Backend Changes Made

### 1. New Models Created
- **Book Model** (`src/models/book.model.js`): Complete book schema with availability tracking
- **Borrow Model** (`src/models/borrow.model.js`): Already existed, handles borrowing logic

### 2. New Controllers & Routes
- **Student Controller** (`src/controllers/student.controller.js`): Handles all book borrowing operations
- **Student Routes** (`src/routes/student.routes.js`): API endpoints for students

### 3. API Endpoints Available
```
GET    /api/v1/students/books              - Get all available books
GET    /api/v1/students/books/search       - Search books (query, category)
GET    /api/v1/students/books/:bookId      - Get book details
POST   /api/v1/students/borrow/:bookId     - Borrow a book
POST   /api/v1/students/return/:borrowId   - Return a book
POST   /api/v1/students/renew/:borrowId    - Renew a book
GET    /api/v1/students/my-books           - Get student's borrowed books
GET    /api/v1/students/my-history         - Get borrowing history
GET    /api/v1/students/overdue            - Get overdue books
```

## Frontend Changes Made

### 1. Updated API Utils
- Added `studentAPI` with all borrowing functions
- Proper error handling and authentication

### 2. Updated BrowseBooks Component
- Connected to real backend API
- Real-time search and filtering
- Proper borrow functionality with user authentication
- Updated data structure to match backend

## Setup Instructions

### 1. Seed the Database with Sample Books
```bash
cd server
node src/scripts/seedBooks.js
```

### 2. Start the Backend Server
```bash
cd server
npm start
```

### 3. Start the Frontend
```bash
cd client
npm run dev
```

## Features Implemented

### ✅ Book Management
- Display all available books with images
- Real-time availability tracking
- Book details (title, author, ISBN, category, etc.)

### ✅ Search & Filter
- Search by title, author, or category
- Filter by category
- Real-time search results

### ✅ Borrowing System
- Borrow books with availability check
- User authentication required
- Real-time availability updates
- Success/error notifications

### ✅ User Experience
- Loading states
- Error handling
- Responsive design
- Toast notifications

## Database Schema

### Book Model
```javascript
{
  title: String (required),
  author: String (required),
  isbn: String (required, unique),
  category: String (required),
  description: String,
  publishedYear: Number,
  pages: Number,
  totalCopies: Number (default: 1),
  availableCopies: Number (default: 1),
  image: String,
  publisher: String,
  language: String (default: "English"),
  edition: String (default: "1st Edition"),
  isActive: Boolean (default: true)
}
```

### Borrow Model
```javascript
{
  student: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  borrowedDate: Date (default: now),
  dueDate: Date (14 days from borrow),
  returnDate: Date,
  isReturned: Boolean (default: false),
  fineAmount: Number (default: 0),
  finePaid: Boolean (default: false),
  renewalCount: Number (default: 0, max: 2)
}
```

## Testing the System

1. **Register/Login** as a student
2. **Navigate** to Browse Books
3. **Search** for books using the search bar
4. **Filter** by category
5. **Borrow** a book (requires login)
6. **Check** availability updates in real-time

## Next Steps

- Add book return functionality
- Implement borrowing history
- Add book renewal feature
- Create admin panel for book management
- Add fine calculation and payment system
