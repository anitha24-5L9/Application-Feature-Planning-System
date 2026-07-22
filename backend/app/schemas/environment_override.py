from pydantic import BaseModel


class EnvironmentOverrideCreate(BaseModel):
    flag_key: str
    environment_name: str
    override_value: bool


class EnvironmentOverrideResponse(BaseModel):
    id: int
    flag_key: str
    environment_name: str
    override_value: bool

    class Config:
        from_attributes = True