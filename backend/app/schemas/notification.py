from typing import Literal
from pydantic import BaseModel, Field

class NotificationSchema(BaseModel):
    id: str = Field(..., description="Unique notification identifier, e.g. NOTIF-001")
    title: str = Field(..., description="Notification title")
    message: str = Field(..., description="Notification description / message payload")
    timestamp: str = Field(..., description="Human readable relative time string or ISO timestamp")
    severity: Literal['info', 'warning', 'error', 'critical'] = Field(..., description="Alert severity level")
    read: bool = Field(False, description="Read state flag")
    category: str = Field(..., description="Security event category")

class NotificationCreateSchema(BaseModel):
    title: str
    message: str
    severity: Literal['info', 'warning', 'error', 'critical']
    category: str
