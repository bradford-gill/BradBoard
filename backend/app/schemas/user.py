"""
User schemas for authentication and user management.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    """Schema for user creation."""
    password: str


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class User(UserBase):
    """User schema for responses."""
    id: str
    
    class Config:
        from_attributes = True


class UserInDB(User):
    """User schema with hashed password."""
    hashed_password: str


class Token(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token data schema."""
    user_id: Optional[str] = None
