"""
API Router Aggregator
Combines all version 2.0 modular routers under /api prefix.
"""
from fastapi import APIRouter
from app.api.health import router as health_router
from app.api.dashboard import router as dashboard_router
from app.api.logs import router as logs_router
from app.api.analysis import router as analysis_router
from app.api.notifications import router as notifications_router
from app.api.settings import router as settings_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(dashboard_router)
api_router.include_router(logs_router)
api_router.include_router(analysis_router)
api_router.include_router(notifications_router)
api_router.include_router(settings_router)
