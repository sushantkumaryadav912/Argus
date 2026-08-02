"""Argus Models Package — import all models for Base.metadata discovery."""
from app.models.log import LogEntryModel
from app.models.analysis import AnalysisResultModel
from app.models.dashboard import DashboardStatsSnapshotModel
from app.models.entity import EntityModel
from app.models.settings import PlatformSettingsModel, UserProfileModel

__all__ = [
    "LogEntryModel",
    "AnalysisResultModel",
    "DashboardStatsSnapshotModel",
    "EntityModel",
    "PlatformSettingsModel",
    "UserProfileModel",
]
