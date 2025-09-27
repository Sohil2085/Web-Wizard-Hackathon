import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!formData.email.endsWith('@charusat.edu.in')) {
      toast.error('Please use your institute email address');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // API signup
    setIsLoading(true);
    toast.loading('Creating your account...', { id: 'signup' });
    
    try {
      const userData = {
        fullname: formData.fullName,
        email: formData.email,
        username: formData.email.split('@')[0], // Use email prefix as username
        password: formData.password
      };

      const result = await register(userData);
      
      if (result.success) {
        toast.success('Account created successfully!', { id: 'signup' });
        navigate('/home');
      } else {
        toast.error(result.message, { id: 'signup' });
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.', { id: 'signup' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Navigation */}
      <Navbar showLoginButton={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Signup Form Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Create Your Account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="enrollment_number@charusat.edu.in"
                  className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Creating Account...' : 'SIGNUP'}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <button
                onClick={handleLogin}
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                Already have an account? Log In
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
