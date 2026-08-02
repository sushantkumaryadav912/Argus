"""
Argus Structured Logging
Configures Python logging for the entire application.
Every request, every model inference, every DB error — logged.
"""
import logging
import sys
import time
from contextlib import contextmanager


def setup_logging(level: int = logging.INFO) -> None:
    """Configure structured logging for the Argus platform."""
    fmt = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    datefmt = "%Y-%m-%d %H:%M:%S"

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(fmt, datefmt=datefmt))

    root = logging.getLogger()
    root.setLevel(level)
    # Avoid duplicate handlers on re-import
    if not root.handlers:
        root.addHandler(handler)

    # Quiet noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Return a namespaced logger for the given module."""
    return logging.getLogger(f"argus.{name}")


@contextmanager
def log_inference_time(logger: logging.Logger, model_name: str):
    """Context manager that logs the wall-clock inference time of a model."""
    start = time.perf_counter()
    yield
    elapsed_ms = (time.perf_counter() - start) * 1000
    logger.info("%s inference completed in %.2f ms", model_name, elapsed_ms)
