"""Pydantic Schemas: Settings (Platform & User)"""
from pydantic import BaseModel
from typing import Optional


class PlatformSettingsSchema(BaseModel):
    apiEndpoint: str
    useGpu: bool
    modelType: str
    confidenceThreshold: float


class PlatformSettingsUpdateSchema(BaseModel):
    apiEndpoint: Optional[str] = None
    useGpu: Optional[bool] = None
    modelType: Optional[str] = None
    confidenceThreshold: Optional[float] = None


class UserProfileSchema(BaseModel):
    fullName: str
    email: str
    role: str
    twoFactor: bool
    apiKey: str
    emailAlerts: bool
    criticalSms: bool


class UserProfileUpdateSchema(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    twoFactor: Optional[bool] = None
    emailAlerts: Optional[bool] = None
    criticalSms: Optional[bool] = None
