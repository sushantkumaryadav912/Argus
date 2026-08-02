"""
NLP Semantic Search — Search Engine
Uses SentenceTransformers + FAISS for dense vector similarity search.
Falls back to keyword matching when models are not loaded.
"""
from typing import List, Dict, Any


def semantic_search(
    query: str,
    log_corpus: List[Dict[str, Any]],
    sentence_transformer=None,
    faiss_index=None,
) -> List[Dict[str, Any]]:
    """
    Search the log corpus for entries semantically similar to the query.
    Uses SentenceTransformers + FAISS if available, otherwise keyword fallback.
    """
    # ── Try dense vector search ──
    if sentence_transformer is not None and faiss_index is not None and faiss_index.index is not None:
        try:
            import numpy as np
            query_emb = sentence_transformer.encode([query], convert_to_numpy=True)
            distances, indices = faiss_index.search(query_emb[0], top_k=10)

            results = []
            for dist, idx in zip(distances, indices):
                if 0 <= idx < len(log_corpus):
                    results.append({
                        "log": log_corpus[int(idx)],
                        "similarityScore": round(float(dist), 2),
                        "matchedKeywords": [],
                    })
            return results
        except Exception:
            pass

    # ── Keyword fallback ──
    return _keyword_search(query, log_corpus)


def _keyword_search(query: str, log_corpus: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Token-overlap search fallback."""
    q_tokens = [t for t in query.lower().split() if len(t) > 1]
    if not q_tokens or not log_corpus:
        return []

    results = []
    for log in log_corpus:
        full_text = " ".join([
            str(log.get("id", "")),
            str(log.get("message", "")),
            str(log.get("source", "")),
            str(log.get("service", "")),
            str(log.get("user", "")),
            str(log.get("srcIp", "")),
            str(log.get("category", "")),
            str(log.get("severity", "")),
        ]).lower()

        matched = [t for t in q_tokens if t in full_text]
        if matched:
            score = min(0.98, 0.68 + (len(matched) / len(q_tokens)) * 0.28)
            results.append({
                "log": log,
                "similarityScore": round(score, 2),
                "matchedKeywords": list(set(matched)),
            })

    results.sort(key=lambda x: x["similarityScore"], reverse=True)
    return results
