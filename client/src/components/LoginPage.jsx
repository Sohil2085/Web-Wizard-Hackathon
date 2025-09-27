import React, { useState } from 'react';
import { FaUser, FaLock, FaUserShield, FaGraduationCap } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginType, setLoginType] = useState('student'); // 'admin' or 'student'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Admin login validation (hardcoded for now)
    if (loginType === 'admin') {
      if (formData.email !== 'admin@gmail.com' || formData.password !== 'admin') {
        toast.error('Invalid admin credentials');
        return;
      }
      
      // For admin, use mock login
      toast.loading('Admin logging in...', { id: 'login' });
      
      setTimeout(() => {
        toast.success('Admin login successful!', { id: 'login' });
        
        const userData = {
          email: formData.email,
          type: 'admin',
          name: 'Admin User',
          _id: 'admin-id'
        };
        
        login(userData);
        navigate('/admin-dashboard');
      }, 1000);
      
      return;
    }

    // Student login validation
    if (loginType === 'student') {
      if (!formData.email.endsWith('@charusat.edu.in')) {
        toast.error('Please use your institute email address');
        return;
      }
    }

    // API login for students
    toast.loading('Student logging in...', { id: 'login' });
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        toast.success('Student login successful!', { id: 'login' });
        navigate('/home');
      } else {
        toast.error(result.message, { id: 'login' });
      }
    } catch (error) {
      toast.error('Login failed. Please try again.', { id: 'login' });
    }
  };

  const handleForgotPassword = () => {
    toast('Password reset link sent to your email!', {
      icon: '📧',
      duration: 4000,
    });
  };

  const handleSignUp = () => {
    navigate('/signup');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Navigation */}
      <Navbar showLoginButton={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Login Form Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Welcome Back
            </h1>

            {/* Login Type Selection */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setLoginType('student')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                  loginType === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FaGraduationCap className="text-sm" />
                <span className="text-sm font-medium">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                  loginType === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FaUserShield className="text-sm" />
                <span className="text-sm font-medium">Admin</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={
                    loginType === 'admin' 
                      ? 'admin@gmail.com' 
                      : 'enrollment_number@charusat.edu.in'
                  }
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

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {loginType === 'admin' ? 'ADMIN LOGIN' : 'STUDENT LOGIN'}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <button
                onClick={handleForgotPassword}
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                Forgot Password?
              </button>
              <div>
                <button
                  onClick={handleSignUp}
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Don't have an account? Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default LoginPage;
