"""
Database service utilities.
"""

from supabase import Client
from app.models.project import ProjectModel
from app.models.ticket import TicketModel
from app.models.user import UserModel


class DatabaseService:
    """Service for database operations."""
    
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.projects = ProjectModel(supabase)
        self.tickets = TicketModel(supabase)
        self.users = UserModel(supabase)
    
    async def health_check(self) -> bool:
        """Check database connectivity."""
        try:
            # Simple query to test connection
            response = self.supabase.table("projects").select("id").limit(1).execute()
            return True
        except Exception:
            return False


def get_database_service(supabase: Client) -> DatabaseService:
    """Get database service instance."""
    return DatabaseService(supabase)
