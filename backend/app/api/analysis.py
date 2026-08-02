"""
API Router: Analysis & Semantic Search
POST /api/logs/analyze
GET /api/logs/semantic-search
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.schemas.analysis import (
    AnalyzeRequestSchema,
    AnalysisResultSchema,
    SemanticSearchResultSchema,
)
from app.services.analysis_service import AnalysisService
from app.services.semantic_service import SemanticService

router = APIRouter(prefix="/logs", tags=["NLP Analysis & Vector Search"])


@router.post("/analyze", response_model=AnalysisResultSchema)
async def analyze_log_text(
    payload: AnalyzeRequestSchema,
    db: AsyncSession = Depends(get_db),
):
    """Run full multi-stage NLP pipeline on raw log entry."""
    return await AnalysisService.analyze(payload.logText, db)


@router.get("/semantic-search", response_model=list[SemanticSearchResultSchema])
async def search_semantic_logs(
    query: str = Query(..., min_length=1, description="Natural language search query"),
    db: AsyncSession = Depends(get_db),
):
    """Semantic dense vector similarity search across security log corpus."""
    return await SemanticService.search(query, db)
