from fastapi.responses import JSONResponse

class FormattedJSONResponse(JSONResponse):
    def render(self, content: any) -> bytes:
        if isinstance(content, dict):
            if "success" in content or ("code" in content and "message" in content):
                return super().render(content)

        return super().render({"success": True, "data": content})
