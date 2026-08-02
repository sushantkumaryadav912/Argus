"""Unit Tests for NLP Preprocessing Pipeline"""
from nlp.preprocessing.cleaner import clean_log_text, remove_timestamps
from nlp.preprocessing.tokenizer import tokenize
from nlp.preprocessing.stopwords import remove_stopwords
from nlp.preprocessing.lemmatizer import lemmatize
from nlp.preprocessing import preprocess_pipeline


def test_clean_log_text():
    raw = "  2026-07-31  Failed password for root \t\n  "
    cleaned = clean_log_text(raw)
    assert "Failed password for root" in cleaned


def test_remove_timestamps():
    raw = "2026-07-31T00:45:12Z Failed password for root"
    no_ts = remove_timestamps(raw)
    assert no_ts == "Failed password for root"


def test_tokenize():
    tokens = tokenize("Failed password for root")
    assert "Failed" in tokens
    assert "root" in tokens


def test_remove_stopwords():
    tokens = ["Failed", "password", "for", "the", "root"]
    filtered = remove_stopwords(tokens)
    assert "Failed" in filtered  # Security keep token
    assert "root" in filtered
    assert "the" not in filtered


def test_lemmatize():
    tokens = ["passwords", "executed"]
    lemmas = lemmatize(tokens)
    assert len(lemmas) == 2


def test_preprocess_pipeline():
    tokens = preprocess_pipeline("2026-07-31T00:45:12Z Failed password for root from 198.51.100.42")
    assert isinstance(tokens, list)
    assert len(tokens) > 0
