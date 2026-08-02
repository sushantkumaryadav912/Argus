"""
NLP Classification — Dataset Utilities
Helpers for loading and preparing the security log classification dataset.
"""
from typing import List, Tuple, Dict

# Category label → integer mapping
LABEL_MAP: Dict[str, int] = {
    "Normal Activity": 0,
    "BruteForce Attack": 1,
    "Malware Activity": 2,
    "Reconnaissance Scan": 3,
    "Privilege Escalation": 4,
}

LABEL_NAMES: List[str] = list(LABEL_MAP.keys())


def label_to_id(label: str) -> int:
    return LABEL_MAP.get(label, 0)


def id_to_label(label_id: int) -> str:
    return LABEL_NAMES[label_id] if 0 <= label_id < len(LABEL_NAMES) else "Normal Activity"


def prepare_dataset(texts: List[str], labels: List[str]) -> Tuple[List[str], List[int]]:
    """Convert raw texts and string labels into model-ready format."""
    encoded_labels = [label_to_id(l) for l in labels]
    return texts, encoded_labels
