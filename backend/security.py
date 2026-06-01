import bcrypt
import jwt
import pyotp
import secrets
import re
from datetime import datetime, timedelta
from typing import Optional, Dict
import os
from dotenv import load_dotenv

load_dotenv()

# Security Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
VERIFICATION_TOKEN_EXPIRE_HOURS = 24
OTP_EXPIRE_MINUTES = 10
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 30


class PasswordSecurity:
    """Handle password hashing and validation"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    
    @staticmethod
    def validate_password_strength(password: str) -> Dict[str, any]:
        """
        Validate password strength
        Requirements:
        - Minimum 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character
        """
        result = {
            "is_valid": True,
            "strength": "Weak",
            "errors": [],
            "score": 0
        }
        
        if len(password) < 8:
            result["errors"].append("Password must be at least 8 characters long")
            result["is_valid"] = False
        else:
            result["score"] += 1
        
        if not re.search(r'[A-Z]', password):
            result["errors"].append("Password must contain at least one uppercase letter")
            result["is_valid"] = False
        else:
            result["score"] += 1
        
        if not re.search(r'[a-z]', password):
            result["errors"].append("Password must contain at least one lowercase letter")
            result["is_valid"] = False
        else:
            result["score"] += 1
        
        if not re.search(r'\d', password):
            result["errors"].append("Password must contain at least one digit")
            result["is_valid"] = False
        else:
            result["score"] += 1
        
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]', password):
            result["errors"].append("Password must contain at least one special character")
            result["is_valid"] = False
        else:
            result["score"] += 1
        
        # Determine strength level
        if result["score"] == 5:
            result["strength"] = "Strong"
        elif result["score"] >= 3:
            result["strength"] = "Medium"
        else:
            result["strength"] = "Weak"
        
        return result


class JWTSecurity:
    """Handle JWT token generation and verification"""
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_access_token(token: str) -> Optional[Dict]:
        """Verify and decode JWT access token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def create_verification_token() -> str:
        """Create a verification token for email/phone verification"""
        return secrets.token_urlsafe(32)


class OTPSecurity:
    """Handle OTP generation and verification"""
    
    @staticmethod
    def generate_otp() -> str:
        """Generate 6-digit OTP"""
        return str(secrets.randbelow(1000000)).zfill(6)
    
    @staticmethod
    def verify_otp(provided_otp: str, stored_otp: str, otp_expiry: datetime) -> bool:
        """Verify OTP and check expiry"""
        if datetime.utcnow() > otp_expiry:
            return False
        return provided_otp == stored_otp
    
    @staticmethod
    def get_otp_expiry() -> datetime:
        """Get OTP expiry time"""
        return datetime.utcnow() + timedelta(minutes=OTP_EXPIRE_MINUTES)


class InputValidation:
    """Validate user inputs"""
    
    EMAIL_PATTERN = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    PHONE_PATTERN = r'^\+?1?\d{9,15}$'
    BAR_COUNCIL_PATTERN = r'^[A-Z]{2,4}\s?\d{4,6}$'
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        return re.match(InputValidation.EMAIL_PATTERN, email) is not None
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format"""
        # Remove spaces, dashes, and parentheses for validation
        clean_phone = re.sub(r'[\s\-().]', '', phone)
        return re.match(InputValidation.PHONE_PATTERN, clean_phone) is not None
    
    @staticmethod
    def validate_bar_council_number(bar_council_number: str) -> bool:
        """Validate bar council registration number"""
        return re.match(InputValidation.BAR_COUNCIL_PATTERN, bar_council_number.strip()) is not None
    
    @staticmethod
    def sanitize_input(user_input: str) -> str:
        """Sanitize user input to prevent XSS and injection attacks"""
        if not isinstance(user_input, str):
            return ""
        
        # Remove dangerous characters
        dangerous_chars = ['<', '>', '"', "'", ';', '--', '/*', '*/', 'xp_', 'sp_']
        sanitized = user_input
        for char in dangerous_chars:
            sanitized = sanitized.replace(char, '')
        
        # Limit length
        return sanitized[:500].strip()


class AccountSecurity:
    """Handle account security features"""
    
    @staticmethod
    def check_account_lock(failed_attempts: int, locked_until: Optional[datetime]) -> tuple[bool, Optional[str]]:
        """Check if account is locked"""
        if failed_attempts >= MAX_LOGIN_ATTEMPTS:
            if locked_until and datetime.utcnow() < locked_until:
                minutes_remaining = int((locked_until - datetime.utcnow()).total_seconds() / 60)
                return True, f"Account locked. Try again in {minutes_remaining} minutes."
            return False, None
        return False, None
    
    @staticmethod
    def get_lock_expiry() -> datetime:
        """Get account lock expiry time"""
        return datetime.utcnow() + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
    
    @staticmethod
    def increment_failed_attempts(current_attempts: int) -> int:
        """Increment failed login attempts"""
        return current_attempts + 1
    
    @staticmethod
    def reset_failed_attempts() -> int:
        """Reset failed login attempts"""
        return 0


class EmailService:
    """Email sending service (placeholder for email implementation)"""
    
    @staticmethod
    def send_verification_email(email: str, verification_link: str) -> bool:
        """Send verification email"""
        # TODO: Implement actual email sending using SMTP
        print(f"Verification email sent to {email}")
        print(f"Verification link: {verification_link}")
        return True
    
    @staticmethod
    def send_otp_email(email: str, otp: str) -> bool:
        """Send OTP via email"""
        # TODO: Implement actual email sending using SMTP
        print(f"OTP {otp} sent to {email}")
        return True


class SMSService:
    """SMS sending service (placeholder for SMS implementation)"""
    
    @staticmethod
    def send_otp_sms(phone: str, otp: str) -> bool:
        """Send OTP via SMS"""
        # TODO: Implement actual SMS sending using Twilio or similar
        print(f"OTP {otp} sent to {phone}")
        return True
