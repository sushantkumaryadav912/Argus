"""
NLP Classification — Evaluation
Computes accuracy, precision, recall, F1, and confusion matrix.
"""
from typing import List, Dict


def evaluate_classifier(y_true: List[int], y_pred: List[int], label_names: List[str]) -> Dict:
    """Return a full evaluation report comparing predictions to ground truth."""
    from sklearn.metrics import (
        accuracy_score,
        precision_recall_fscore_support,
        classification_report,
        confusion_matrix,
    )

    accuracy = accuracy_score(y_true, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_true, y_pred, average="weighted"
    )
    report = classification_report(
        y_true, y_pred, target_names=label_names, output_dict=True
    )
    cm = confusion_matrix(y_true, y_pred).tolist()

    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "classification_report": report,
        "confusion_matrix": cm,
    }
