"""
Users endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from supabase import Client

from app.core.database import get_supabase
from app.services.database import get_database_service
from app.schemas.user import User
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[User])
async def get_all_users(
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get all users from the public users table."""
    try:
        db_service = get_database_service(supabase)
        users = await db_service.users.get_all()
        return users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve users: {str(e)}"
        )


@router.get("/{user_id}", response_model=User)
async def get_user_by_id(
    user_id: str,
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get a specific user by ID."""
    try:
        db_service = get_database_service(supabase)
        user = await db_service.users.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user: {str(e)}"
        )


@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    name: str,
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Update user name. Users can only update their own record."""
    # Check if user is updating their own record
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own user record"
        )

    try:
        db_service = get_database_service(supabase)
        user = await db_service.users.update(user_id, name)
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}"
        )
