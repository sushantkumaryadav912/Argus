"""
Settings Service
Manages platform settings and user profile configurations in PostgreSQL.
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.settings import PlatformSettingsModel, UserProfileModel
from app.schemas.settings import (
    PlatformSettingsSchema,
    PlatformSettingsUpdateSchema,
    UserProfileSchema,
    UserProfileUpdateSchema,
)


class SettingsService:
    @staticmethod
    async def get_platform_settings(db: AsyncSession) -> PlatformSettingsSchema:
        res = await db.execute(select(PlatformSettingsModel).where(PlatformSettingsModel.id == 1))
        settings_obj = res.scalars().first()
        if not settings_obj:
            return PlatformSettingsSchema(
                apiEndpoint="http://localhost:8000/api",
                useGpu=True,
                modelType="bert-base-uncased",
                confidenceThreshold=0.75,
            )
        return PlatformSettingsSchema(
            apiEndpoint=settings_obj.api_endpoint,
            useGpu=settings_obj.use_gpu,
            modelType=settings_obj.model_type,
            confidenceThreshold=settings_obj.confidence_threshold,
        )

    @staticmethod
    async def update_platform_settings(
        payload: PlatformSettingsUpdateSchema, db: AsyncSession
    ) -> PlatformSettingsSchema:
        res = await db.execute(select(PlatformSettingsModel).where(PlatformSettingsModel.id == 1))
        settings_obj = res.scalars().first()
        if not settings_obj:
            settings_obj = PlatformSettingsModel(id=1)
            db.add(settings_obj)

        if payload.apiEndpoint is not None:
            settings_obj.api_endpoint = payload.apiEndpoint
        if payload.useGpu is not None:
            settings_obj.use_gpu = payload.useGpu
        if payload.modelType is not None:
            settings_obj.model_type = payload.modelType
        if payload.confidenceThreshold is not None:
            settings_obj.confidence_threshold = payload.confidenceThreshold

        await db.commit()
        await db.refresh(settings_obj)
        return PlatformSettingsSchema(
            apiEndpoint=settings_obj.api_endpoint,
            useGpu=settings_obj.use_gpu,
            modelType=settings_obj.model_type,
            confidenceThreshold=settings_obj.confidence_threshold,
        )

    @staticmethod
    async def get_user_profile(db: AsyncSession) -> UserProfileSchema:
        res = await db.execute(select(UserProfileModel).where(UserProfileModel.id == 1))
        user_obj = res.scalars().first()
        if not user_obj:
            return UserProfileSchema(
                fullName="Sushant Kumar Yadav",
                email="sushant@example.com",
                role="Lead Security Analyst (Admin)",
                twoFactor=True,
                apiKey="argus_live_sec_key_9941a87b2...",
                emailAlerts=True,
                criticalSms=True,
            )
        return UserProfileSchema(
            fullName=user_obj.full_name,
            email=user_obj.email,
            role=user_obj.role,
            twoFactor=user_obj.two_factor,
            apiKey=user_obj.api_key,
            emailAlerts=user_obj.email_alerts,
            criticalSms=user_obj.critical_sms,
        )

    @staticmethod
    async def update_user_profile(
        payload: UserProfileUpdateSchema, db: AsyncSession
    ) -> UserProfileSchema:
        res = await db.execute(select(UserProfileModel).where(UserProfileModel.id == 1))
        user_obj = res.scalars().first()
        if not user_obj:
            user_obj = UserProfileModel(id=1)
            db.add(user_obj)

        if payload.fullName is not None:
            user_obj.full_name = payload.fullName
        if payload.email is not None:
            user_obj.email = payload.email
        if payload.twoFactor is not None:
            user_obj.two_factor = payload.twoFactor
        if payload.emailAlerts is not None:
            user_obj.email_alerts = payload.emailAlerts
        if payload.criticalSms is not None:
            user_obj.critical_sms = payload.criticalSms

        await db.commit()
        await db.refresh(user_obj)
        return UserProfileSchema(
            fullName=user_obj.full_name,
            email=user_obj.email,
            role=user_obj.role,
            twoFactor=user_obj.two_factor,
            apiKey=user_obj.api_key,
            emailAlerts=user_obj.email_alerts,
            criticalSms=user_obj.critical_sms,
        )
