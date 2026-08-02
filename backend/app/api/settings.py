"""
API Router: Platform & User Settings
GET /api/settings/platform
PATCH /api/settings/platform
GET /api/settings/user
PATCH /api/settings/user
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.schemas.settings import (
    PlatformSettingsSchema,
    PlatformSettingsUpdateSchema,
    UserProfileSchema,
    UserProfileUpdateSchema,
)
from app.services.settings_service import SettingsService

router = APIRouter(prefix="/settings", tags=["Platform & User Settings"])


@router.get("/platform", response_model=PlatformSettingsSchema)
async def get_platform_settings(db: AsyncSession = Depends(get_db)):
    """Fetch system platform settings (FastAPI base URL, model hyperparameters, CUDA GPU toggles)."""
    return await SettingsService.get_platform_settings(db)


@router.patch("/platform", response_model=PlatformSettingsSchema)
async def update_platform_settings(
    payload: PlatformSettingsUpdateSchema, db: AsyncSession = Depends(get_db)
):
    """Update system platform hyperparameters."""
    return await SettingsService.update_platform_settings(payload, db)


@router.get("/user", response_model=UserProfileSchema)
async def get_user_profile(db: AsyncSession = Depends(get_db)):
    """Fetch user profile and security alert preferences."""
    return await SettingsService.get_user_profile(db)


@router.patch("/user", response_model=UserProfileSchema)
async def update_user_profile(
    payload: UserProfileUpdateSchema, db: AsyncSession = Depends(get_db)
):
    """Update user profile preferences."""
    return await SettingsService.update_user_profile(payload, db)
