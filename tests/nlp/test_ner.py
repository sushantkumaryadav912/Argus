"""Unit Tests for NLP Named Entity Recognition"""
from nlp.ner.extract_entities import extract_entities


def test_extract_ip_and_user():
    text = "Failed password for root from 198.51.100.42 port 49152 ssh2 (CVE-2023-48795)"
    entities = extract_entities(text)
    
    labels = {e["label"] for e in entities}
    texts = {e["text"] for e in entities}

    assert "IP_ADDRESS" in labels
    assert "198.51.100.42" in texts
    assert "CVE" in labels
    assert "CVE-2023-48795" in texts
    assert "USER" in labels
    assert "root" in texts
