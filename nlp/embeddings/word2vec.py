"""
NLP Embeddings — Word2Vec
Dense word embeddings via Gensim Word2Vec.
"""
from typing import List, Optional
import numpy as np


class Word2VecWrapper:
    """Wraps Gensim Word2Vec for training and inference."""

    def __init__(self, vector_size: int = 100, window: int = 5, min_count: int = 1):
        self.vector_size = vector_size
        self.window = window
        self.min_count = min_count
        self.model = None

    def train(self, tokenized_corpus: List[List[str]], epochs: int = 10) -> None:
        """Train a Word2Vec model on the tokenized corpus."""
        from gensim.models import Word2Vec
        self.model = Word2Vec(
            sentences=tokenized_corpus,
            vector_size=self.vector_size,
            window=self.window,
            min_count=self.min_count,
            workers=4,
            epochs=epochs,
        )

    def get_vector(self, word: str) -> Optional[np.ndarray]:
        """Get the embedding vector for a single word."""
        if self.model and word in self.model.wv:
            return self.model.wv[word]
        return None

    def get_document_vector(self, tokens: List[str]) -> np.ndarray:
        """Average word vectors to produce a document-level embedding."""
        if self.model is None:
            return np.zeros(self.vector_size)
        vectors = [self.model.wv[t] for t in tokens if t in self.model.wv]
        if not vectors:
            return np.zeros(self.vector_size)
        return np.mean(vectors, axis=0)

    def save(self, path: str) -> None:
        if self.model:
            self.model.save(path)

    def load(self, path: str) -> None:
        from gensim.models import Word2Vec
        self.model = Word2Vec.load(path)
