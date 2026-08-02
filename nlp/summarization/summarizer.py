"""
NLP Summarization — BART Abstractive Summarizer
Uses facebook/bart-large-cnn for generating human-readable incident reports.
Falls back to template-based summaries when model is not loaded.
"""
from typing import Optional


def summarize(log_text: str, category: str, bart_pipeline=None) -> str:
    """
    Generate an abstractive summary of a security log entry.
    Uses BART model if available, otherwise template fallback.
    """
    # ── Try BART model ──
    if bart_pipeline is not None:
        try:
            result = bart_pipeline(
                log_text,
                max_length=100,
                min_length=25,
                do_sample=False,
            )
            return result[0]["summary_text"]
        except Exception:
            pass

    # ── Template fallback ──
    return _template_summary(log_text, category)


def _template_summary(log_text: str, category: str) -> str:
    """Template-based summarization fallback."""
    templates = {
        "BruteForce Attack": (
            "High-frequency authentication failures detected targeting privileged "
            "accounts within a short time window. Pattern indicates automated "
            "credential stuffing or brute-force dictionary attack."
        ),
        "Malware Activity": (
            "Suspicious process execution or encoded payload detected. "
            "Indicates potential fileless malware, obfuscated command execution, "
            "or unauthorized memory access on the target host."
        ),
        "Privilege Escalation": (
            "Unauthorized administrative policy assignment or privilege elevation "
            "detected. A lower-privilege identity attempted to gain elevated access "
            "to protected resources."
        ),
        "Reconnaissance Scan": (
            "Sequential network probing or port sweep detected from an external "
            "IP address targeting internal services. Consistent with pre-attack "
            "reconnaissance behavior."
        ),
    }
    return templates.get(
        category,
        f"Standard system activity observed: {log_text[:80]}…"
    )
