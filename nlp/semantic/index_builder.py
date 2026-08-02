"""
NLP Semantic Search — FAISS Index Builder
Builds and maintains a FAISS vector index from sentence embeddings.
"""
from typing import List, Optional
import numpy as np


class FaissIndexBuilder:
    """Builds and queries a FAISS flat inner-product index."""

    def __init__(self):
        self.index = None
        self.dimension = None

    def build(self, embeddings: np.ndarray) -> None:
        """Build a FAISS IndexFlatIP from a matrix of embeddings."""
        import faiss

        self.dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(self.dimension)

        # Normalize for cosine similarity via inner product
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings)

    def search(self, query_embedding: np.ndarray, top_k: int = 10):
        """Search the index. Returns (distances, indices)."""
        import faiss

        if self.index is None:
            return np.array([]), np.array([])

        query = query_embedding.reshape(1, -1).astype("float32")
        faiss.normalize_L2(query)
        distances, indices = self.index.search(query, top_k)
        return distances[0], indices[0]
