from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from google import generativeai as genai
from dotenv import load_dotenv
from datetime import datetime, timedelta
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
