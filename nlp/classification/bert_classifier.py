"""
NLP Classification — BERT Classifier
HuggingFace Transformers BERT-based security log classifier.
"""
from typing import Tuple
from nlp.classification.dataset import LABEL_NAMES, id_to_label


class BertClassifier:
    """Transformer-based classifier using a fine-tuned BERT model."""

    def __init__(self, model=None, tokenizer=None):
        self.model = model
        self.tokenizer = tokenizer

    @property
    def is_ready(self) -> bool:
        return self.model is not None and self.tokenizer is not None

    def predict(self, text: str) -> Tuple[str, float]:
        """Classify a log entry using the BERT model."""
        if not self.is_ready:
            return ("Normal Activity", 0.0)

        import torch

        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True,
        )

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            proba = torch.softmax(logits, dim=-1)[0]

        label_id = proba.argmax().item()
        confidence = float(proba[label_id])
        return (id_to_label(label_id), confidence)
