"""
SQLAlchemy Model: Dashboard Statistics
PostgreSQL table: dashboard_stats_snapshots
"""
from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime, JSON
from app.database.postgres import Base


class DashboardStatsSnapshotModel(Base):
    __tablename__ = "dashboard_stats_snapshots"

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    total_logs = Column(Integer, default=0)
    threats_detected = Column(Integer, default=0)
    critical_alerts = Column(Integer, default=0)
    avg_processing_time_ms = Column(Float, default=14.2)
    classification_breakdown = Column(JSON, nullable=False)  # [{category, count, color}]
    time_series_data = Column(JSON, nullable=False)          # [{time, info, warning, error, critical}]
