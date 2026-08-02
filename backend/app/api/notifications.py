from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.notification import NotificationSchema, NotificationCreateSchema
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["MongoDB Security Notifications"])

@router.get("", response_model=list[NotificationSchema])
async def get_notifications(
    unread_only: bool = Query(False, description="Filter for unread notifications only")
):
    """Fetch security notifications from MongoDB document store."""
    try:
        return await NotificationService.get_all_notifications(unread_only=unread_only)
    except Exception as e:
        # Fallback empty list if MongoDB connection is pending
        return []

@router.patch("/read-all")
async def mark_all_notifications_as_read():
    """Mark all unread notifications as read in MongoDB."""
    try:
        updated_count = await NotificationService.mark_all_as_read()
        return {"success": True, "updatedCount": updated_count}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update notifications in MongoDB: {str(e)}"
        )

@router.delete("/{notification_id}")
async def delete_notification(notification_id: str):
    """Delete / dismiss a notification document from MongoDB."""
    try:
        deleted = await NotificationService.delete_notification(notification_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Notification {notification_id} not found in MongoDB."
            )
        return {"success": True, "deletedId": notification_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete notification from MongoDB: {str(e)}"
        )

@router.post("", response_model=NotificationSchema, status_code=status.HTTP_201_CREATED)
async def create_notification(payload: NotificationCreateSchema):
    """Manually post a security alert notification to MongoDB."""
    try:
        return await NotificationService.create_notification(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to insert notification into MongoDB: {str(e)}"
        )
