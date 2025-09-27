import React, { useState, useEffect } from 'react';
import { FaUserShield, FaSignOutAlt, FaCog, FaUsers, FaBook, FaChartBar, FaSync } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from './Navbar';
import { apiRequest } from '../utils/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch user count from backend
  const fetchUserCount = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/', 'GET');
      if (response.success) {
        setUserCount(response.data.users.length);
        toast.success('User data refreshed successfully!');
      } else {
        console.error('Failed to fetch user count');
        toast.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user count:', error);
      toast.error('Error fetching user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCount();
    
    // Listen for user deletion events to refresh the count
    const handleUserDeleted = () => {
      fetchUserCount();
    };
    
    window.addEventListener('userDeleted', handleUserDeleted);
    
    return () => {
      window.removeEventListener('userDeleted', handleUserDeleted);
    };
  }, []);

  const handleLogout = () => {
    toast.success('Admin logged out successfully!');
    logout();
    navigate('/home');
  };

  const adminStats = [
    { 
      title: 'Total Users', 
      value: loading ? 'Loading...' : userCount.toLocaleString(), 
      icon: FaUsers, 
      color: 'bg-blue-500' 
    },
    { title: 'Total Books', value: '0', icon: FaBook, color: 'bg-green-500' },
    { title: 'Active Sessions', value: '1', icon: FaChartBar, color: 'bg-purple-500' },
    { title: 'System Status', value: 'Online', icon: FaCog, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Navigation */}
      <Navbar showLoginButton={false} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Welcome back, {user?.name || 'Admin'}!
              </p>
            </div>
            
            {/* Admin Profile Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUserShield className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user?.name || 'Admin User'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {user?.email || 'admin@gmail.com'}
                  </p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                    Administrator
                  </span>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <FaSignOutAlt className="text-sm" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Statistics</h2>
            <button
              onClick={fetchUserCount}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="text-white text-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/manage-users')}
                className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <h3 className="font-semibold text-gray-800">Manage Users</h3>
                <p className="text-sm text-gray-600">Add, edit, or remove user accounts</p>
              </button>
              <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-800">Add Books</h3>
                <p className="text-sm text-gray-600">Add new books to the library</p>
              </button>
              <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-800">View Reports</h3>
                <p className="text-sm text-gray-600">Generate and view system reports</p>
              </button>
              <button className="w-full text-left p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-800">System Settings</h3>
                <p className="text-sm text-gray-600">Configure system preferences</p>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">New user registered</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Book returned</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">System backup completed</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
