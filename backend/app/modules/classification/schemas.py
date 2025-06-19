from typing import Literal
from pydantic import BaseModel


class ClassificationResponse(BaseModel):
  label: Literal["cilantro", "perejil"]
  confidence: float
