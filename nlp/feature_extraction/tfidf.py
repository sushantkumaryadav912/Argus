"""
NLP Feature Extraction — TF-IDF
Term Frequency–Inverse Document Frequency using scikit-learn.
Used as input to the Logistic Regression classifier.
"""
from typing import List
import numpy as np


class TfidfWrapper:
    """Wraps sklearn TfidfVectorizer for the Argus pipeline."""

    def __init__(self, max_features: int = 5000):
        self.max_features = max_features
        self.vectorizer = None

    def fit(self, corpus: List[str]) -> None:
        from sklearn.feature_extraction.text import TfidfVectorizer
        self.vectorizer = TfidfVectorizer(max_features=self.max_features)
        self.vectorizer.fit(corpus)

    def transform(self, texts: List[str]) -> np.ndarray:
        if self.vectorizer is None:
            raise RuntimeError("TfidfVectorizer has not been fit yet.")
        return self.vectorizer.transform(texts).toarray()

    def fit_transform(self, corpus: List[str]) -> np.ndarray:
        from sklearn.feature_extraction.text import TfidfVectorizer
        self.vectorizer = TfidfVectorizer(max_features=self.max_features)
        return self.vectorizer.fit_transform(corpus).toarray()

    def get_feature_names(self) -> List[str]:
        if self.vectorizer is None:
            return []
        return list(self.vectorizer.get_feature_names_out())
