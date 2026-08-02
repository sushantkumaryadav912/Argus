"""
Argus Security Module
Stub for future API-key / JWT / rate-limiting middleware.
"""
from fastapi import Request, HTTPException, status
from app.core.logging import get_logger

logger = get_logger("security")

# ── Future: API Key validation ──
API_KEY_HEADER = "X-Argus-API-Key"


async def verify_api_key(request: Request) -> None:
    """
    Placeholder dependency for API key verification.
    Currently passes all requests (development mode).
    Wire this into Depends() when ready to enforce auth.
    """
    api_key = request.headers.get(API_KEY_HEADER)
    if api_key:
        logger.debug("API key header present (validation not yet enforced)")
    # In production, validate against DB / env secret:
    # if api_key != settings.SECRET_KEY:
    #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid API key")
