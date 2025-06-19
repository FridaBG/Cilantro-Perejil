from fastapi import FastAPI
from app.modules.classification.api import classification_router
from app.modules.settings.api import settings_router
from app.middleware.response_formatter import FormattedJSONResponse
from app.core.exceptions import add_global_exception_handlers

app = FastAPI(
    title="Cilantro vs Perejil Classifier",
    default_response_class=FormattedJSONResponse
)


api_version = "v1"
api_prefix = f"/api/{api_version}"
app.description = "A simple API to classify images as cilantro or parsley."
app.docs_url = f"/docs/{api_version}"


add_global_exception_handlers(app)


app.version = "0.1.0"
app.include_router(
    classification_router,
    prefix=api_prefix,
    tags=["classification"]
)
app.include_router(
    settings_router,
    prefix='',
    tags=["settings"]
)
