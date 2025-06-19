from app.modules.classification.domain import ImageClassificationResult
from app.modules.classification.repository import store_image


def run_model_on_image(image_bytes: bytes) -> ImageClassificationResult:
  label = "cilantro"  # Dummy label for MVP demo
  confidence = 0.95  # Dummy confidence for MVP demo

  return ImageClassificationResult(label=label, confidence=confidence)

def classify_and_store_image(file_obj, filename: str) -> ImageClassificationResult:
  # 1. Save image to S3 (mocked for MVP)
  s3_url = store_image(file_obj, filename)

  # 2. Run classification (file_obj will be exhausted, so read from bytes)
  file_obj.seek(0)
  image_bytes = file_obj.read()
  result = run_model_on_image(image_bytes)

  # (optional) log s3_url, result for audit

  return result