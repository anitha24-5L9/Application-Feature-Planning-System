from pydantic import BaseModel, ConfigDict
from typing import Optional


class FlagBase(BaseModel):
    key: str
    type: str
    default_value: str
    enabled: bool
    description: Optional[str] = None
    owner_team: str
    enabled: bool
    rollout_percentage: int = 0


class FlagCreate(FlagBase):
    pass


class FlagUpdate(BaseModel):
    type: Optional[str] = None
    default_value: Optional[str] = None
    enabled: Optional[bool] = None
    description: Optional[str] = None
    owner_team: Optional[str] = None
    enabled: Optional[bool] = None
    rollout_percentage: Optional[int] = None



class FlagResponse(FlagBase):
    id: int

    model_config = ConfigDict(
    from_attributes=True
)
    
class RolloutUpdate(BaseModel):
    rollout_percentage: int


class RolloutResponse(BaseModel):
    flag_key: str
    rollout_percentage: int
