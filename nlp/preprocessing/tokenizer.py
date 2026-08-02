"""
NLP Preprocessing — Tokenizer
Uses NLTK word_tokenize for splitting log text into tokens.
"""
from typing import List


def tokenize(text: str) -> List[str]:
    """Tokenize text using NLTK word_tokenize (with fallback to split)."""
    try:
        import nltk
        nltk.download("punkt_tab", quiet=True)
        return nltk.word_tokenize(text)
    except Exception:
        # Fallback: simple whitespace + punctuation split
        import re
        return re.findall(r"\b\w+\b", text)
