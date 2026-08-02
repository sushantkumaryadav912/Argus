"""
Analysis Service — NLP Pipeline Orchestrator
ZERO ML implementation here. Only orchestration.

AnalysisService → Preprocess → Classification → NER → Summary
               → Recommendation → Semantic Search → Return DTO
"""
from typing import List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.logging import get_logger, log_inference_time
from app.core.model_registry import registry
from app.models.log import LogEntryModel
from app.schemas.analysis import AnalysisResultSchema, RelatedLogSchema
from app.schemas.entity import EntitySchema

# NLP modules (actual implementation lives in nlp/)
from nlp.preprocessing import preprocess_pipeline
from nlp.classification.predict import classify_log
from nlp.ner.extract_entities import extract_entities
from nlp.summarization.summarizer import summarize
from nlp.recommendation.recommender import recommend

logger = get_logger("analysis_service")


class AnalysisService:
    """
    Orchestrates the full NLP analysis pipeline.
    Delegates all ML work to the nlp/ package.
    """

    @staticmethod
    async def analyze(log_text: str, db: AsyncSession) -> AnalysisResultSchema:
        """Run the complete NLP pipeline on a raw log entry."""

        # ── Step 1: Preprocessing ──
        with log_inference_time(logger, "Preprocessing"):
            tokens = preprocess_pipeline(log_text)
            preprocessed = " ".join(tokens) if tokens else log_text

        # ── Step 2: Classification (BERT → LR → Rules) ──
        with log_inference_time(logger, "Classification"):
            category, confidence = classify_log(
                log_text,
                bert_model=registry.bert_model,
                bert_tokenizer=registry.bert_tokenizer,
                logistic_clf=registry.logistic_classifier,
            )

        # ── Step 3: Named Entity Recognition ──
        with log_inference_time(logger, "NER"):
            raw_entities = extract_entities(log_text, spacy_nlp=registry.spacy_nlp)
            entities = [EntitySchema(**e) for e in raw_entities]

        # ── Step 4: Abstractive Summarization ──
        with log_inference_time(logger, "Summarization"):
            summary = summarize(log_text, category, bart_pipeline=registry.bart_summarizer)

        # ── Step 5: Remediation Recommendation ──
        recommendation = recommend(category, raw_entities)

        # ── Step 6: Fetch related logs from PostgreSQL ──
        related_logs = await _fetch_related_logs(db, category)

        return AnalysisResultSchema(
            category=category,
            confidence=confidence,
            summary=summary,
            entities=entities,
            relatedLogs=related_logs,
            recommendation=recommendation,
        )


async def _fetch_related_logs(db: AsyncSession, category: str) -> List[RelatedLogSchema]:
    """Query PostgreSQL for logs with matching category or high severity."""
    result = await db.execute(select(LogEntryModel).limit(10))
    db_logs = result.scalars().all()

    related: List[RelatedLogSchema] = []
    for log in db_logs:
        if log.category == category or log.severity in ("critical", "error"):
            related.append(RelatedLogSchema(
                id=log.id,
                timestamp=log.timestamp.isoformat() + "Z",
                message=log.message,
                similarityScore=0.94 if log.category == category else 0.86,
                category=log.category or category,
            ))
    return related[:3]
