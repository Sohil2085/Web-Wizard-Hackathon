import axios from 'axios';
import { getApiBaseUrl, logEnvironmentInfo } from './environment.js';

// Get API base URL using environment utility
const API_BASE_URL = getApiBaseUrl();

// Log environment info for debugging (only in development)
if (import.meta.env.DEV) {
  logEnvironmentInfo();
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create separate axios instance for user management
const userApi = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create separate axios instance for student operations
const studentApi = axios.create({
  baseURL: `${API_BASE_URL}/students`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add same interceptors to userApi
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add same interceptors to studentApi
studentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

studentApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API request function for user management
export const apiRequest = async (url, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      url,
      data,
    };
    
    const response = await userApi(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// API functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },
};

// Student API functions for book borrowing
export const studentAPI = {
  // Get all available books
  getAllBooks: async () => {
    const response = await studentApi.get('/books');
    return response.data;
  },

  // Search books
  searchBooks: async (query, category) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'all') params.append('category', category);
    
    const response = await studentApi.get(`/books/search?${params.toString()}`);
    return response.data;
  },

  // Get book by ID
  getBookById: async (bookId) => {
    const response = await studentApi.get(`/books/${bookId}`);
    return response.data;
  },

  // Borrow a book
  borrowBook: async (bookId, studentId) => {
    const response = await studentApi.post(`/borrow/${bookId}`, { studentId });
    return response.data;
  },

  // Return a book
  returnBook: async (borrowId, studentId) => {
    const response = await studentApi.post(`/return/${borrowId}`, { studentId });
    return response.data;
  },

  // Renew a book
  renewBook: async (borrowId, studentId) => {
    const response = await studentApi.post(`/renew/${borrowId}`, { studentId });
    return response.data;
  },

  // Get student's borrowed books
  getMyBorrowedBooks: async (studentId) => {
    const response = await studentApi.get(`/my-books?studentId=${studentId}`);
    return response.data;
  },

  // Get student's borrowing history
  getMyBorrowingHistory: async (studentId) => {
    const response = await studentApi.get(`/my-history?studentId=${studentId}`);
    return response.data;
  },

  // Get overdue books
  getOverdueBooks: async (studentId) => {
    const response = await studentApi.get(`/overdue?studentId=${studentId}`);
    return response.data;
  },
};

export default api;
