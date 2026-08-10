from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class ChangePasswordRequest(BaseModel):

    current_password: str = Field(
        min_length=1
    )

    new_password: str = Field(
        min_length=8,
        max_length=128
    )


class SystemStatusResponse(BaseModel):

    backend: str
    database: str
    database_type: str
    database_name: str