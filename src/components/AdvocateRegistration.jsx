import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { authAPI } from '../api';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import '../styles/Auth.css';

export default function AdvocateRegistration({ setCurrentPage }) {
  const [step, setStep] = useState(1); // 1: Registration, 2: Email Verification, 3: Phone OTP, 4: Complete
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Registration form
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    bar_council_number: '',
    specialization: '',
    city: '',
    experience: '',
    whatsapp_number: '',
  });

  // Verification form
  const [emailToken, setEmailToken] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.full_name.trim()) throw new Error('Full name is required');
      if (!formData.email) throw new Error('Email is required');
      if (!formData.phone) throw new Error('Phone number is required');
      if (!formData.bar_council_number.trim()) throw new Error('Bar council registration number is required');
      if (!formData.specialization.trim()) throw new Error('Specialization is required');
      if (!formData.city.trim()) throw new Error('City is required');
      if (!formData.experience) throw new Error('Experience is required');
      if (!formData.whatsapp_number) throw new Error('WhatsApp number is required');
      if (formData.password !== formData.confirm_password) throw new Error('Passwords do not match');

      const response = await authAPI.registerAdvocate(formData);
      
      setSuccess('Registration successful! Check your email for verification link.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.verifyEmail({
        email: formData.email,
        token: emailToken,
      });
      
      setSuccess('Email verified! Now verify your phone number.');
      setStep(3);
      
      // Request phone OTP
      await authAPI.requestPhoneOTP({ phone: formData.phone });
    } catch (err) {
      setError(err.response?.data?.detail || 'Email verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOTPVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.verifyPhoneOTP({
        phone: formData.phone,
        otp: phoneOTP,
      });
      
      setSuccess('Phone verified! Registration complete. Redirecting to login...');
      setStep(4);
      
      setTimeout(() => {
        setCurrentPage('advocateLogin');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Phone verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError('');
    try {
      setSuccess('Verification email resent!');
    } catch (err) {
      setError('Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      await authAPI.requestPhoneOTP({ phone: formData.phone });
      setSuccess('OTP resent to your phone!');
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card advocate-card">
        <h2>Advocate Registration</h2>
        <p className="subtitle">Join LegalSakhi and Help Women Get Legal Justice</p>
        
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Register</p>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Email</p>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <p>Phone</p>
          </div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>
            <span>✓</span>
            <p>Done</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <FaCheckCircle />
            <span>{success}</span>
          </div>
        )}

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleInputChange}
                  placeholder="Enter WhatsApp number"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bar Council Registration Number</label>
                <input
                  type="text"
                  name="bar_council_number"
                  value={formData.bar_council_number}
                  onChange={handleInputChange}
                  placeholder="e.g., BCC 12345"
                  required
                />
              </div>

              <div className="form-group">
                <label>Specialization</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select specialization</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Civil Law">Civil Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Labor Law">Labor Law</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Constitutional Law">Constitutional Law</option>
                  <option value="Cyber Crime">Cyber Crime</option>
                  <option value="Property Law">Property Law</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  required
                />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  min="0"
                  max="70"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter strong password"
                  required
                />
                <PasswordStrengthIndicator password={formData.password} />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Registering...
                </>
              ) : (
                'Continue to Email Verification'
              )}
            </button>

            <p className="auth-link">
              Already registered?{' '}
              <a onClick={() => setCurrentPage('advocateLogin')} className="link">
                Login here
              </a>
            </p>
          </form>
        )}

        {/* Step 2: Email Verification */}
        {step === 2 && (
          <form onSubmit={handleEmailVerification}>
            <p className="verification-info">
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>

            <div className="form-group">
              <label>Verification Token</label>
              <input
                type="text"
                value={emailToken}
                onChange={(e) => setEmailToken(e.target.value)}
                placeholder="Enter verification token from email"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResendEmail}
              disabled={loading}
            >
              Resend Verification Email
            </button>
          </form>
        )}

        {/* Step 3: Phone OTP Verification */}
        {step === 3 && (
          <form onSubmit={handlePhoneOTPVerification}>
            <p className="verification-info">
              We've sent a 6-digit OTP to <strong>{formData.phone}</strong>
            </p>

            <div className="form-group">
              <label>6-Digit OTP</label>
              <input
                type="text"
                value={phoneOTP}
                onChange={(e) => setPhoneOTP(e.target.value.slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Verifying...
                </>
              ) : (
                'Verify Phone Number'
              )}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResendOTP}
              disabled={loading}
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="completion-message">
            <FaCheckCircle className="completion-icon" />
            <h3>Registration Complete!</h3>
            <p>Your advocate account has been verified successfully.</p>
            <p>Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
}
