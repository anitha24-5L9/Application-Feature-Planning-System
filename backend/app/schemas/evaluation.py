from pydantic import BaseModel


class EvaluationRequest(BaseModel):
    flag_key: str
    environment: str


class EvaluationResponse(BaseModel):
    success: bool
    flag: str | None = None
    environment: str | None = None
    enabled: bool | None = None
    message: str | None = None