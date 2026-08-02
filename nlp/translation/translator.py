"""
NLP Translation — MarianMT Translator (Optional)
Seq2Seq demonstration using Helsinki-NLP MarianMT models.
Translates English security log entries to other languages.
"""
from typing import Optional


def translate(text: str, target_lang: str = "fr", model=None, tokenizer=None) -> str:
    """
    Translate English text to target language using MarianMT.
    Optional module — satisfies Seq2Seq curriculum requirement.
    """
    if model is not None and tokenizer is not None:
        try:
            import torch
            inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
            with torch.no_grad():
                translated = model.generate(**inputs)
            return tokenizer.decode(translated[0], skip_special_tokens=True)
        except Exception:
            pass

    return f"[Translation to '{target_lang}' unavailable — MarianMT model not loaded]"


def load_translation_model(target_lang: str = "fr"):
    """Load a MarianMT model for the given target language."""
    try:
        from transformers import MarianMTModel, MarianTokenizer
        model_name = f"Helsinki-NLP/opus-mt-en-{target_lang}"
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        return model, tokenizer
    except Exception as e:
        return None, None
