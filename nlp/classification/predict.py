"""
NLP Classification — Predict
Unified prediction interface that selects the best available classifier.
Falls back: BERT → Logistic Regression → Rule-based heuristic.
"""
from typing import Tuple


def classify_log(text: str, bert_model=None, bert_tokenizer=None, logistic_clf=None) -> Tuple[str, float]:
    """
    Classify a security log entry.
    Tries BERT first, then Logistic Regression, then rule-based fallback.
    """
    # 1. Try BERT transformer
    if bert_model is not None and bert_tokenizer is not None:
        from nlp.classification.bert_classifier import BertClassifier
        bert = BertClassifier(model=bert_model, tokenizer=bert_tokenizer)
        if bert.is_ready:
            return bert.predict(text)

    # 2. Try Logistic Regression
    if logistic_clf is not None and logistic_clf.is_trained:
        return logistic_clf.predict(text)

    # 3. Rule-based fallback (always available)
    return _rule_based_classify(text)


def _rule_based_classify(text: str) -> Tuple[str, float]:
    """Keyword-based heuristic classifier (fallback when no model is loaded)."""
    t = text.lower()

    if any(k in t for k in [
        "failed password", "bruteforce", "invalid user", "failed login",
        "authentication failure", "pam 2 more", "brute force",
    ]):
        return ("BruteForce Attack", 0.968)

    if any(k in t for k in [
        "powershell", "encodedcommand", "mimikatz", "lsass", "malware",
        "trojan", "ransomware", "payload", "reverse shell", "c2 beacon",
    ]):
        return ("Malware Activity", 0.982)

    if any(k in t for k in [
        "attachuserpolicy", "administratoraccess", "privilege escalation",
        "sudoers", "setuid", "putbucketpolicy", "assume role",
    ]):
        return ("Privilege Escalation", 0.945)

    if any(k in t for k in [
        "port scan", "nmap", "syn sweep", "tcp spt=", "reconnaissance",
        "proto=tcp spt=", "masscan", "zmap",
    ]):
        return ("Reconnaissance Scan", 0.912)

    return ("Normal Activity", 0.890)
