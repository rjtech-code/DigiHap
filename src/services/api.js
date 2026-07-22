import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USER_ID = import.meta.env.VITE_USER_ID || 'default';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add user-id header to all requests
api.interceptors.request.use(
  (config) => {
    config.headers['user-id'] = USER_ID;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          error.message = data.message || 'Bad request. Please check your input.';
          break;
        case 401:
          error.message = 'Unauthorized access. Please log in again.';
          break;
        case 403:
          error.message = 'Access forbidden. You do not have permission.';
          break;
        case 404:
          error.message = data.message || 'Resource not found.';
          break;
        case 409:
          error.message = data.message || 'Conflict. Resource already exists.';
          break;
        case 422:
          error.message = data.message || 'Validation error. Please check your input.';
          break;
        case 429:
          error.message = 'Too many requests. Please try again later.';
          break;
        case 500:
          error.message = 'Server error. Please try again later.';
          break;
        case 503:
          error.message = 'Service unavailable. Please try again later.';
          break;
        default:
          error.message = data.message || 'An unexpected error occurred.';
      }
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout. Please check your connection and try again.';
      } else {
        error.message = 'Network error. Please check your internet connection.';
      }
    } else {
      // Something else happened
      error.message = error.message || 'An unexpected error occurred.';
    }

    return Promise.reject(error);
  }
);

export default api;