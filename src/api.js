import axios from 'axios';

const API_BASE_URL = `${(import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('legalSakhiToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  // Password validation
  checkPasswordStrength: (password) => api.post('/auth/check-password-strength', { password }),
  
  // User registration and login
  registerUser: (data) => api.post('/auth/user/register', data),
  loginUser: (data) => api.post('/auth/user/login', data),
  
  // Advocate registration and login
  registerAdvocate: (data) => api.post('/auth/advocate/register', data),
  loginAdvocate: (data) => api.post('/auth/advocate/login', data),
  
  // Email verification
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  
  // Phone verification
  requestPhoneOTP: (data) => api.post('/auth/request-phone-otp', data),
  verifyPhoneOTP: (data) => api.post('/auth/verify-phone-otp', data),
};

// Advocate API calls
export const advocateAPI = {
  searchAdvocates: (params) => api.get('/advocates/search', { params }),
  getAdvocateProfile: (id) => api.get(`/advocates/${id}`),
};

// Storage helpers
export const tokenStorage = {
  setToken: (token) => localStorage.setItem('legalSakhiToken', token),
  getToken: () => localStorage.getItem('legalSakhiToken'),
  removeToken: () => localStorage.removeItem('legalSakhiToken'),
};

// Auth helpers
export const isAuthenticated = () => !!tokenStorage.getToken();

export default api;
