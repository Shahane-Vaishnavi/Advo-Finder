from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    
    verification_token = Column(String, nullable=True)
    verification_expiry = Column(DateTime, nullable=True)
    
    phone_otp = Column(String, nullable=True)
    phone_otp_expiry = Column(DateTime, nullable=True)
    phone_otp_attempts = Column(Integer, default=0)
    
    account_locked = Column(Boolean, default=False)
    locked_until = Column(DateTime, nullable=True)
    failed_login_attempts = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Advocate(Base):
    __tablename__ = "advocates"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    
    bar_council_number = Column(String, unique=True, nullable=False)
    specialization = Column(String, nullable=False)
    city = Column(String, nullable=False)
    experience = Column(Integer, nullable=False)
    whatsapp_number = Column(String, nullable=False)
    
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    
    verification_token = Column(String, nullable=True)
    verification_expiry = Column(DateTime, nullable=True)
    
    phone_otp = Column(String, nullable=True)
    phone_otp_expiry = Column(DateTime, nullable=True)
    phone_otp_attempts = Column(Integer, default=0)
    
    account_locked = Column(Boolean, default=False)
    locked_until = Column(DateTime, nullable=True)
    failed_login_attempts = Column(Integer, default=0)
    
    cases_handled = Column(String, nullable=True)
    about = Column(Text, nullable=True)
    rating = Column(String, default="5.0")
    profile_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ClientHistory(Base):
    __tablename__ = "client_history"

    id = Column(Integer, primary_key=True, index=True)
    advocate_id = Column(Integer)
    client_name = Column(String)
    case_category = Column(String)
    consultation_date = Column(String)
    status = Column(String)
