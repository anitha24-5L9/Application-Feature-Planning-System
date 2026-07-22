from pydantic import BaseModel


class EnvironmentCreate(BaseModel):
    name: str


class EnvironmentUpdate(BaseModel):
    name: str


class EnvironmentResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True