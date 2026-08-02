"""NLP Preprocessing Package"""
from nlp.preprocessing.cleaner import clean_log_text, normalize_case, remove_timestamps
from nlp.preprocessing.tokenizer import tokenize
from nlp.preprocessing.stopwords import remove_stopwords
from nlp.preprocessing.lemmatizer import lemmatize


def preprocess_pipeline(text: str) -> list[str]:
    """
    Full preprocessing pipeline:
    Raw text → Clean → Tokenize → Stopwords → Lemmatize → tokens
    """
    text = clean_log_text(text)
    text = remove_timestamps(text)
    tokens = tokenize(text)
    tokens = remove_stopwords(tokens)
    tokens = lemmatize(tokens)
    return tokens
