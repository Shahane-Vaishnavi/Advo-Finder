# LegalSakhi - Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

---

## 🚀 Setup & Run

### Step 1: Install Backend Dependencies

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate it (Windows)
.venv\Scripts\activate

# Or on Mac/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configure Backend

```bash
# Copy example environment
cp .env.example .env

# Update .env file with your settings:
# - Set SECRET_KEY to a random string
# - Add GEMINI_API_KEY if using AI features
```

### Step 3: Start Backend Server

```bash
# From backend directory (with virtual env activated)
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend running at `http://localhost:8000`

---

### Step 4: Install Frontend Dependencies

```bash
# Open new terminal, go to project root
cd ..
npm install
```

### Step 5: Start Frontend Dev Server

```bash
npm run dev
```

✅ Frontend running at `http://localhost:5173`

---

## 🧪 Test the Features

### Test User Registration
1. Go to http://localhost:5173
2. Click **"User Register"** button
3. Fill in all fields:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `9876543210`
   - Password: `SecurePass@123`
   - Confirm Password: `SecurePass@123`
4. **Check Backend Console** for verification token
5. Enter token to verify email
6. **Check Backend Console** for OTP
7. Enter 6-digit OTP to verify phone
8. ✅ Registration complete! Redirects to login

---

### Test Advocate Registration
1. Click **"Advocate Register"** button
2. Fill in all fields including:
   - Bar Council Number: `BCC12345`
   - Specialization: `Family Law`
   - City: `Mumbai`
   - Experience: `5`
   - WhatsApp Number: `9876543210`
3. Follow email and phone verification
4. ✅ Advocate registration complete!

---

### Test Login
1. Click **"User Login"** or **"Advocate Login"**
2. Enter credentials
3. ✅ Redirects to profile dashboard

---

### Test Advocate Search
1. Click **"Find Advocates"**
2. Select specialization and city
3. Click **"Search"** button
4. ✅ See advocate cards with WhatsApp button

---

### Test WhatsApp Integration
1. Click **"Chat on WhatsApp"** button on any advocate card
2. ✅ Opens WhatsApp with pre-filled message in new tab

---

## 🔑 Key Features Demo

### Password Strength Validation
- Try weak password: `pass` → ❌ Weak
- Try medium password: `Password1` → 🟡 Medium
- Try strong password: `Legal@123` → ✅ Strong

### Verification Flow
- Email link printed to backend console
- OTP printed to backend console
- Both are auto-verified in development

### Dark Mode
- Click moon/sun icon in header
- ✅ Dark mode toggles on entire app

### Responsive Design
- Resize browser to mobile width
- ✅ Layouts adapt smoothly

---

## 📊 Database

SQLite database created automatically at:
```
backend/legalsakhi.db
```

View tables:
```bash
# Install DB viewer or use terminal
sqlite3 legalsakhi.db ".tables"
```

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Change port (Windows)
lsof -i :8000
kill -9 <PID>

# Or change to different port
python -m uvicorn main:app --reload --port 8001
```

### Module Not Found Error
```bash
# Make sure virtual environment is activated
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux

# Then reinstall
pip install -r requirements.txt
```

### CORS Error
- Backend CORS is already configured
- Check both servers are running
- Clear browser cache (Ctrl+Shift+Delete)

### Verification Not Working
- **Check backend console** for verification token/OTP
- Copy and paste the exact token/OTP
- Tokens expire after 24 hours

---

## 📱 API Endpoints Quick Reference

```
User Registration:
POST http://localhost:8000/api/auth/user/register

Advocate Registration:
POST http://localhost:8000/api/auth/advocate/register

User Login:
POST http://localhost:8000/api/auth/user/login

Advocate Login:
POST http://localhost:8000/api/auth/advocate/login

Search Advocates:
GET http://localhost:8000/api/advocates/search?specialization=Family%20Law&city=Mumbai
```

---

## 🎯 File Structure

```
d:\Programming\Projects\Advo Finder\
├── backend/
│   ├── main.py                 ← API endpoints
│   ├── models.py              ← Database models
│   ├── security.py            ← Authentication & security
│   ├── schemas.py             ← Request/response models
│   ├── database.py            ← DB configuration
│   ├── requirements.txt        ← Python dependencies
│   └── .env.example           ← Configuration template
│
├── src/
│   ├── components/
│   │   ├── UserRegistration.jsx
│   │   ├── AdvocateRegistration.jsx
│   │   ├── UserLogin.jsx
│   │   ├── AdvocateLogin.jsx
│   │   ├── PasswordStrengthIndicator.jsx
│   │   ├── AdvocateCard.jsx
│   │   └── AdvocateSearch.jsx
│   ├── styles/
│   │   ├── Auth.css
│   │   ├── AdvocateCard.css
│   │   └── AdvocateSearch.css
│   ├── api.js                 ← API client
│   └── App.jsx                ← Main app component
│
├── package.json               ← Node dependencies
├── COMPLETION_SUMMARY.md      ← What was built
├── IMPLEMENTATION_GUIDE.md    ← Detailed docs
├── FRONTEND_INTEGRATION_GUIDE.md ← Integration steps
└── QUICK_START.md            ← This file
```

---

## 📝 Next Steps

1. **Real Email Sending**
   - Update `backend/security.py` EmailService
   - Add SMTP configuration to .env
   - Use Python's `smtplib` or SendGrid/Mailgun

2. **Real SMS Sending**
   - Update `backend/security.py` SMSService
   - Add Twilio credentials to .env
   - Uncomment SMS functionality

3. **Production Deployment**
   - Update SECRET_KEY in .env
   - Use PostgreSQL instead of SQLite
   - Set HTTPS/SSL
   - Deploy to cloud (AWS/GCP/Azure)

4. **Admin Dashboard**
   - Create admin login
   - Verify advocates manually
   - View statistics

5. **Payment Integration**
   - Add Stripe/Razorpay
   - Create subscription plans
   - Implement billing

---

## 📞 Support

For detailed information:
- See `IMPLEMENTATION_GUIDE.md` for full API docs
- See `FRONTEND_INTEGRATION_GUIDE.md` for frontend setup
- See `COMPLETION_SUMMARY.md` for all features list

---

## ✨ Enjoy!

Your professional legal consultation platform is ready! 🎉

Start by registering users and advocates, then explore the advocate search and WhatsApp integration features.

Good luck! 🚀
