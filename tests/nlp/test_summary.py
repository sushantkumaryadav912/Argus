"""Unit Tests for NLP Summarization and Recommendation"""
from nlp.summarization.summarizer import summarize
from nlp.recommendation.recommender import recommend


def test_summarize():
    summary = summarize("Failed password for root", "BruteForce Attack")
    assert "credential stuffing" in summary.lower() or "brute-force" in summary.lower()


def test_recommend():
    rec = recommend("BruteForce Attack")
    assert "firewall" in rec.lower() or "sshd_config" in rec.lower()
