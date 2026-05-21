from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr


class MeetingInstantCreate(BaseModel):
    host_id: int = Field(..., gt=0)
    title: str = Field(default="Instant Meeting", min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    duration: int = Field(default=0, ge=0, description="Duration in minutes")


class MeetingScheduledCreate(BaseModel):
    host_id: int = Field(..., gt=0)
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    start_time: datetime
    duration: int = Field(..., gt=0, description="Duration in minutes")


class MeetingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    meeting_id: str
    title: str
    description: str | None
    start_time: datetime
    duration: int
    is_scheduled: bool
    host_id: int
