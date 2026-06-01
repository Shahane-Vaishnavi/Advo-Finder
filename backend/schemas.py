from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime


class PasswordStrengthResponse(BaseModel):
    is_valid: bool
    strength: str
    errors: list = []
    score: int


# User Registration and Authentication Schemas
class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)
    
    @validator('full_name')
    def validate_full_name(cls, v):
        if not v.strip():
            raise ValueError('Full name cannot be empty')
        return v.strip()
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    email_verified: bool
    phone_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Advocate Registration and Authentication Schemas
class AdvocateRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)
    bar_council_number: str = Field(..., min_length=4, max_length=20)
    specialization: str = Field(..., min_length=2, max_length=100)
    city: str = Field(..., min_length=2, max_length=50)
    experience: int = Field(..., ge=0, le=70)
    whatsapp_number: str = Field(..., min_length=10, max_length=15)
    
    @validator('full_name')
    def validate_full_name(cls, v):
        if not v.strip():
            raise ValueError('Full name cannot be empty')
        return v.strip()
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v
    
    @validator('experience')
    def validate_experience(cls, v):
        if v < 0:
            raise ValueError('Experience cannot be negative')
        return v


class AdvocateLoginRequest(BaseModel):
    email: str
    password: str


class AdvocateResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    bar_council_number: str
    specialization: str
    city: str
    experience: int
    whatsapp_number: str
    email_verified: bool
    phone_verified: bool
    profile_verified: bool
    rating: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdvocateProfileResponse(AdvocateResponse):
    about: Optional[str] = None
    cases_handled: Optional[str] = None
    rating: str = "5.0"


# Verification Schemas
class EmailVerificationRequest(BaseModel):
    email: str
    token: str


class OTPVerificationRequest(BaseModel):
    phone: str
    otp: str


class PhoneVerificationRequest(BaseModel):
    phone: str


class VerificationResponse(BaseModel):
    success: bool
    message: str
    email_verified: Optional[bool] = None
    phone_verified: Optional[bool] = None


# Authentication Response
class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: Optional[UserResponse] = None
    advocate: Optional[AdvocateResponse] = None


class MessageResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None


class PasswordCheckRequest(BaseModel):
    password: str


class PasswordCheckResponse(BaseModel):
    is_valid: bool
    strength: str
    errors: list = []
    score: int
