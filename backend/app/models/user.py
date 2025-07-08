"""
User model for database operations.
"""

from typing import List, Optional
from supabase import Client
from app.schemas.user import User, UserCreate


class UserModel:
    """User model for database operations."""
    
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table_name = "users"
    
    async def get_all(self) -> List[User]:
        """Get all users."""
        try:
            response = self.supabase.table(self.table_name).select("*").order("name").execute()
            return [User(**user) for user in response.data]
        except Exception as e:
            raise Exception(f"Failed to get users: {str(e)}")
    
    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        try:
            response = self.supabase.table(self.table_name).select("*").eq("id", user_id).execute()
            if response.data:
                return User(**response.data[0])
            return None
        except Exception as e:
            raise Exception(f"Failed to get user: {str(e)}")
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        try:
            response = self.supabase.table(self.table_name).select("*").eq("email", email).execute()
            if response.data:
                return User(**response.data[0])
            return None
        except Exception as e:
            raise Exception(f"Failed to get user: {str(e)}")
    
    async def update(self, user_id: str, name: str) -> User:
        """Update user name."""
        try:
            response = self.supabase.table(self.table_name).update({
                "name": name
            }).eq("id", user_id).execute()
            
            if not response.data:
                raise Exception("User not found")
            
            return User(**response.data[0])
        except Exception as e:
            raise Exception(f"Failed to update user: {str(e)}")
