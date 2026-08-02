"""
NLP NER — Entity Extraction
Combines spaCy NER + EntityRuler + regex patterns for maximum recall.
"""
from typing import List, Dict, Any
from nlp.ner.regex_patterns import PATTERNS, KNOWN_USERS


def extract_entities(text: str, spacy_nlp=None) -> List[Dict[str, Any]]:
    """
    Extract named entities from a security log entry.

    Uses three layers:
    1. spaCy NER model (if loaded via ModelRegistry)
    2. spaCy EntityRuler (custom patterns)
    3. Regex fallback (always available)

    Returns list of dicts: {text, label, start, end}
    """
    entities: List[Dict[str, Any]] = []
    seen_spans: set = set()

    # ── Layer 1 + 2: spaCy NER + EntityRuler ──
    if spacy_nlp is not None:
        doc = spacy_nlp(text)
        for ent in doc.ents:
            span = (ent.start_char, ent.end_char)
            if span not in seen_spans:
                seen_spans.add(span)
                entities.append({
                    "text": ent.text,
                    "label": _map_spacy_label(ent.label_),
                    "start": ent.start_char,
                    "end": ent.end_char,
                })

    # ── Layer 3: Regex patterns ──
    for label, pattern in PATTERNS.items():
        for match in pattern.finditer(text):
            # For PORT and USER patterns, capture group 1 if it exists
            if label == "PORT" and match.lastindex:
                span = (match.start(1), match.end(1))
                match_text = f"Port {match.group(1)}"
            elif label == "USER" and match.lastindex:
                span = (match.start(1), match.end(1))
                match_text = match.group(1)
            else:
                span = (match.start(), match.end())
                match_text = match.group(0)

            if span not in seen_spans:
                seen_spans.add(span)
                entities.append({
                    "text": match_text,
                    "label": label,
                    "start": span[0],
                    "end": span[1],
                })

    # ── Known usernames (no prefix required) ──
    for match in KNOWN_USERS.finditer(text):
        span = (match.start(), match.end())
        if span not in seen_spans:
            seen_spans.add(span)
            entities.append({
                "text": match.group(0),
                "label": "USER",
                "start": match.start(),
                "end": match.end(),
            })

    return entities


def _map_spacy_label(label: str) -> str:
    """Map spaCy's default NER labels to Argus entity labels."""
    mapping = {
        "PERSON": "USER",
        "ORG": "HOSTNAME",
        "GPE": "HOSTNAME",
        "PRODUCT": "HOSTNAME",
    }
    return mapping.get(label, label)
