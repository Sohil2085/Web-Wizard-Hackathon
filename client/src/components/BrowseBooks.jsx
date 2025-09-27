import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaBook, FaUser, FaCalendarAlt, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { studentAPI } from '../utils/api';
import Navbar from './Navbar';

const BrowseBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const categories = ['all', 'Computer Science', 'Programming', 'Design', 'Self-Help', 'Psychology', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Literature', 'History'];

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getAllBooks();
      if (response.success) {
        setBooks(response.data);
        setFilteredBooks(response.data);
      } else {
        toast.error('Failed to load books');
      }
    } catch (error) {
      console.error('Error loading books:', error);
      toast.error('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use API search when search term or category changes
    if (searchTerm || selectedCategory !== 'all') {
      searchBooks();
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, selectedCategory]);

  const searchBooks = async () => {
    try {
      const response = await studentAPI.searchBooks(searchTerm, selectedCategory);
      if (response.success) {
        setFilteredBooks(response.data);
      } else {
        toast.error('Search failed');
      }
    } catch (error) {
      console.error('Error searching books:', error);
      toast.error('Search failed. Please try again.');
    }
  };

  const handleBorrowBook = async (bookId) => {
    if (!user || !user._id) {
      toast.error('Please login to borrow books');
      return;
    }

    const book = books.find(b => b._id === bookId);
    
    if (!book) {
      toast.error('Book not found!');
      return;
    }

    if (book.availableCopies === 0) {
      toast.error('Sorry, this book is currently not available!');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Processing your request...');

    try {
      const response = await studentAPI.borrowBook(bookId, user._id);
      
      if (response.success) {
        // Update book availability in local state
        setBooks(prevBooks =>
          prevBooks.map(b =>
            b._id === bookId
              ? { ...b, availableCopies: b.availableCopies - 1 }
              : b
          )
        );

        // Update filtered books as well
        setFilteredBooks(prevBooks =>
          prevBooks.map(b =>
            b._id === bookId
              ? { ...b, availableCopies: b.availableCopies - 1 }
              : b
          )
        );

        toast.success(`Successfully borrowed "${book.title}"! Please return within 14 days.`, {
          id: loadingToast,
          duration: 5000,
        });
      } else {
        toast.error(response.message || 'Failed to borrow book', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to borrow book. Please try again.';
      toast.error(errorMessage, {
        id: loadingToast,
      });
    }
  };

  const getAvailabilityColor = (availableCopies, totalCopies) => {
    const percentage = (availableCopies / totalCopies) * 100;
    if (percentage >= 50) return 'text-green-600 bg-green-100';
    if (percentage >= 25) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAvailabilityText = (availableCopies) => {
    if (availableCopies === 0) return 'Not Available';
    if (availableCopies === 1) return '1 copy available';
    return `${availableCopies} copies available`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading books...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Browse Books
          </h1>
          <p className="text-xl text-gray-600">
            Discover and borrow from our extensive collection of books
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBooks.length} of {books.length} books
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div key={book._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Book Image */}
                <div className="relative h-64 bg-gray-200">
                  <img
                    src={book.image || `https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=${encodeURIComponent(book.title.substring(0, 20))}`}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=${encodeURIComponent(book.title.substring(0, 20))}`;
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(book.availableCopies, book.totalCopies)}`}>
                      {getAvailabilityText(book.availableCopies)}
                    </span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-2 flex items-center">
                    <FaUser className="mr-2 text-sm" />
                    {book.author}
                  </p>
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    {book.publishedYear || 'N/A'} • {book.pages || 'N/A'} pages
                  </p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {book.description || 'No description available'}
                  </p>

                  {/* Availability Info */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      ISBN: {book.isbn}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {book.availableCopies}/{book.totalCopies} available
                    </span>
                  </div>

                  {/* Borrow Button */}
                  <button
                    onClick={() => handleBorrowBook(book._id)}
                    disabled={book.availableCopies === 0}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                      book.availableCopies === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }`}
                  >
                    {book.availableCopies === 0 ? 'Not Available' : 'Borrow Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowseBooks;
