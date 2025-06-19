from fastapi import APIRouter


settings_router = APIRouter()

@settings_router.get("/health")
async def health():
    """
    Health check endpoint.
    """
    return {"status": "ok", "message": "Not dead yet!"}