"""
API dependencies for authentication and database access.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client

from app.core.database import get_supabase
from app.schemas.user import User


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase: Client = Depends(get_supabase)
) -> User:
    """Get the current authenticated user."""
    token = credentials.credentials

    # Use Supabase to verify the token instead of our own JWT verification
    try:
        response = supabase.auth.get_user(token)

        if response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        return User(
            id=response.user.id,
            email=response.user.email,
            name=response.user.user_metadata.get("name", response.user.email),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Get the current active user."""
    return current_user
