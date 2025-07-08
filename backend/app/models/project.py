"""
Database models for projects.
"""

from typing import Dict, Any, List, Optional
from supabase import Client
from app.schemas.project import ProjectCreate, ProjectUpdate, Project


class ProjectModel:
    """Database operations for projects."""
    
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table = "projects"
    
    async def create(self, project: ProjectCreate, user_id: str, user_name: str) -> Project:
        """Create a new project."""
        project_data = {
            "title": project.title,
            "description": project.description,
            "created_by_id": user_id,
            "created_by_name": user_name,
        }
        
        response = self.supabase.table(self.table).insert(project_data).execute()
        
        if response.data:
            return Project(**response.data[0])
        raise Exception("Failed to create project")
    
    async def get_by_id(self, project_id: str) -> Optional[Project]:
        """Get a project by ID."""
        response = self.supabase.table(self.table).select("*").eq("id", project_id).execute()
        
        if response.data:
            return Project(**response.data[0])
        return None
    
    async def get_all(self, page: int = 1, size: int = 50) -> List[Project]:
        """Get all projects with pagination."""
        offset = (page - 1) * size
        
        response = (
            self.supabase.table(self.table)
            .select("*")
            .order("created_at", desc=True)
            .range(offset, offset + size - 1)
            .execute()
        )
        
        return [Project(**item) for item in response.data]
    
    async def update(self, project_id: str, project: ProjectUpdate) -> Optional[Project]:
        """Update a project."""
        update_data = {k: v for k, v in project.dict().items() if v is not None}
        
        if not update_data:
            return await self.get_by_id(project_id)
        
        response = (
            self.supabase.table(self.table)
            .update(update_data)
            .eq("id", project_id)
            .execute()
        )
        
        if response.data:
            return Project(**response.data[0])
        return None
    
    async def delete(self, project_id: str) -> bool:
        """Delete a project."""
        response = self.supabase.table(self.table).delete().eq("id", project_id).execute()
        return len(response.data) > 0
    
    async def count(self) -> int:
        """Get total count of projects."""
        response = self.supabase.table(self.table).select("id", count="exact").execute()
        return response.count or 0
