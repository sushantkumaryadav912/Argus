import logging
from typing import Optional
from app.database.mongo import get_mongo_db
from app.core.config import settings
from app.schemas.notification import NotificationSchema, NotificationCreateSchema

logger = logging.getLogger("argus.notification_service")

class NotificationService:
    @staticmethod
    async def get_all_notifications(unread_only: bool = False) -> list[NotificationSchema]:
        db = get_mongo_db()
        collection = db[settings.MONGODB_NOTIFICATIONS_COLLECTION]
        
        query = {}
        if unread_only:
            query["read"] = False

        cursor = collection.find(query, {"_id": 0}).sort("timestamp", -1)
        notifications_data = await cursor.to_list(length=100)
        return [NotificationSchema(**doc) for doc in notifications_data]

    @staticmethod
    async def mark_all_as_read() -> int:
        db = get_mongo_db()
        collection = db[settings.MONGODB_NOTIFICATIONS_COLLECTION]
        result = await collection.update_many({"read": False}, {"$set": {"read": True}})
        return result.modified_count

    @staticmethod
    async def delete_notification(notif_id: str) -> bool:
        db = get_mongo_db()
        collection = db[settings.MONGODB_NOTIFICATIONS_COLLECTION]
        result = await collection.delete_one({"id": notif_id})
        return result.deleted_count > 0

    @staticmethod
    async def create_notification(payload: NotificationCreateSchema) -> NotificationSchema:
        db = get_mongo_db()
        collection = db[settings.MONGODB_NOTIFICATIONS_COLLECTION]

        count = await collection.count_documents({})
        notif_id = f"NOTIF-{str(count + 1).zfill(3)}"

        new_notif = NotificationSchema(
            id=notif_id,
            title=payload.title,
            message=payload.message,
            timestamp="Just now",
            severity=payload.severity,
            read=False,
            category=payload.category,
        )

        doc = new_notif.model_dump()
        await collection.insert_one(doc)
        logger.info("Created MongoDB notification record %s: %s", notif_id, payload.title)
        return new_notif
