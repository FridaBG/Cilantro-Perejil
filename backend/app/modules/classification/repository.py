from typing import BinaryIO

from app.core.s3 import upload_image_to_s3


def store_image(file_obj: BinaryIO, filename: str) -> str:
    # Upload to S3, return URL
    return upload_image_to_s3(file_obj, filename)
