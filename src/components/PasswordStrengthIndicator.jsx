import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { authAPI } from '../api';

export default function PasswordStrengthIndicator({ password, onChange }) {
  const [strength, setStrength] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!password) {
      setStrength(null);
      return;
    }

    const checkPassword = async () => {
      setLoading(true);
      try {
        const response = await authAPI.checkPasswordStrength(password);
        setStrength(response.data);
      } catch (error) {
        console.error('Error checking password strength:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(checkPassword, 500);
    return () => clearTimeout(timeout);
  }, [password]);

  if (!password) return null;

  const getStrengthColor = (strengthLevel) => {
    switch (strengthLevel) {
      case 'Strong':
        return '#10b981';
      case 'Medium':
        return '#f59e0b';
      case 'Weak':
        return '#ef4444';
      default:
        return '#d1d5db';
    }
  };

  const getStrengthPercentage = (score) => {
    return (score / 5) * 100;
  };

  return (
    <div className="password-strength-indicator">
      <div className="strength-bar-container">
        <div
          className="strength-bar"
          style={{
            width: `${strength ? getStrengthPercentage(strength.score) : 0}%`,
            backgroundColor: strength ? getStrengthColor(strength.strength) : '#d1d5db',
          }}
        />
      </div>

      <div className="strength-label">
        <span className="strength-text">Strength: <strong>{strength?.strength || 'Weak'}</strong></span>
        {loading && <span className="loading">Checking...</span>}
      </div>

      {strength?.errors && strength.errors.length > 0 && (
        <div className="password-requirements">
          <h4>Password Requirements:</h4>
          <ul>
            <li>
              {password.length >= 8 ? <FaCheck className="icon-check" /> : <FaTimes className="icon-times" />}
              <span>Minimum 8 characters</span>
            </li>
            <li>
              {/[A-Z]/.test(password) ? <FaCheck className="icon-check" /> : <FaTimes className="icon-times" />}
              <span>One uppercase letter (A-Z)</span>
            </li>
            <li>
              {/[a-z]/.test(password) ? <FaCheck className="icon-check" /> : <FaTimes className="icon-times" />}
              <span>One lowercase letter (a-z)</span>
            </li>
            <li>
              {/\d/.test(password) ? <FaCheck className="icon-check" /> : <FaTimes className="icon-times" />}
              <span>One digit (0-9)</span>
            </li>
            <li>
              {/[!@#$%^&*()_+\-=\[\]{};:'"",.<>?/\\|`~]/.test(password) ? <FaCheck className="icon-check" /> : <FaTimes className="icon-times" />}
              <span>One special character (!@#$%^&*)</span>
            </li>
          </ul>
        </div>
      )}

      <style jsx>{`
        .password-strength-indicator {
          margin: 1rem 0;
        }

        .strength-bar-container {
          width: 100%;
          height: 6px;
          background-color: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .strength-bar {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .strength-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .strength-text {
          color: #666;
        }

        .loading {
          color: #9ca3af;
          font-style: italic;
          font-size: 0.75rem;
        }

        .password-requirements {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .password-requirements h4 {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          color: #374151;
          font-weight: 600;
        }

        .password-requirements ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .password-requirements li {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #555;
        }

        .password-requirements li:last-child {
          margin-bottom: 0;
        }

        .icon-check {
          color: #10b981;
          margin-right: 0.5rem;
          font-size: 0.75rem;
        }

        .icon-times {
          color: #ef4444;
          margin-right: 0.5rem;
          font-size: 0.75rem;
        }

        body.dark .password-requirements {
          background-color: #1f2937;
          border-color: #374151;
        }

        body.dark .password-requirements h4 {
          color: #f3f4f6;
        }

        body.dark .password-requirements li {
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}
