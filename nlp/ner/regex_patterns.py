"""
NLP NER — Regex Patterns
High-precision regex patterns for cybersecurity entity extraction.
Covers: IP, Hostname, CVE, AWS ARN, AWS Instance, Port, Email, URL, Username
"""
import re

PATTERNS = {
    "IP_ADDRESS": re.compile(
        r"\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b"
    ),
    "CVE": re.compile(
        r"\bCVE-\d{4}-\d{4,7}\b", re.IGNORECASE
    ),
    "AWS_ARN": re.compile(
        r"\barn:aws:[a-z0-9\-]+:[a-z0-9\-]*:\d{12}:[a-zA-Z0-9\-_/:.]+\b"
    ),
    "AWS_INSTANCE": re.compile(
        r"\bi-[0-9a-f]{8,17}\b"
    ),
    "EMAIL": re.compile(
        r"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b"
    ),
    "URL": re.compile(
        r"https?://[^\s<>\"']+", re.IGNORECASE
    ),
    "PORT": re.compile(
        r"\b(?:port|DPT=|SPT=)\s*(\d{1,5})\b", re.IGNORECASE
    ),
    "HOSTNAME": re.compile(
        r"\b(?:[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?\.)+(?:com|net|org|io|dev|gov|edu|co)\b",
        re.IGNORECASE,
    ),
    "USER": re.compile(
        r"\b(?:user|logname|ruser|uid)[\s=:]+([A-Za-z0-9_.\-]+)\b", re.IGNORECASE
    ),
}

# Known security usernames to catch even without a prefix keyword
KNOWN_USERS = re.compile(
    r"\b(?:root|admin|SYSTEM|administrator|analyst_\w+|backup-agent|admin-temp|unknown-arn)\b",
    re.IGNORECASE,
)
