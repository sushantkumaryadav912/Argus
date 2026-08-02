"""
API Router: System Health Check
GET /api/health
Returns service status, loaded model registry state, database connections, and device specs.
"""
import sys
from fastapi import APIRouter
from app.core.model_registry import registry
from app.core.config import settings

router = APIRouter(tags=["System Health"])


@router.get("/health")
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "pythonVersion": sys.version,
        "modelsLoaded": registry.is_loaded,
        "models": {
            "bert": registry.bert_model is not None,
            "bart": registry.bart_summarizer is not None,
            "spacy": registry.spacy_nlp is not None,
            "sentenceTransformer": registry.sentence_transformer is not None,
            "logisticRegression": registry.logistic_classifier is not None,
        },
        "databases": {
            "postgres": settings.POSTGRES_URL,
            "mongodb": settings.MONGODB_URL,
        },
    }
