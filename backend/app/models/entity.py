"""
SQLAlchemy Model: Extracted Entities
PostgreSQL table: entities
Stores NER-extracted entities linked to analysis results.
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from app.database.postgres import Base


class EntityModel(Base):
    __tablename__ = "entities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    analysis_id = Column(Integer, nullable=False, index=True)  # FK to analysis_results.id
    text = Column(String(255), nullable=False)
    label = Column(String(50), nullable=False)   # IP_ADDRESS, USER, CVE, HOSTNAME, PORT, etc.
    start = Column(Integer, nullable=False)
    end = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
