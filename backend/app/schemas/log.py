"""Pydantic Schemas: Log Entries"""
from typing import Literal, Optional
from pydantic import BaseModel

Severity = Literal["info", "warning", "error", "critical"]


class LogEntrySchema(BaseModel):
    id: str
    timestamp: str
    source: str
    service: str
    user: Optional[str] = None
    srcIp: Optional[str] = None
    dstIp: Optional[str] = None
    action: str
    message: str
    severity: Severity
    category: Optional[str] = None
