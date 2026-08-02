"""
API Router: Dashboard Statistics
GET /api/dashboard/stats
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.schemas.dashboard import DashboardStatsSchema
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard Statistics"])


@router.get("/stats", response_model=DashboardStatsSchema)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    """Fetch live security operations dashboard metrics and classification breakdown."""
    return await DashboardService.get_stats(db)
