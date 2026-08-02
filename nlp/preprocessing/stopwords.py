"""
NLP Preprocessing — Stopword Removal
Removes common English stopwords while preserving security-relevant terms.
"""
from typing import List

# Security-domain tokens that should NEVER be removed even if they
# appear in a generic stopword list.
SECURITY_KEEP = {
    "failed", "denied", "error", "critical", "root", "admin",
    "system", "not", "no", "block", "drop", "reject", "allow",
}


def remove_stopwords(tokens: List[str]) -> List[str]:
    """Remove stopwords using NLTK, preserving security-relevant tokens."""
    try:
        import nltk
        nltk.download("stopwords", quiet=True)
        from nltk.corpus import stopwords
        stop_set = set(stopwords.words("english")) - SECURITY_KEEP
    except Exception:
        # Minimal fallback stopword list
        stop_set = {
            "the", "a", "an", "is", "are", "was", "were", "be", "been",
            "being", "have", "has", "had", "do", "does", "did", "will",
            "would", "could", "should", "may", "might", "can", "shall",
            "to", "of", "in", "for", "on", "with", "at", "by", "from",
            "as", "into", "through", "during", "before", "after",
            "and", "but", "or", "if", "then", "than", "that", "this",
            "it", "its", "i", "me", "my", "we", "our", "you", "your",
        } - SECURITY_KEEP

    return [t for t in tokens if t.lower() not in stop_set]
