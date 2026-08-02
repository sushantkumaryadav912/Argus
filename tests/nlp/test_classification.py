"""Unit Tests for NLP Classification"""
from nlp.classification.predict import classify_log, _rule_based_classify
from nlp.classification.dataset import label_to_id, id_to_label


def test_label_mapping():
    assert label_to_id("BruteForce Attack") == 1
    assert id_to_label(1) == "BruteForce Attack"


def test_rule_based_classifier():
    category, score = _rule_based_classify("Failed password for root from 198.51.100.42 port 49152 ssh2")
    assert category == "BruteForce Attack"
    assert score > 0.9

    category, score = _rule_based_classify("powershell.exe -encodedcommand JABzAD0ATgBlAHc...")
    assert category == "Malware Activity"

    category, score = _rule_based_classify("AttachUserPolicy AdministratorAccess analyst_dev")
    assert category == "Privilege Escalation"

    category, score = _rule_based_classify("IN=eth0 MAC=00:16 SRC=45.33.32.156 PROTO=TCP SPT=54312 DPT=22 SYN")
    assert category == "Reconnaissance Scan"


def test_classify_log_fallback():
    cat, conf = classify_log("Failed password for root from 198.51.100.42")
    assert cat == "BruteForce Attack"
    assert conf > 0.0
