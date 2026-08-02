"""
NLP Preprocessing — Lemmatizer
Reduces tokens to their base (lemma) form using NLTK WordNetLemmatizer.
"""
from typing import List


def lemmatize(tokens: List[str]) -> List[str]:
    """Lemmatize tokens using NLTK WordNet (with fallback to identity)."""
    try:
        import nltk
        nltk.download("wordnet", quiet=True)
        nltk.download("omw-1.4", quiet=True)
        from nltk.stem import WordNetLemmatizer
        wnl = WordNetLemmatizer()
        return [wnl.lemmatize(t) for t in tokens]
    except Exception:
        # Fallback: return tokens unchanged
        return tokens
