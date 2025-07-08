"""
Schemas for smart ticket/project creation using LLM.
"""

from pydantic import BaseModel
from typing import Optional, List
from app.schemas.project import Project
from app.schemas.ticket import Ticket


class SmartCreateRequest(BaseModel):
    """Schema for smart creation request."""
    text: str
    project_id: Optional[str] = None


class SmartCreateResponse(BaseModel):
    """Schema for smart creation response."""
    created_projects: List[Project] = []
    created_tickets: List[Ticket] = []
    message: str
