"""
Argus Dependency Injection
FastAPI Depends() helpers for database sessions and services.
"""
from typing import AsyncGenerator, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.postgres import AsyncSessionLocal
from app.database.mongo import get_mongo_db


async def get_db() -> AsyncGenerator[Optional[AsyncSession], None]:
    """Yield an async PostgreSQL session, auto-closed after request."""
    if AsyncSessionLocal is not None:
        async with AsyncSessionLocal() as session:
            try:
                yield session
            finally:
                await session.close()
    else:
        yield None


def get_mongo():
    """Return the Motor MongoDB database handle."""
    return get_mongo_db()
