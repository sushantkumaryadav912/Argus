"""
Argus Database Initialization
Creates PostgreSQL tables and MongoDB indexes on startup.
"""
from app.core.logging import get_logger
from app.database.postgres import engine, Base
from app.database.mongo import get_mongo_db
from app.core.config import settings

logger = get_logger("init_db")


async def init_postgres() -> None:
    """Create all SQLAlchemy-mapped PostgreSQL tables if they don't exist."""
    # Import all model modules so Base.metadata knows about them
    import app.models.log  # noqa: F401
    import app.models.analysis  # noqa: F401
    import app.models.dashboard  # noqa: F401
    import app.models.entity  # noqa: F401
    import app.models.settings  # noqa: F401

    logger.info("Creating PostgreSQL tables…")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("PostgreSQL tables ready.")


async def init_mongo() -> None:
    """Create MongoDB indexes for performance."""
    try:
        db = get_mongo_db()
        if db is None:
            return

        notif = db[settings.MONGODB_NOTIFICATIONS_COLLECTION]
        await notif.create_index("id", unique=True)
        await notif.create_index("read")
        await notif.create_index("severity")

        alerts = db[settings.MONGODB_ALERTS_COLLECTION]
        await alerts.create_index("timestamp")

        history = db[settings.MONGODB_HISTORY_COLLECTION]
        await history.create_index("timestamp")

        logger.info("MongoDB indexes created.")
    except Exception as e:
        logger.warning("MongoDB index creation skipped: %s", e)


async def init_databases() -> None:
    """Top-level initializer called from lifespan."""
    await init_postgres()
    await init_mongo()
