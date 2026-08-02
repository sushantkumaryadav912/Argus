"""
NLP Classification — Logistic Regression Classifier
TF-IDF + Logistic Regression baseline for comparison against BERT.
"""
from typing import Tuple, List
from nlp.classification.dataset import LABEL_NAMES, id_to_label


class LogisticClassifier:
    """Classical ML baseline: TF-IDF → Logistic Regression."""

    def __init__(self):
        self.vectorizer = None
        self.model = None
        self.is_trained = False

    def train(self, texts: List[str], labels: List[int]) -> dict:
        """Train on a labelled corpus. Returns accuracy metrics."""
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.linear_model import LogisticRegression
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import accuracy_score, classification_report

        self.vectorizer = TfidfVectorizer(max_features=5000)
        X = self.vectorizer.fit_transform(texts)

        X_train, X_test, y_train, y_test = train_test_split(
            X, labels, test_size=0.2, random_state=42, stratify=labels
        )

        self.model = LogisticRegression(max_iter=1000, multi_class="multinomial")
        self.model.fit(X_train, y_train)

        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred, target_names=LABEL_NAMES, output_dict=True)

        self.is_trained = True
        return {"accuracy": accuracy, "report": report}

    def predict(self, text: str) -> Tuple[str, float]:
        """Predict category and confidence for a single log entry."""
        if not self.is_trained or self.vectorizer is None or self.model is None:
            return ("Normal Activity", 0.0)

        X = self.vectorizer.transform([text])
        proba = self.model.predict_proba(X)[0]
        label_id = proba.argmax()
        confidence = float(proba[label_id])
        return (id_to_label(label_id), confidence)
