from typing import Optional

from pydantic import BaseModel


class EvaluationRequest(BaseModel):
    flag_key: str
    environment: str

    # Day 7 - Optional user context for targeting
    user_context: Optional[dict] = None


class EvaluationResponse(BaseModel):
    success: bool
    flag: str | None = None
    environment: str | None = None
    enabled: bool | None = None
    message: str | None = None