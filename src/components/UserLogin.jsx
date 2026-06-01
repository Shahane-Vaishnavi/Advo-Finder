import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { authAPI, tokenStorage } from '../api';
import '../styles/Auth.css';

export default function UserLogin({ setCurrentPage, onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.email) throw new Error('Email is required');
      if (!formData.password) throw new Error('Password is required');

      const response = await authAPI.loginUser(formData);
      
      // Store token
      tokenStorage.setToken(response.data.access_token);
      
      // Call onLogin callback
      onLogin(response.data.user);
      
      // Navigate to profile
      setCurrentPage('userProfile');
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many failed attempts. Account locked. Try again later.');
      } else if (err.response?.status === 403) {
        setError('Please verify your email and phone before logging in.');
      } else {
        setError(err.response?.data?.detail || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>User Login</h2>
        <p className="subtitle">Access your LegalSakhi account</p>

        {error && (
          <div className="alert alert-error">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinner" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <p className="auth-link">
            Don't have an account?{' '}
            <a onClick={() => setCurrentPage('userRegistration')} className="link">
              Register here
            </a>
          </p>

          <p className="auth-link">
            Are you an advocate?{' '}
            <a onClick={() => setCurrentPage('advocateLogin')} className="link">
              Login as advocate
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
