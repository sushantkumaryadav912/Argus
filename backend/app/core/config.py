"""
Argus Core Configuration
"""
try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseModel as BaseSettings
    SettingsConfigDict = None


class Settings(BaseSettings):
    PROJECT_NAME: str = "Argus Cybersecurity Log Analysis Platform"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"

    # ── PostgreSQL (Locally Hosted) ──
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "argus_db"
    POSTGRES_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/argus_db"

    # ── MongoDB (Locally Hosted) ──
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "argus_db"
    MONGODB_NOTIFICATIONS_COLLECTION: str = "notifications"
    MONGODB_ALERTS_COLLECTION: str = "alerts"
    MONGODB_HISTORY_COLLECTION: str = "history"

    # ── CORS & Security ──
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    SECRET_KEY: str = "argus_secret_key_super_secure_9941a87b2"

    # ── NLP & Machine Learning ──
    MODEL_DEVICE: str = "cpu"
    BERT_MODEL_NAME: str = "bert-base-uncased"
    BART_MODEL_NAME: str = "facebook/bart-large-cnn"
    SENTENCE_TRANSFORMER_MODEL: str = "all-MiniLM-L6-v2"
    SPACY_MODEL: str = "en_core_web_sm"
    CONFIDENCE_THRESHOLD: float = 0.75

    if SettingsConfigDict is not None:
        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore",
        )


settings = Settings()
