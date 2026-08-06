from pydantic import BaseModel


class CleanupCandidate(BaseModel):
    key: str
    owner_team: str
    enabled: bool
    rollout_percentage: int
    days_stale: int
    reviewed: bool

    class Config:
        from_attributes = True