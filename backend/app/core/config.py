import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "test")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "test")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    S3_BUCKET: str = os.getenv("S3_BUCKET", "cilantro-perejil-images")
    MOCK_S3: bool = os.getenv("MOCK_S3", "1") == "1"  # For local/dev

settings = Settings()
