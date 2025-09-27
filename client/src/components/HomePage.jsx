import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Navbar from './Navbar';

const HomePage = () => {
  // Sample book data for the carousel
  const books = [
    { id: 1, title: "Tiene Atttive", author: "Deevis hers", cover: "bg-gradient-to-br from-purple-400 to-pink-400" },
    { id: 2, title: "Tiow Mnsalliovs", author: "Feons ters", cover: "bg-gradient-to-br from-blue-400 to-cyan-400" },
    { id: 3, title: "Timo Koositalioem", author: "Deers thes", cover: "bg-gradient-to-br from-green-400 to-emerald-400" },
    { id: 4, title: "Vione Reuturty Falits", author: "Ream loon", cover: "bg-gradient-to-br from-yellow-400 to-orange-400" },
    { id: 5, title: "Yer Conicw Eleatits", author: "fopes tree", cover: "bg-gradient-to-br from-red-400 to-pink-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Navigation */}
      <Navbar showLoginButton={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Academia Library
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover thousands of books, research papers, and academic resources at your fingertips.
          </p>
        </div>

        {/* New Arrivals Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">New Arrivals</h2>
          
          <div className="relative">
            {/* Carousel Container */}
            <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
              {books.map((book) => (
                <div key={book.id} className="flex-shrink-0 w-48">
                  <div className={`w-full h-64 rounded-lg ${book.cover} shadow-lg mb-3 relative`}>
                    <div className="absolute top-2 right-2 bg-white rounded px-2 py-1 text-xs font-semibold text-gray-700">
                      Ebooks
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">{book.title}</h3>
                  <p className="text-gray-500 text-xs">{book.author}</p>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
              <FaChevronLeft className="text-gray-600" />
            </button>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
