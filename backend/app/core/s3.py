from app.core.config import settings

if settings.MOCK_S3:
    class MockS3Client:
        def upload_fileobj(self, file_obj, bucket, key):
            print(f"Mock upload: {key}")
    s3_client = MockS3Client()
else:
    import boto3
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION
    )

def upload_image_to_s3(file_obj, filename):
    s3_client.upload_fileobj(file_obj, settings.S3_BUCKET, filename)
    return f"s3://{settings.S3_BUCKET}/{filename}"

