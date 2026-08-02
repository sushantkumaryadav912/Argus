"""
Argus Model Registry
Loads ALL NLP models exactly ONCE on startup.
Every API handler uses cached model references — zero reload overhead.

Startup → Load spaCy → Load BERT → Load BART → Load SentenceTransformer
        → Load TF-IDF → Load Logistic Regression → Load Word2Vec → Ready
"""
from __future__ import annotations
import os
from app.core.logging import get_logger, log_inference_time
from app.core.config import settings

logger = get_logger("model_registry")


class ModelRegistry:
    """Singleton registry that holds every loaded NLP model."""

    def __init__(self):
        # Transformer models
        self.bert_model = None
        self.bert_tokenizer = None
        self.bart_summarizer = None
        self.sentence_transformer = None

        # spaCy
        self.spacy_nlp = None

        # Classical ML
        self.tfidf_vectorizer = None
        self.logistic_classifier = None

        # Embeddings
        self.word2vec_model = None

        # Search
        self.faiss_index = None

        self._loaded = False

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    async def load_all(self) -> None:
        """Load every model. Called once from the FastAPI lifespan handler."""
        logger.info("═══ Model Registry: loading all NLP models ═══")

        self._load_spacy()
        self._load_tfidf()
        self._load_logistic_classifier()
        self._load_bert()
        self._load_bart()
        self._load_sentence_transformer()
        self._load_word2vec()
        self._build_faiss_index()

        self._loaded = True
        logger.info("═══ Model Registry: all models loaded successfully ═══")

    # ── Individual loaders ──────────────────────────────────────────

    def _load_spacy(self) -> None:
        try:
            import spacy
            self.spacy_nlp = spacy.load(settings.SPACY_MODEL)
            logger.info("✓ spaCy model '%s' loaded", settings.SPACY_MODEL)
        except Exception as e:
            logger.warning("✗ spaCy load skipped: %s", e)

    def _load_bert(self) -> None:
        try:
            from transformers import AutoTokenizer, AutoModelForSequenceClassification
            self.bert_tokenizer = AutoTokenizer.from_pretrained(settings.BERT_MODEL_NAME)
            self.bert_model = AutoModelForSequenceClassification.from_pretrained(
                settings.BERT_MODEL_NAME, num_labels=5
            )
            self.bert_model.eval()
            logger.info("✓ BERT model '%s' loaded", settings.BERT_MODEL_NAME)
        except Exception as e:
            logger.warning("✗ BERT load skipped (rule classifier will be used): %s", e)

    def _load_bart(self) -> None:
        try:
            from transformers import pipeline as hf_pipeline
            self.bart_summarizer = hf_pipeline(
                "summarization", model=settings.BART_MODEL_NAME, device=-1
            )
            logger.info("✓ BART summarizer '%s' loaded", settings.BART_MODEL_NAME)
        except Exception as e:
            logger.warning("✗ BART load skipped (template summarizer will be used): %s", e)

    def _load_sentence_transformer(self) -> None:
        try:
            from sentence_transformers import SentenceTransformer
            self.sentence_transformer = SentenceTransformer(settings.SENTENCE_TRANSFORMER_MODEL)
            logger.info("✓ SentenceTransformer '%s' loaded", settings.SENTENCE_TRANSFORMER_MODEL)
        except Exception as e:
            logger.warning("✗ SentenceTransformer load skipped (keyword search fallback): %s", e)

    def _load_tfidf(self) -> None:
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            self.tfidf_vectorizer = TfidfVectorizer(max_features=5000)
            logger.info("✓ TF-IDF vectorizer initialized")
        except Exception as e:
            logger.warning("✗ TF-IDF load skipped: %s", e)

    def _load_logistic_classifier(self) -> None:
        try:
            from sklearn.linear_model import LogisticRegression
            self.logistic_classifier = LogisticRegression(max_iter=1000, multi_class="multinomial")
            logger.info("✓ Logistic Regression classifier initialized")
        except Exception as e:
            logger.warning("✗ Logistic Regression load skipped: %s", e)

    def _load_word2vec(self) -> None:
        try:
            # Word2Vec model will be trained or loaded from disk when data is available
            logger.info("✓ Word2Vec slot reserved (train with nlp/embeddings/word2vec.py)")
        except Exception as e:
            logger.warning("✗ Word2Vec load skipped: %s", e)

    def _build_faiss_index(self) -> None:
        try:
            import faiss
            # Index will be built/populated after sentence embeddings are computed
            logger.info("✓ FAISS index slot reserved (build with nlp/semantic/index_builder.py)")
        except Exception as e:
            logger.warning("✗ FAISS load skipped: %s", e)


# ── Global singleton ──
registry = ModelRegistry()
