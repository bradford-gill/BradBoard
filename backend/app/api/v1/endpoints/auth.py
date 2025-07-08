"""
Authentication endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.core.database import get_supabase
from app.schemas.user import UserCreate, UserLogin, Token, User
from app.services.auth import AuthService
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=Token)
async def register(
    user_data: UserCreate,
    supabase: Client = Depends(get_supabase)
):
    """Register a new user."""
    auth_service = AuthService(supabase)
    return await auth_service.register(user_data)


@router.post("/login", response_model=Token)
async def login(
    user_data: UserLogin,
    supabase: Client = Depends(get_supabase)
):
    """Login user."""
    auth_service = AuthService(supabase)
    return await auth_service.login(user_data)


@router.post("/logout")
async def logout(
    supabase: Client = Depends(get_supabase)
):
    """Logout user."""
    auth_service = AuthService(supabase)
    return await auth_service.logout()


@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str,
    supabase: Client = Depends(get_supabase)
):
    """Refresh access token."""
    auth_service = AuthService(supabase)
    return await auth_service.refresh_token(refresh_token)


@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information."""
    return current_user
