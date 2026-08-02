"""Pydantic Schemas: Analysis Results"""
from pydantic import BaseModel, Field
from app.schemas.entity import EntitySchema


class RelatedLogSchema(BaseModel):
    id: str
    timestamp: str
    message: str
    similarityScore: float
    category: str


class AnalyzeRequestSchema(BaseModel):
    logText: str = Field(..., min_length=1, description="Raw security log text to analyze")


class AnalysisResultSchema(BaseModel):
    category: str
    confidence: float
    summary: str
    entities: list[EntitySchema]
    relatedLogs: list[RelatedLogSchema]
    recommendation: str


class SemanticSearchResultSchema(BaseModel):
    log: "LogEntrySchema"
    similarityScore: float
    matchedKeywords: list[str]


# Avoid circular import — resolve forward ref
from app.schemas.log import LogEntrySchema  # noqa: E402
SemanticSearchResultSchema.model_rebuild()
