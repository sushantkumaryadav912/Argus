"""
Argus FastAPI Main Application Entry Point (v2.0)
Layered Architecture: REST API -> API Layer -> Service Layer -> NLP Pipeline -> DB Layer
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.model_registry import registry
from app.database.init_db import init_databases
from app.database.mongo import connect_to_mongo, close_mongo_connection
from app.database.seed import seed_databases
from app.api import api_router

# Setup structured logging
setup_logging()
logger = get_logger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("═══ Initializing Argus v2.0 Security Operations Backend ═══")

    # 1. Initialize Database Tables & Indexes
    try:
        await connect_to_mongo()
        await init_databases()
        await seed_databases()
    except Exception as e:
        logger.warning("Database startup notice: %s", e)

    # 2. Pre-load ALL NLP Models into ModelRegistry
    try:
        await registry.load_all()
    except Exception as e:
        logger.warning("ModelRegistry load notice: %s", e)

    logger.info("═══ Argus v2.0 Backend Ready and Operational ═══")
    yield

    logger.info("Shutting down Argus Backend Services...")
    await close_mongo_connection()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api
app.include_router(api_router, prefix=settings.API_V1_STR)
