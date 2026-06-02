from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from google import generativeai as genai
from dotenv import load_dotenv
from datetime import datetime, timedelta
from pydantic import BaseModel
import os

from database import engine, SessionLocal
from models import User, Advocate, ClientHistory

from schemas import (
    UserRegisterRequest, UserLoginRequest, UserResponse,
    AdvocateRegisterRequest, AdvocateLoginRequest, AdvocateResponse, AdvocateProfileResponse,
    EmailVerificationRequest, OTPVerificationRequest, PhoneVerificationRequest,
    VerificationResponse, AuthTokenResponse, MessageResponse,
    PasswordCheckRequest, PasswordCheckResponse
)
from security import (
    PasswordSecurity, JWTSecurity, OTPSecurity, InputValidation,
    AccountSecurity, EmailService, SMSService
)

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI(title="LegalSakhi API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security

# Database
User.metadata.create_all(bind=engine)
Advocate.metadata.create_all(bind=engine)
ClientHistory.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_token(authorization: str = Header(None)):
    """Verify JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    token = authorization.replace("Bearer ", "")
    payload = JWTSecurity.verify_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    return payload


# ==================== PASSWORD VALIDATION ====================

@app.post("/api/auth/check-password-strength", response_model=PasswordCheckResponse)
async def check_password_strength(request: PasswordCheckRequest):
    """Check password strength"""
    result = PasswordSecurity.validate_password_strength(request.password)
    return PasswordCheckResponse(**result)


# ==================== USER REGISTRATION & AUTHENTICATION ====================

@app.post("/api/auth/user/register", response_model=MessageResponse)
async def register_user(request: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new user"""
    
    # Validation
    if not InputValidation.validate_email(request.email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    if not InputValidation.validate_phone(request.phone):
        raise HTTPException(status_code=400, detail="Invalid phone number format")
    
    password_validation = PasswordSecurity.validate_password_strength(request.password)
    if not password_validation["is_valid"]:
        raise HTTPException(status_code=400, detail={"errors": password_validation["errors"]})
    
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == request.email) | (User.phone == request.phone)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or phone number already registered"
        )
    
    # Create new user
    verification_token = JWTSecurity.create_verification_token()
    verification_expiry = datetime.utcnow() + timedelta(hours=24)
    
    new_user = User(
        full_name=InputValidation.sanitize_input(request.full_name),
        email=request.email.lower(),
        phone=request.phone,
        password_hash=PasswordSecurity.hash_password(request.password),
        verification_token=verification_token,
        verification_expiry=verification_expiry,
        email_verified=False,
        phone_verified=False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Send verification email (placeholder)
    verification_link = f"http://localhost:5173/verify-email?token={verification_token}&user_id={new_user.id}"
    EmailService.send_verification_email(request.email, verification_link)
    
    return MessageResponse(
        success=True,
        message="User registered successfully. Check your email for verification link.",
        data={"user_id": new_user.id}
    )


@app.post("/api/auth/user/login", response_model=AuthTokenResponse)
async def user_login(request: UserLoginRequest, db: Session = Depends(get_db)):
    """User login"""
    
    # Find user
    user = db.query(User).filter(User.email == request.email.lower()).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check account lock
    is_locked, lock_message = AccountSecurity.check_account_lock(
        user.failed_login_attempts,
        user.locked_until
    )
    if is_locked:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=lock_message)
    
    # Verify password
    if not PasswordSecurity.verify_password(request.password, user.password_hash):
        user.failed_login_attempts = AccountSecurity.increment_failed_attempts(user.failed_login_attempts)
        if user.failed_login_attempts >= 5:
            user.account_locked = True
            user.locked_until = AccountSecurity.get_lock_expiry()
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check if user is verified
    if not user.email_verified or not user.phone_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email and phone before logging in"
        )
    
    # Reset failed attempts
    user.failed_login_attempts = AccountSecurity.reset_failed_attempts()
    user.account_locked = False
    db.commit()
    
    # Create access token
    access_token = JWTSecurity.create_access_token(
        data={"sub": user.email, "user_id": user.id, "type": "user"}
    )
    
    return AuthTokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )


# ==================== ADVOCATE REGISTRATION & AUTHENTICATION ====================

@app.post("/api/auth/advocate/register", response_model=MessageResponse)
async def register_advocate(request: AdvocateRegisterRequest, db: Session = Depends(get_db)):
    """Register a new advocate"""
    
    # Validation
    if not InputValidation.validate_email(request.email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    if not InputValidation.validate_phone(request.phone):
        raise HTTPException(status_code=400, detail="Invalid phone number format")
    
    if not InputValidation.validate_bar_council_number(request.bar_council_number):
        raise HTTPException(status_code=400, detail="Invalid bar council registration number format")
    
    password_validation = PasswordSecurity.validate_password_strength(request.password)
    if not password_validation["is_valid"]:
        raise HTTPException(status_code=400, detail={"errors": password_validation["errors"]})
    
    # Check if advocate already exists
    existing_advocate = db.query(Advocate).filter(
        (Advocate.email == request.email) | 
        (Advocate.phone == request.phone) |
        (Advocate.bar_council_number == request.bar_council_number)
    ).first()
    
    if existing_advocate:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Advocate already registered with this email, phone, or bar council number"
        )
    
    # Create new advocate
    verification_token = JWTSecurity.create_verification_token()
    verification_expiry = datetime.utcnow() + timedelta(hours=24)
    
    new_advocate = Advocate(
        full_name=InputValidation.sanitize_input(request.full_name),
        email=request.email.lower(),
        phone=request.phone,
        password_hash=PasswordSecurity.hash_password(request.password),
        bar_council_number=request.bar_council_number.upper(),
        specialization=InputValidation.sanitize_input(request.specialization),
        city=InputValidation.sanitize_input(request.city),
        experience=request.experience,
        whatsapp_number=request.whatsapp_number,
        verification_token=verification_token,
        verification_expiry=verification_expiry,
        email_verified=False,
        phone_verified=False,
        profile_verified=False
    )
    
    db.add(new_advocate)
    db.commit()
    db.refresh(new_advocate)
    
    # Send verification email
    verification_link = f"http://localhost:5173/verify-email?token={verification_token}&advocate_id={new_advocate.id}"
    EmailService.send_verification_email(request.email, verification_link)
    
    return MessageResponse(
        success=True,
        message="Advocate registered successfully. Check your email for verification link.",
        data={"advocate_id": new_advocate.id}
    )


@app.post("/api/auth/advocate/login", response_model=AuthTokenResponse)
async def advocate_login(request: AdvocateLoginRequest, db: Session = Depends(get_db)):
    """Advocate login"""
    
    # Find advocate
    advocate = db.query(Advocate).filter(Advocate.email == request.email.lower()).first()
    
    if not advocate:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check account lock
    is_locked, lock_message = AccountSecurity.check_account_lock(
        advocate.failed_login_attempts,
        advocate.locked_until
    )
    if is_locked:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=lock_message)
    
    # Verify password
    if not PasswordSecurity.verify_password(request.password, advocate.password_hash):
        advocate.failed_login_attempts = AccountSecurity.increment_failed_attempts(advocate.failed_login_attempts)
        if advocate.failed_login_attempts >= 5:
            advocate.account_locked = True
            advocate.locked_until = AccountSecurity.get_lock_expiry()
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check if advocate is verified
    if not advocate.email_verified or not advocate.phone_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email and phone before logging in"
        )
    
    # Reset failed attempts
    advocate.failed_login_attempts = AccountSecurity.reset_failed_attempts()
    advocate.account_locked = False
    db.commit()
    
    # Create access token
    access_token = JWTSecurity.create_access_token(
        data={"sub": advocate.email, "advocate_id": advocate.id, "type": "advocate"}
    )
    
    return AuthTokenResponse(
        access_token=access_token,
        token_type="bearer",
        advocate=AdvocateResponse.from_orm(advocate)
    )


# ==================== EMAIL VERIFICATION ====================

@app.post("/api/auth/verify-email", response_model=VerificationResponse)
async def verify_email(request: EmailVerificationRequest, db: Session = Depends(get_db)):
    """Verify email address"""
    
    # Check if user
    user = db.query(User).filter(User.email == request.email.lower()).first()
    if user:
        if user.verification_token == request.token:
            if datetime.utcnow() > user.verification_expiry:
                raise HTTPException(status_code=400, detail="Verification link expired")
            
            user.email_verified = True
            user.verification_token = None
            user.verification_expiry = None
            db.commit()
            
            return VerificationResponse(
                success=True,
                message="Email verified successfully",
                email_verified=True
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid verification token")
    
    # Check if advocate
    advocate = db.query(Advocate).filter(Advocate.email == request.email.lower()).first()
    if advocate:
        if advocate.verification_token == request.token:
            if datetime.utcnow() > advocate.verification_expiry:
                raise HTTPException(status_code=400, detail="Verification link expired")
            
            advocate.email_verified = True
            advocate.verification_token = None
            advocate.verification_expiry = None
            db.commit()
            
            return VerificationResponse(
                success=True,
                message="Email verified successfully",
                email_verified=True
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid verification token")
    
    raise HTTPException(status_code=404, detail="Email not found")


# ==================== OTP VERIFICATION ====================

@app.post("/api/auth/request-phone-otp", response_model=MessageResponse)
async def request_phone_otp(request: PhoneVerificationRequest, db: Session = Depends(get_db)):
    """Request OTP for phone verification"""
    
    # Check if user
    user = db.query(User).filter(User.phone == request.phone).first()
    if user:
        otp = OTPSecurity.generate_otp()
        user.phone_otp = otp
        user.phone_otp_expiry = OTPSecurity.get_otp_expiry()
        user.phone_otp_attempts = 0
        db.commit()
        
        SMSService.send_otp_sms(request.phone, otp)
        
        return MessageResponse(
            success=True,
            message="OTP sent to your phone number"
        )
    
    # Check if advocate
    advocate = db.query(Advocate).filter(Advocate.phone == request.phone).first()
    if advocate:
        otp = OTPSecurity.generate_otp()
        advocate.phone_otp = otp
        advocate.phone_otp_expiry = OTPSecurity.get_otp_expiry()
        advocate.phone_otp_attempts = 0
        db.commit()
        
        SMSService.send_otp_sms(request.phone, otp)
        
        return MessageResponse(
            success=True,
            message="OTP sent to your phone number"
        )
    
    raise HTTPException(status_code=404, detail="Phone number not found")


@app.post("/api/auth/verify-phone-otp", response_model=VerificationResponse)
async def verify_phone_otp(request: OTPVerificationRequest, db: Session = Depends(get_db)):
    """Verify phone OTP"""
    
    # Check if user
    user = db.query(User).filter(User.phone == request.phone).first()
    if user:
        if user.phone_otp_attempts >= 3:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many OTP attempts. Request a new OTP.")
        
        if OTPSecurity.verify_otp(request.otp, user.phone_otp, user.phone_otp_expiry):
            user.phone_verified = True
            user.phone_otp = None
            user.phone_otp_expiry = None
            user.phone_otp_attempts = 0
            db.commit()
            
            return VerificationResponse(
                success=True,
                message="Phone number verified successfully",
                phone_verified=True
            )
        else:
            user.phone_otp_attempts += 1
            db.commit()
            raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Check if advocate
    advocate = db.query(Advocate).filter(Advocate.phone == request.phone).first()
    if advocate:
        if advocate.phone_otp_attempts >= 3:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many OTP attempts. Request a new OTP.")
        
        if OTPSecurity.verify_otp(request.otp, advocate.phone_otp, advocate.phone_otp_expiry):
            advocate.phone_verified = True
            advocate.phone_otp = None
            advocate.phone_otp_expiry = None
            advocate.phone_otp_attempts = 0
            db.commit()
            
            return VerificationResponse(
                success=True,
                message="Phone number verified successfully",
                phone_verified=True
            )
        else:
            advocate.phone_otp_attempts += 1
            db.commit()
            raise HTTPException(status_code=400, detail="Invalid OTP")
    
    raise HTTPException(status_code=404, detail="Phone number not found")


# ==================== ADVOCATE PROFILES ====================

@app.get("/api/advocates/search", response_model=list[AdvocateProfileResponse])
async def search_advocates(specialization: str = None, city: str = None, db: Session = Depends(get_db)):
    """Search verified advocates"""
    
    query = db.query(Advocate).filter(Advocate.profile_verified == True)
    
    if specialization:
        query = query.filter(Advocate.specialization.ilike(f"%{specialization}%"))
    
    if city:
        query = query.filter(Advocate.city.ilike(f"%{city}%"))
    
    advocates = query.all()
    return [AdvocateProfileResponse.from_orm(advocate) for advocate in advocates]


@app.get("/api/advocates/{advocate_id}", response_model=AdvocateProfileResponse)
async def get_advocate_profile(advocate_id: int, db: Session = Depends(get_db)):
    """Get advocate profile"""
    
    advocate = db.query(Advocate).filter(Advocate.id == advocate_id).first()
    
    if not advocate:
        raise HTTPException(status_code=404, detail="Advocate not found")
    
    if not advocate.profile_verified:
        raise HTTPException(status_code=403, detail="Advocate profile not verified")
    
    return AdvocateProfileResponse.from_orm(advocate)


# ==================== HEALTH CHECK ====================

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# ==================== INITIALIZATION ====================

def seed_client_history():
    db = SessionLocal()
    try:
        if db.query(ClientHistory).count() == 0:
            sample_history = [
                {
                    "advocate_id": 1,
                    "client_name": "Priya Patil",
                    "case_category": "Domestic Violence",
                    "consultation_date": "15 May 2026",
                    "status": "Closed",
                },
                {
                    "advocate_id": 1,
                    "client_name": "Neha Sharma",
                    "case_category": "Cyber Crime",
                    "consultation_date": "10 May 2026",
                    "status": "Active",
                },
            ]
            for history in sample_history:
                db.add(ClientHistory(**history))
            db.commit()
    finally:
        db.close()


@app.on_event("startup")
async def startup_event():
    seed_client_history()
    print("LegalSakhi backend started successfully")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class UserSignup(BaseModel):
    full_name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class AdvocateSignup(BaseModel):
    full_name: str
    email: str
    password: str
    bar_council_id: str


class AdvocateLogin(BaseModel):
    email: str
    password: str
    bar_council_id: str


class UserProfileUpdate(BaseModel):
    full_name: str
    email: str


class AdvocateProfileUpdate(BaseModel):
    full_name: str
    email: str
    phone: str | None = None
    city: str | None = None
    specialization: str | None = None
    experience: str | None = None
    cases_handled: str | None = None
    about: str | None = None


@app.get("/")
def home():
    return {"message": "LigalSakhi AI Backend Running"}


@app.post("/chat")
def chat(request: ChatRequest):

    prompt = f"""
    You are LigalSakhi AI.

    You help women understand:
    - Women's rights
    - Domestic violence laws
    - Cyber crime complaints
    - Workplace harassment
    - FIR process
    - Legal guidance

    User Question:
    {request.message}
    """

    response = model.generate_content(prompt)

    return {
        "reply": response.text
    }

#User Login API
@app.post("/user/signup")
def user_signup(user: UserSignup):

    db = SessionLocal()

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing:
        return {"message": "Email already exists"}

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=user.password
    )

    db.add(new_user)
    db.commit()

    return {"message": "User Registered", "user_id": new_user.id, "full_name": new_user.full_name, "email": new_user.email}

#User Login API
@app.post("/user/login")
def user_login(user: UserLogin):

    db = SessionLocal()

    existing = db.query(User).filter(
        User.email == user.email,
        User.password == user.password
    ).first()

    if not existing:
        return {"message": "Invalid Credentials"}

    return {
        "message": "Login Successful",
        "user_id": existing.id,
        "full_name": existing.full_name,
        "email": existing.email,
    }


@app.get("/user/profile/{user_id}")
def get_user_profile(user_id: int):
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    db.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
    }


@app.put("/user/profile/{user_id}")
def update_user_profile(user_id: int, profile: UserProfileUpdate):
    db = SessionLocal()
    existing = db.query(User).filter(User.id == user_id).first()
    if not existing:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    existing.full_name = profile.full_name
    existing.email = profile.email
    db.commit()
    result = {
        "id": existing.id,
        "full_name": existing.full_name,
        "email": existing.email,
    }
    db.close()
    return result


@app.get("/advocate/profile/{advocate_id}")
def get_advocate_profile(advocate_id: int):
    db = SessionLocal()
    advocate = db.query(Advocate).filter(Advocate.id == advocate_id).first()
    db.close()
    if not advocate:
        raise HTTPException(status_code=404, detail="Advocate not found")
    return {
        "id": advocate.id,
        "full_name": advocate.full_name,
        "email": advocate.email,
        "bar_council_id": advocate.bar_council_id,
        "phone": advocate.phone,
        "city": advocate.city,
        "specialization": advocate.specialization,
        "experience": advocate.experience,
        "cases_handled": advocate.cases_handled,
        "about": advocate.about,
    }


@app.put("/advocate/profile/{advocate_id}")
def update_advocate_profile(advocate_id: int, profile: AdvocateProfileUpdate):
    db = SessionLocal()
    existing = db.query(Advocate).filter(Advocate.id == advocate_id).first()
    if not existing:
        db.close()
        raise HTTPException(status_code=404, detail="Advocate not found")

    existing.full_name = profile.full_name
    existing.email = profile.email
    existing.phone = profile.phone
    existing.city = profile.city
    existing.specialization = profile.specialization
    existing.experience = profile.experience
    existing.cases_handled = profile.cases_handled
    existing.about = profile.about

    db.commit()
    result = {
        "id": existing.id,
        "full_name": existing.full_name,
        "email": existing.email,
        "bar_council_id": existing.bar_council_id,
        "phone": existing.phone,
        "city": existing.city,
        "specialization": existing.specialization,
        "experience": existing.experience,
        "cases_handled": existing.cases_handled,
        "about": existing.about,
    }
    db.close()
    return result


@app.get("/advocate/clients/{advocate_id}")
def get_advocate_clients(advocate_id: int, status: str = None, search: str = None):
    db = SessionLocal()
    query = db.query(ClientHistory).filter(ClientHistory.advocate_id == advocate_id)
    if status and status.lower() != "all":
        query = query.filter(ClientHistory.status == status)
    if search:
        search_value = f"%{search}%"
        query = query.filter(
            ClientHistory.client_name.like(search_value) |
            ClientHistory.case_category.like(search_value)
        )
    records = query.order_by(ClientHistory.consultation_date.desc()).all()
    db.close()
    return {"clients": [
        {
            "id": record.id,
            "client_name": record.client_name,
            "case_category": record.case_category,
            "consultation_date": record.consultation_date,
            "status": record.status,
        }
        for record in records
    ]}

#Advocate Signup API
@app.post("/advocate/signup")
def advocate_signup(advocate: AdvocateSignup):

    db = SessionLocal()

    existing = db.query(Advocate).filter(
        Advocate.email == advocate.email
    ).first()

    if existing:
        return {"message": "Email already exists"}

    new_advocate = Advocate(
        full_name=advocate.full_name,
        email=advocate.email,
        password=advocate.password,
        bar_council_id=advocate.bar_council_id
    )

    db.add(new_advocate)
    db.commit()

    return {
        "message": "Advocate Registered",
        "advocate_id": new_advocate.id,
        "full_name": new_advocate.full_name,
        "email": new_advocate.email,
        "bar_council_id": new_advocate.bar_council_id,
    }

#Advocate Login API
@app.post("/advocate/login")
def advocate_login(advocate: AdvocateLogin):

    db = SessionLocal()

    existing = db.query(Advocate).filter(
        Advocate.email == advocate.email,
        Advocate.password == advocate.password,
        Advocate.bar_council_id == advocate.bar_council_id
    ).first()

    if not existing:
        return {"message": "Invalid Credentials"}

    return {
        "message": "Login Successful",
        "advocate_id": existing.id,
        "full_name": existing.full_name,
        "email": existing.email,
        "bar_council_id": existing.bar_council_id,
        "phone": existing.phone,
        "city": existing.city,
        "specialization": existing.specialization,
        "experience": existing.experience,
        "cases_handled": existing.cases_handled,
        "about": existing.about,
    }