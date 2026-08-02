"""
Argus MongoDB Database Connector
Uses Motor AsyncIOMotorClient with fallback when motor is absent.
"""
import logging
from app.core.config import settings

logger = logging.getLogger("argus.mongo")

class MongoManager:
    client = None
    db = None

mongo_manager = MongoManager()

async def connect_to_mongo():
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        logger.info("Connecting to local MongoDB at %s", settings.MONGODB_URL)
        mongo_manager.client = AsyncIOMotorClient(settings.MONGODB_URL)
        mongo_manager.db = mongo_manager.client[settings.MONGODB_DB_NAME]
    except Exception as e:
        logger.warning("MongoDB client initialization bypassed: %s", e)
        mongo_manager.client = None
        mongo_manager.db = None

async def close_mongo_connection():
    if mongo_manager.client:
        try:
            mongo_manager.client.close()
        except Exception:
            pass

def get_mongo_db():
    return mongo_manager.db
