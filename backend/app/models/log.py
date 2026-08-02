"""
SQLAlchemy Model: Log Entries
PostgreSQL table: log_entries
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text
from app.database.postgres import Base


class LogEntryModel(Base):
    __tablename__ = "log_entries"

    id = Column(String(50), primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    source = Column(String(100), index=True)          # Linux Syslog, AWS CloudTrail, Windows Event
    service = Column(String(100), index=True)          # sshd, iam.amazonaws.com, Security Audit
    user = Column(String(100), nullable=True, index=True)
    src_ip = Column(String(50), nullable=True, index=True)
    dst_ip = Column(String(50), nullable=True)
    action = Column(String(100), nullable=False)       # FAILED_LOGIN, AttachUserPolicy, etc.
    message = Column(Text, nullable=False)
    severity = Column(String(20), index=True)          # info | warning | error | critical
    category = Column(String(100), nullable=True, index=True)  # BruteForce Attack, etc.
