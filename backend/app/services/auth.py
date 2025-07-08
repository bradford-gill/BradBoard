"""
Authentication service using Supabase.
"""

from fastapi import HTTPException, status
from supabase import Client
from app.schemas.user import UserCreate, UserLogin, Token, User


class AuthService:
    """Authentication service."""
    
    def __init__(self, supabase: Client):
        self.supabase = supabase
    
    async def register(self, user_data: UserCreate) -> Token:
        """Register a new user."""
        try:
            # Create user with Supabase Auth
            response = self.supabase.auth.sign_up({
                "email": user_data.email,
                "password": user_data.password,
                "options": {
                    "data": {
                        "name": user_data.name or user_data.email.split("@")[0]
                    }
                }
            })
            
            if response.user is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Registration failed"
                )
            
            return Token(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                token_type="bearer"
            )
            
        except Exception as e:
            if "already registered" in str(e).lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed"
            )
    
    async def login(self, user_data: UserLogin) -> Token:
        """Login user."""
        try:
            response = self.supabase.auth.sign_in_with_password({
                "email": user_data.email,
                "password": user_data.password
            })
            
            if response.user is None or response.session is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )
            
            return Token(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                token_type="bearer"
            )
            
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
    
    async def logout(self) -> dict:
        """Logout user."""
        try:
            self.supabase.auth.sign_out()
            return {"message": "Successfully logged out"}
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Logout failed"
            )
    
    async def refresh_token(self, refresh_token: str) -> Token:
        """Refresh access token."""
        try:
            response = self.supabase.auth.refresh_session(refresh_token)
            
            if response.session is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token"
                )
            
            return Token(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                token_type="bearer"
            )
            
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token refresh failed"
            )
