import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Navbar = ({ showLoginButton = true }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // Generate random cartoon avatar URL
  const getRandomAvatar = () => {
    const avatars = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=user5'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const handleLogout = () => {
    const userType = user?.type === 'admin' ? 'Admin' : 'User';
    toast.success(`${userType} logged out successfully!`);
    logout();
    navigate('/home');
  };

  return (
    <header className="bg-academia-blue text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/home" className="flex items-center space-x-3">
            <FaBook className="text-2xl" />
            <span className="text-xl font-bold">Academia Library</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/home" className="hover:text-blue-200 transition-colors">Home</Link>
            <Link to="/browse-books" className="hover:text-blue-200 transition-colors">Browse Books</Link>
            <a href="#" className="hover:text-blue-200 transition-colors">Announcements</a>
          </nav>

          {/* User Profile or Login Button */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              {/* Profile Picture */}
              <div className="flex items-center space-x-2">
                <img
                  src={getRandomAvatar()}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <span className="text-sm font-medium">
                  {user?.type === 'admin' ? 'Admin' : 'Student'}
                </span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition-colors text-sm"
              >
                <FaSignOutAlt className="text-xs" />
                <span>Logout</span>
              </button>
            </div>
          ) : showLoginButton ? (
            <Link 
              to="/login" 
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors"
            >
              Login
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
