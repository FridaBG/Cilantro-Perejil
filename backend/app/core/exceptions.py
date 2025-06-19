from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import RequestValidationError, HTTPException as FastAPIHTTPException

def add_global_exception_handlers(app: FastAPI):
    @app.exception_handler(FastAPIHTTPException)
    async def http_exception_handler(request: Request, exc: FastAPIHTTPException):
        content = {
            "sucess": False,
            "code": getattr(exc, "status_code", 500),
            "message": exc.detail if exc.detail else "Server error",
            "errors": None,
            "detail": getattr(exc, "detail", None),
        }
        return JSONResponse(status_code=exc.status_code, content=content)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        content = {
            "success": False,
            "code": "VALIDATION_ERROR",
            "message": "Validation failed",
            "errors": exc.errors(),
            "detail": exc.body
        }
        return JSONResponse(status_code=422, content=content)

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        content = {
            "success": False,
            "code": "INTERNAL_ERROR",
            "message": str(exc),
            "errors": None,
            "detail": None
        }
        return JSONResponse(status_code=500, content=content)
