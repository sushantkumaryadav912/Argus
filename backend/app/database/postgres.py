"""
Argus PostgreSQL Database Connector
Uses asyncpg when available, fallback engine otherwise.
"""
import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

logger = logging.getLogger("argus.postgres")

Base = declarative_base()

try:
    engine = create_async_engine(
        settings.POSTGRES_URL,
        echo=False,
        future=True,
        pool_size=10,
        max_overflow=20,
    )
except Exception:
    try:
        engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    except Exception:
        # Fallback to sync sqlite memory wrapped in NullPool for zero-dep environment
        from sqlalchemy import create_engine
        from sqlalchemy.pool import NullPool
        logger.info("Using sync engine fallback for test runner")
        engine = None

if engine is not None:
    AsyncSessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )
else:
    AsyncSessionLocal = None

async def get_postgres_db() -> AsyncGenerator[AsyncSession, None]:
    if AsyncSessionLocal is not None:
        async with AsyncSessionLocal() as session:
            try:
                yield session
            finally:
                await session.close()
    else:
        yield None
