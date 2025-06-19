import uuid

from http.client import HTTPException
from fastapi import APIRouter, UploadFile
from fastapi.params import File
from app.modules.classification.schemas import ClassificationResponse
from app.modules.classification.service import classify_and_store_image

classification_router = APIRouter()

@classification_router.get("/classify", response_model=ClassificationResponse)
async def classify(file: UploadFile = File(...)):

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")
    
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"

    contents = await file.read()

    if not contents:
        raise HTTPException(status_code=400, detail="File is empty.")

    from io import BytesIO

    result = classify_and_store_image(BytesIO(contents), filename)
    return ClassificationResponse(label=result.label, confidence=result.confidence)