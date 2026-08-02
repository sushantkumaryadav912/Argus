"""Pydantic Schemas: Dashboard Stats"""
from pydantic import BaseModel


class ClassificationBreakdownItem(BaseModel):
    category: str
    count: int
    color: str


class TimeSeriesPoint(BaseModel):
    time: str
    info: int
    warning: int
    error: int
    critical: int


class DashboardStatsSchema(BaseModel):
    totalLogs: int
    threatsDetected: int
    criticalAlerts: int
    avgProcessingTimeMs: float
    classificationBreakdown: list[ClassificationBreakdownItem]
    timeSeriesData: list[TimeSeriesPoint]
