"""
SQLAlchemy Models: Platform Settings & User Profile
PostgreSQL tables: platform_settings, user_profiles
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean
from app.database.postgres import Base


class PlatformSettingsModel(Base):
    __tablename__ = "platform_settings"

    id = Column(Integer, primary_key=True, default=1)
    api_endpoint = Column(String(255), default="http://localhost:8000/api")
    use_gpu = Column(Boolean, default=True)
    model_type = Column(String(100), default="bert-base-uncased")
    confidence_threshold = Column(Float, default=0.75)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UserProfileModel(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, default=1)
    full_name = Column(String(100), default="Sushant Kumar Yadav")
    email = Column(String(150), default="sushant@example.com")
    role = Column(String(100), default="Lead Security Analyst (Admin)")
    two_factor = Column(Boolean, default=True)
    api_key = Column(String(255), default="argus_live_sec_key_9941a87b2...")
    email_alerts = Column(Boolean, default=True)
    critical_sms = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
