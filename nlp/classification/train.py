"""
NLP Classification — Training Script
Trains and evaluates both Logistic Regression and BERT classifiers.
"""
from typing import List


def train_logistic(texts: List[str], labels: List[int]):
    """Train the TF-IDF + Logistic Regression classifier."""
    from nlp.classification.logistic_classifier import LogisticClassifier
    clf = LogisticClassifier()
    metrics = clf.train(texts, labels)
    return clf, metrics


def train_bert(texts: List[str], labels: List[int], model_name: str = "bert-base-uncased"):
    """Fine-tune a BERT model on the classification dataset (stub)."""
    # Full fine-tuning implementation would go here using HuggingFace Trainer
    # For the academic project, this can be done in a Jupyter notebook
    raise NotImplementedError(
        "BERT fine-tuning should be done via notebooks/train_bert.ipynb. "
        "Load the checkpoint into model_registry after training."
    )
