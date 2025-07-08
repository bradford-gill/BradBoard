"""
Project schemas for API requests and responses.
"""

from pydantic import BaseModel
from typing import Optional, List
from app.schemas.base import TimestampMixin


class ProjectBase(BaseModel):
    """Base project schema."""
    title: str
    description: str


class ProjectCreate(ProjectBase):
    """Schema for creating a project."""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a project."""
    title: Optional[str] = None
    description: Optional[str] = None


class Project(ProjectBase, TimestampMixin):
    """Project schema for responses."""
    id: str
    created_by_id: str
    created_by_name: str

    class Config:
        from_attributes = True


class ProjectWithTicketCount(Project):
    """Project schema with ticket count."""
    ticket_count: int = 0


class ProjectList(BaseModel):
    """Schema for project list responses."""
    projects: List[Project]
    total: int
    page: int
    size: int
