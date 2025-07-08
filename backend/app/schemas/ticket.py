"""
Ticket schemas for API requests and responses.
"""

from pydantic import BaseModel
from typing import Optional, List
from app.schemas.base import TimestampMixin, Priority, Status


class TicketBase(BaseModel):
    """Base ticket schema."""
    title: str
    description: str
    project_id: str
    status: Status = Status.OPEN
    priority: Priority = Priority.MEDIUM
    assigned_to_id: Optional[str] = None
    assigned_to_name: Optional[str] = None


class TicketCreate(TicketBase):
    """Schema for creating a ticket."""
    pass


class TicketUpdate(BaseModel):
    """Schema for updating a ticket."""
    title: Optional[str] = None
    description: Optional[str] = None
    project_id: Optional[str] = None
    status: Optional[Status] = None
    priority: Optional[Priority] = None
    assigned_to_id: Optional[str] = None
    assigned_to_name: Optional[str] = None


class Ticket(TicketBase, TimestampMixin):
    """Ticket schema for responses."""
    id: str
    created_by_id: str
    created_by_name: str
    
    class Config:
        from_attributes = True


class TicketWithProject(Ticket):
    """Ticket schema with project information."""
    project_title: str


class TicketList(BaseModel):
    """Schema for ticket list responses."""
    tickets: List[TicketWithProject]
    total: int
    page: int
    size: int


class TicketFilters(BaseModel):
    """Schema for ticket filtering."""
    project_ids: Optional[List[str]] = None
    statuses: Optional[List[Status]] = None
    priorities: Optional[List[Priority]] = None
    assigned_to_ids: Optional[List[str]] = None
    created_by_ids: Optional[List[str]] = None
    search: Optional[str] = None
    page: int = 1
    size: int = 50
