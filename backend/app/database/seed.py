"""
Argus Database Seeding (v2.0)
Populates initial logs, dashboard statistics, settings, and notifications.
"""
import logging
from datetime import datetime
from sqlalchemy import select

from app.database.postgres import engine, Base, AsyncSessionLocal
from app.database.mongo import get_mongo_db
from app.core.config import settings
from app.models.log import LogEntryModel
from app.models.dashboard import DashboardStatsSnapshotModel
from app.models.settings import PlatformSettingsModel, UserProfileModel

logger = logging.getLogger("argus.seed")

INITIAL_LOGS = [
    {
        "id": "LOG-9941",
        "timestamp": datetime.fromisoformat("2026-07-31T00:45:12"),
        "source": "Linux Syslog",
        "service": "sshd",
        "user": "root",
        "src_ip": "198.51.100.42",
        "dst_ip": "10.0.4.15",
        "action": "FAILED_LOGIN",
        "message": "Failed password for root from 198.51.100.42 port 49152 ssh2",
        "severity": "critical",
        "category": "BruteForce Attack",
    },
    {
        "id": "LOG-9940",
        "timestamp": datetime.fromisoformat("2026-07-31T00:44:50"),
        "source": "AWS CloudTrail",
        "service": "iam.amazonaws.com",
        "user": "admin-temp",
        "src_ip": "203.0.113.195",
        "dst_ip": "aws-global",
        "action": "AttachUserPolicy",
        "message": "AttachUserPolicy API call executed with AdministratorAccess policy on user analyst_dev",
        "severity": "error",
        "category": "Privilege Escalation",
    },
    {
        "id": "LOG-9939",
        "timestamp": datetime.fromisoformat("2026-07-31T00:42:01"),
        "source": "Windows Event",
        "service": "Security Audit",
        "user": "SYSTEM",
        "src_ip": "127.0.0.1",
        "dst_ip": "10.0.4.15",
        "action": "PROCESS_CREATION",
        "message": "Process creation: powershell.exe -nop -w hidden -encodedcommand JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAA...",
        "severity": "critical",
        "category": "Malware Activity",
    },
    {
        "id": "LOG-9938",
        "timestamp": datetime.fromisoformat("2026-07-31T00:39:15"),
        "source": "Linux Syslog",
        "service": "iptables",
        "user": None,
        "src_ip": "45.33.32.156",
        "dst_ip": "10.0.4.15",
        "action": "PORT_SCAN",
        "message": "IN=eth0 OUT= MAC=00:16:3e:2b:58:61 SRC=45.33.32.156 DST=10.0.4.15 PROTO=TCP SPT=54312 DPT=22 SYN",
        "severity": "warning",
        "category": "Reconnaissance Scan",
    },
    {
        "id": "LOG-9937",
        "timestamp": datetime.fromisoformat("2026-07-31T00:35:00"),
        "source": "AWS CloudTrail",
        "service": "s3.amazonaws.com",
        "user": "backup-agent",
        "src_ip": "192.0.2.78",
        "dst_ip": "s3-bucket-logs",
        "action": "GetObject",
        "message": "GetObject call on bucket production-db-backups key 2026-07-30.dump",
        "severity": "info",
        "category": "Normal Activity",
    },
]

INITIAL_NOTIFICATIONS = [
    {
        "id": "NOTIF-001",
        "title": "High-Frequency SSH BruteForce Detected",
        "message": "Origin IP 198.51.100.42 reached 48 failed password attempts targeting root.",
        "timestamp": "5 mins ago",
        "severity": "critical",
        "read": False,
        "category": "BruteForce Attack",
    },
    {
        "id": "NOTIF-002",
        "title": "Privilege Escalation Alert",
        "message": "User admin-temp executed AttachUserPolicy with AdministratorAccess on analyst_dev.",
        "timestamp": "15 mins ago",
        "severity": "error",
        "read": False,
        "category": "Privilege Escalation",
    },
    {
        "id": "NOTIF-003",
        "title": "Obfuscated PowerShell Execution Stage",
        "message": "Encoded PowerShell command executed on host 10.0.4.15.",
        "timestamp": "25 mins ago",
        "severity": "critical",
        "read": True,
        "category": "Malware Activity",
    },
    {
        "id": "NOTIF-004",
        "title": "Port Scan Detected",
        "message": "Sequential TCP SYN port sweep originating from IP 45.33.32.156.",
        "timestamp": "1 hour ago",
        "severity": "warning",
        "read": True,
        "category": "Reconnaissance Scan",
    },
    {
        "id": "NOTIF-005",
        "title": "System Model Pipeline Update",
        "message": "BERT classification model weights re-indexed and calibrated on latest log corpus.",
        "timestamp": "3 hours ago",
        "severity": "info",
        "read": True,
        "category": "System Telemetry",
    },
]


async def seed_databases():
    if AsyncSessionLocal is None:
        logger.info("Database seeding bypassed (no async DB driver installed)")
        return

    logger.info("Initializing & seeding PostgreSQL tables...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncSessionLocal() as session:
            res = await session.execute(select(LogEntryModel))
            existing = res.scalars().all()
            if not existing:
                for log_data in INITIAL_LOGS:
                    session.add(LogEntryModel(**log_data))

                stats_snapshot = DashboardStatsSnapshotModel(
                    total_logs=148920,
                    threats_detected=1420,
                    critical_alerts=87,
                    avg_processing_time_ms=14.2,
                    classification_breakdown=[
                        {"category": "Normal Activity", "count": 147500, "color": "#10b981"},
                        {"category": "BruteForce Attack", "count": 850, "color": "#ef4444"},
                        {"category": "Malware Activity", "count": 310, "color": "#dc2626"},
                        {"category": "Reconnaissance Scan", "count": 180, "color": "#f59e0b"},
                        {"category": "Privilege Escalation", "count": 80, "color": "#8b5cf6"},
                    ],
                    time_series_data=[
                        {"time": "00:00", "info": 4200, "warning": 120, "error": 25, "critical": 2},
                        {"time": "04:00", "info": 3100, "warning": 90, "error": 15, "critical": 1},
                        {"time": "08:00", "info": 6800, "warning": 210, "error": 45, "critical": 8},
                        {"time": "12:00", "info": 9500, "warning": 380, "error": 82, "critical": 18},
                        {"time": "16:00", "info": 8900, "warning": 310, "error": 64, "critical": 12},
                        {"time": "20:00", "info": 5400, "warning": 180, "error": 38, "critical": 5},
                    ],
                )
                session.add(stats_snapshot)
                session.add(PlatformSettingsModel())
                session.add(UserProfileModel())
                await session.commit()
                logger.info("Successfully seeded PostgreSQL data.")
    except Exception as e:
        logger.warning("PostgreSQL seed notice: %s", e)

    # Seed MongoDB Notifications
    try:
        db = get_mongo_db()
        if db is not None:
            collection = db[settings.MONGODB_NOTIFICATIONS_COLLECTION]
            count = await collection.count_documents({})
            if count == 0:
                await collection.insert_many(INITIAL_NOTIFICATIONS)
                logger.info("Successfully seeded MongoDB notifications collection.")
    except Exception as e:
        logger.warning("MongoDB seed notice: %s", e)
