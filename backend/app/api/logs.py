"""
API Router: Security Log Management (CRUD, Filtering, Pagination)
GET /api/logs
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.schemas.log import LogEntrySchema
from app.services.log_service import LogService

router = APIRouter(prefix="/logs", tags=["Security Logs"])


@router.get("", response_model=list[LogEntrySchema])
async def get_logs(
    severity: Optional[str] = Query(None, description="Filter by severity level"),
    search: Optional[str] = Query(None, description="Keyword search term"),
    limit: int = Query(50, ge=1, le=500, description="Max logs to return"),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve filtered security logs from PostgreSQL database."""
    return await LogService.get_logs(db, severity=severity, search=search, limit=limit)
