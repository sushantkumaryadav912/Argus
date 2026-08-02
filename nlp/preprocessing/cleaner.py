"""
NLP Preprocessing — Text Cleaner
Removes noise, normalizes whitespace, strips non-printable characters.
"""
import re
import html


def clean_log_text(text: str) -> str:
    """Clean a raw security log entry for downstream NLP processing."""
    # Decode HTML entities
    text = html.unescape(text)

    # Remove non-printable / control characters (keep newlines)
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)

    # Normalize multiple spaces / tabs to single space
    text = re.sub(r"[ \t]+", " ", text)

    # Strip leading/trailing whitespace
    text = text.strip()

    return text


def normalize_case(text: str) -> str:
    """Lowercase text while preserving known uppercase tokens (IPs, CVEs)."""
    return text.lower()


def remove_timestamps(text: str) -> str:
    """Strip common syslog / ISO timestamp prefixes."""
    # ISO 8601: 2026-07-31T00:45:12Z or 2026-07-31 00:45:12
    text = re.sub(
        r"\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?[Z]?\s*[-—]?\s*",
        "",
        text,
    )
    # Syslog: Jul 31 00:45:12
    text = re.sub(
        r"[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}\s*",
        "",
        text,
    )
    return text.strip()
