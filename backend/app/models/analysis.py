"""
SQLAlchemy Model: Analysis Results
PostgreSQL table: analysis_results
Stores the output of each NLP pipeline run.
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, JSON
from app.database.postgres import Base


class AnalysisResultModel(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    log_id = Column(String(50), nullable=True, index=True)       # FK to log_entries.id
    log_text = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    summary = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    entities = Column(JSON, nullable=False, default=list)         # [{text, label, start, end}]
    related_logs = Column(JSON, nullable=False, default=list)     # [{id, timestamp, message, …}]
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
