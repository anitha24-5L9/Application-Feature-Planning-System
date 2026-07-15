from pydantic import BaseModel


class TargetUserCreate(BaseModel):
    flag_key: str
    user_id: str


class TargetUserResponse(BaseModel):
    user_id: str


class MessageResponse(BaseModel):
    message: str

class TargetGroupCreate(BaseModel):
    flag_key: str
    group_name: str


class TargetGroupResponse(BaseModel):
    group_name: str