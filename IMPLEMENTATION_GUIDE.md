# LegalSakhi - Professional Legal Consultation Platform

A comprehensive full-stack platform connecting verified advocates with users seeking legal assistance. Built with modern web technologies and enterprise-grade security.

## 🌟 Features

### 1. **Secure User Authentication**
- ✅ Email verification with secure tokens
- ✅ OTP-based phone verification
- ✅ Strong password enforcement (minimum 8 characters, uppercase, lowercase, digits, special chars)
- ✅ Account locking after failed login attempts
- ✅ JWT-based secure authentication
- ✅ Password hashing with bcrypt (12 rounds)

### 2. **Advocate WhatsApp Consultation**
- 💬 Direct WhatsApp integration on advocate profiles
- 📱 One-click WhatsApp contact
- 🔄 Pre-filled message templates
- 📞 Phone call option
- 🏷️ Verified advocate badge

### 3. **Comprehensive Registration System**

#### User Registration
- Full Name
- Email Address (with verification)
- Phone Number (with OTP verification)
- Strong Password with real-time validation
- Email verification required before login
- Phone verification required before login

#### Advocate Registration
- All user fields plus:
- Bar Council Registration Number
- Specialization (8+ categories)
- Years of Experience
- City/Location
- WhatsApp Number
- Profile verification badge

### 4. **Advanced Security Features**
- HTTPS-ready architecture
- Input sanitization (XSS prevention)
- SQL injection protection via SQLAlchemy ORM
- CSRF token support ready
- Secure JWT storage
- Rate limiting support
- Account lock mechanism

### 5. **User Interface**
- Professional, modern design
- Responsive on all devices
- Dark mode support
- Legal-tech themed color palette (blue, navy, white)
- Real-time password strength indicator
- Multi-step verification flow

### 6. **Advocate Discovery**
- Search by specialization
- Filter by location
- Rating display
- Experience information
- Verified badge system
- Professional advocate cards

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **Authentication**: JWT + bcrypt
- **Verification**: OTP via pyotp
- **Email**: Integration ready (SMTP)
- **Security**: Multiple layers of validation

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Styling**: CSS3 with dark mode support
- **Routing**: React Router

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- SQLite3

## 🚀 Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Update .env with your configuration
```

### 2. Frontend Setup

```bash
# Navigate to root directory
cd ..

# Install dependencies
npm install

# Create .env.local file for frontend
touch .env.local
```

### 3. Run the Application

#### Start Backend (Terminal 1)
```bash
cd backend
.venv\Scripts\activate  # On Windows
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Start Frontend (Terminal 2)
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### User Registration
```
POST /api/auth/user/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass@123",
  "confirm_password": "SecurePass@123"
}
```

#### Advocate Registration
```
POST /api/auth/advocate/register
Content-Type: application/json

{
  "full_name": "Advocate Jane",
  "email": "jane@example.com",
  "phone": "9876543210",
  "password": "SecurePass@123",
  "confirm_password": "SecurePass@123",
  "bar_council_number": "BCC 12345",
  "specialization": "Family Law",
  "city": "Mumbai",
  "experience": 5,
  "whatsapp_number": "9876543210"
}
```

#### Login
```
POST /api/auth/user/login
or
POST /api/auth/advocate/login

Content-Type: application/json
{
  "email": "user@example.com",
  "password": "SecurePass@123"
}
```

#### Email Verification
```
POST /api/auth/verify-email

{
  "email": "user@example.com",
  "token": "verification_token"
}
```

#### Phone OTP Request
```
POST /api/auth/request-phone-otp

{
  "phone": "9876543210"
}
```

#### Phone OTP Verification
```
POST /api/auth/verify-phone-otp

{
  "phone": "9876543210",
  "otp": "123456"
}
```

#### Search Advocates
```
GET /api/advocates/search?specialization=Family%20Law&city=Mumbai
```

#### Get Advocate Profile
```
GET /api/advocates/{advocate_id}
```

#### Check Password Strength
```
POST /api/auth/check-password-strength

{
  "password": "SecurePass@123"
}
```

## 🔐 Security Features

### Password Security
- Minimum 8 characters
- Must include uppercase letter
- Must include lowercase letter
- Must include digit
- Must include special character
- Real-time strength indicator

### Account Protection
- Maximum 5 failed login attempts
- 30-minute account lockout after threshold
- OTP expiry after 10 minutes
- Verification token expiry after 24 hours

### Data Protection
- Input sanitization on all fields
- XSS prevention
- SQL injection prevention via ORM
- HTTPS-ready (configure in production)
- Secure JWT tokens

## 📱 WhatsApp Integration

When users click "Chat on WhatsApp" button on advocate profiles:
- Opens WhatsApp with pre-filled message
- Message: "Hello Advocate, I found your profile on LegalSakhi and would like legal assistance regarding my issue."
- Uses format: `https://wa.me/{phone_number}?text={encoded_message}`

## 🎨 UI Components

### PasswordStrengthIndicator
Real-time password strength validation with visual feedback
```jsx
<PasswordStrengthIndicator password={password} onChange={handleChange} />
```

### AdvocateCard
Displays advocate profile with contact options
```jsx
<AdvocateCard advocate={advocateData} />
```

### AdvocateSearch
Search and filter advocates
```jsx
<AdvocateSearch initialSearchTerm="Family Law" />
```

### UserRegistration
Multi-step registration with verification
```jsx
<UserRegistration setCurrentPage={setCurrentPage} onRegistrationSuccess={handleSuccess} />
```

### AdvocateRegistration
Advocate-specific registration form
```jsx
<AdvocateRegistration setCurrentPage={setCurrentPage} />
```

## 📊 Database Schema

### Users Table
- id (Integer, Primary Key)
- full_name (String)
- email (String, Unique)
- phone (String, Unique)
- password_hash (String)
- email_verified (Boolean)
- phone_verified (Boolean)
- verification_token (String)
- verification_expiry (DateTime)
- phone_otp (String)
- phone_otp_expiry (DateTime)
- phone_otp_attempts (Integer)
- account_locked (Boolean)
- locked_until (DateTime)
- failed_login_attempts (Integer)
- created_at (DateTime)
- updated_at (DateTime)

### Advocates Table
- id (Integer, Primary Key)
- full_name (String)
- email (String, Unique)
- phone (String, Unique)
- password_hash (String)
- bar_council_number (String, Unique)
- specialization (String)
- city (String)
- experience (Integer)
- whatsapp_number (String)
- email_verified (Boolean)
- phone_verified (Boolean)
- verification_token (String)
- verification_expiry (DateTime)
- phone_otp (String)
- phone_otp_expiry (DateTime)
- phone_otp_attempts (Integer)
- account_locked (Boolean)
- locked_until (DateTime)
- failed_login_attempts (Integer)
- cases_handled (String)
- about (Text)
- rating (String)
- profile_verified (Boolean)
- created_at (DateTime)
- updated_at (DateTime)

## 🔧 Configuration

### Backend (.env)
```
DATABASE_URL=sqlite:///./legalsakhi.db
GEMINI_API_KEY=your_key
SECRET_KEY=your_secret_key
SMTP_SERVER=smtp.gmail.com
TWILIO_ACCOUNT_SID=your_sid
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000/api
```

## 📝 Future Enhancements

- [ ] Real email sending via SMTP
- [ ] SMS sending via Twilio
- [ ] Payment integration
- [ ] Case management system
- [ ] Video consultation
- [ ] Document upload and storage
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] AI-powered case recommendations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see LICENSE file for details.

## 🆘 Support

For support, please contact: support@legalsakhi.com

## 👥 Team

LegalSakhi Development Team

---

**Last Updated**: June 2026
**Version**: 1.0.0
