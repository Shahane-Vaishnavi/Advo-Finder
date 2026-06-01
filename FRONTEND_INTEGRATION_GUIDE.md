# Frontend Integration Guide

This guide explains how to integrate all the new authentication and advocate discovery components into the existing React application.

## Step 1: Update App.jsx to Include New Routes

Replace the imports and add new state management for the new components:

```jsx
import UserRegistration from './components/UserRegistration';
import AdvocateRegistration from './components/AdvocateRegistration';
import UserLogin from './components/UserLogin';
import AdvocateLogin from './components/AdvocateLogin';
import AdvocateSearch from './components/AdvocateSearch';
import { tokenStorage } from './api';

// Add these new page routes in the main render:
{currentPage === 'userRegistration' && (
  <UserRegistration 
    setCurrentPage={setCurrentPage} 
    onRegistrationSuccess={updateUserSession} 
  />
)}
{currentPage === 'advocateRegistration' && (
  <AdvocateRegistration 
    setCurrentPage={setCurrentPage} 
  />
)}
{currentPage === 'userLogin' && (
  <UserLogin 
    setCurrentPage={setCurrentPage} 
    onLogin={updateUserSession} 
  />
)}
{currentPage === 'advocateLogin' && (
  <AdvocateLogin 
    setCurrentPage={setCurrentPage} 
    onLogin={updateAdvocateSession} 
  />
)}
{currentPage === 'findAdvocates' && (
  <AdvocateSearch 
    initialSearchTerm={searchTerm}
  />
)}
```

## Step 2: Update Header Navigation

Update the header to include login/registration buttons:

```jsx
// In the Header component, add navigation buttons:
{!currentUser && !currentAdvocate && (
  <div className="auth-buttons">
    <button onClick={() => setCurrentPage('userLogin')} className="btn-login">
      User Login
    </button>
    <button onClick={() => setCurrentPage('userRegistration')} className="btn-register">
      User Register
    </button>
    <button onClick={() => setCurrentPage('advocateLogin')} className="btn-login advocate">
      Advocate Login
    </button>
    <button onClick={() => setCurrentPage('advocateRegistration')} className="btn-register advocate">
      Advocate Register
    </button>
  </div>
)}
```

## Step 3: Update Styling

Add these CSS imports to your App.jsx or main CSS file:

```jsx
import './styles/Auth.css';
import './styles/AdvocateCard.css';
import './styles/AdvocateSearch.css';
```

## Step 4: Update Existing Pages

### Update FindAdvocatesPage

Replace with new AdvocateSearch component or integrate it:

```jsx
{currentPage === 'findAdvocates' && (
  <AdvocateSearch initialSearchTerm={searchTerm} />
)}
```

### Update UserLogin and UserProfilePage

These components now have built-in authentication flows.

## Step 5: Environment Setup

Create `.env` file in the root directory:

```
VITE_API_URL=http://localhost:8000/api
```

## Step 6: Initialize Backend

```bash
cd backend

# Activate virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Update .env with your API keys
# GEMINI_API_KEY=your_key
# SECRET_KEY=your_secret_key

# Run migrations (if using Alembic - optional for SQLite)
# alembic upgrade head

# Start the server
python -m uvicorn main:app --reload
```

## Step 7: API Service Configuration

The `src/api.js` file already has all necessary API calls configured:

- Password strength validation
- User registration and login
- Advocate registration and login
- Email verification
- Phone OTP requests and verification
- Advocate search and profile retrieval

## Step 8: Handle Protected Routes

Implement route protection:

```jsx
// Helper function to check if user/advocate is logged in
const isUserLoggedIn = () => !!currentUser && currentUser.email_verified && currentUser.phone_verified;
const isAdvocateLoggedIn = () => !!currentAdvocate && currentAdvocate.email_verified && currentAdvocate.phone_verified;

// Use in conditional rendering:
{isUserLoggedIn() ? (
  <UserProfile />
) : (
  <UserLogin />
)}
```

## Step 9: Error Handling

All components have built-in error handling. Display errors using:

```jsx
{error && (
  <div className="alert alert-error">
    <FaExclamationCircle />
    <span>{error}</span>
  </div>
)}
```

## Step 10: Toast Notifications (Optional)

For better UX, add toast notifications for success messages:

```bash
npm install react-hot-toast
```

Then use in your components:

```jsx
import toast from 'react-hot-toast';

// Show success
toast.success('Email verified successfully!');

// Show error
toast.error('Invalid credentials');

// Show loading
toast.loading('Verifying...');
```

## Testing the Integration

### 1. User Registration Flow
1. Click "User Register" button
2. Fill in all required fields
3. Set a strong password
4. Submit the form
5. Verify email with token from console output
6. Verify phone with OTP from console output
7. Redirect to login page

### 2. User Login Flow
1. Click "User Login" button
2. Enter email and password
3. Should see account locked message if > 5 failed attempts
4. Upon success, redirect to user profile

### 3. Advocate Registration Flow
1. Click "Advocate Register" button
2. Fill in all advocate-specific fields
3. Verify email and phone
4. Redirect to advocate login

### 4. Advocate Search Flow
1. Click "Find Advocates" on home page
2. Select specialization and city filters
3. Click Search button
4. View advocate cards with WhatsApp button
5. Click WhatsApp button to open chat

## Performance Optimization

### 1. Code Splitting
The AdvocateSearch component is large. Consider lazy loading:

```jsx
const AdvocateSearch = React.lazy(() => import('./components/AdvocateSearch'));

// Use with Suspense:
<Suspense fallback={<LoadingSpinner />}>
  <AdvocateSearch />
</Suspense>
```

### 2. API Caching
Implement caching for advocate searches:

```jsx
const [advocateCache, setAdvocateCache] = useState({});

const searchAdvocates = async (filters) => {
  const cacheKey = `${filters.specialization}-${filters.city}`;
  if (advocateCache[cacheKey]) {
    return advocateCache[cacheKey];
  }
  
  const result = await advocateAPI.searchAdvocates(filters);
  setAdvocateCache(prev => ({
    ...prev,
    [cacheKey]: result.data
  }));
  return result.data;
};
```

### 3. Image Optimization
Add placeholder images for advocates:

```jsx
<img 
  src={advocate.image || '/placeholder-advocate.png'} 
  alt={advocate.full_name}
  loading="lazy"
/>
```

## Troubleshooting

### Issue: API Connection Refused
**Solution**: Ensure backend is running on port 8000
```bash
python -m uvicorn main:app --reload
```

### Issue: CORS Error
**Solution**: Check if CORS middleware is enabled in backend (it is by default)

### Issue: Password validation not working
**Solution**: Clear browser cache and restart dev server

### Issue: Verification email not showing
**Solution**: Check browser console for verification link - it's printed to console in development

### Issue: OTP not working
**Solution**: OTP is printed to terminal - check backend terminal output

## Next Steps

1. **Email Integration**: Update `EmailService` in `backend/security.py` to use actual SMTP
2. **SMS Integration**: Update `SMSService` to use Twilio API
3. **Database Migration**: If moving from SQLite to PostgreSQL, update `DATABASE_URL`
4. **Production Deployment**: Update `SECRET_KEY` and use HTTPS
5. **Admin Dashboard**: Create admin panel for verifying advocates
6. **Analytics**: Add tracking for user flows and conversions

## Support

For issues or questions, refer to:
- API Documentation in main README
- Component documentation in each component file
- Backend security documentation in `backend/security.py`
