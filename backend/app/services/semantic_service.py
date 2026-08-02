"""
Semantic Service
Orchestrates semantic search using SentenceTransformers + FAISS index.
Delegates to `nlp.semantic.semantic_search`.
"""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.model_registry import registry
from app.models.log import LogEntryModel
from app.schemas.log import LogEntrySchema
from app.schemas.analysis import SemanticSearchResultSchema
from nlp.semantic.semantic_search import semantic_search


class SemanticService:
    @staticmethod
    async def search(query: str, db: AsyncSession) -> List[SemanticSearchResultSchema]:
        result = await db.execute(select(LogEntryModel).limit(50))
        all_logs = result.scalars().all()

        log_corpus = [
            {
                "id": log.id,
                "timestamp": log.timestamp.isoformat() + "Z",
                "source": log.source,
                "service": log.service,
                "user": log.user,
                "srcIp": log.src_ip,
                "dstIp": log.dst_ip,
                "action": log.action,
                "message": log.message,
                "severity": log.severity,
                "category": log.category,
            }
            for log in all_logs
        ]

        raw_results = semantic_search(
            query=query,
            log_corpus=log_corpus,
            sentence_transformer=registry.sentence_transformer,
            faiss_index=registry.faiss_index,
        )

        return [
            SemanticSearchResultSchema(
                log=LogEntrySchema(**res["log"]),
                similarityScore=res["similarityScore"],
                matchedKeywords=res["matchedKeywords"],
            )
            for res in raw_results
        ]
