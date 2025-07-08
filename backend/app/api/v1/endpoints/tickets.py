"""
Ticket endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from supabase import Client

from app.core.database import get_supabase
from app.api.deps import get_current_active_user
from app.schemas.user import User
from app.schemas.ticket import (
    Ticket, TicketCreate, TicketUpdate, TicketList, 
    TicketFilters, TicketWithProject
)
from app.schemas.base import Status, Priority
from app.services.database import get_database_service

router = APIRouter()


@router.post("/", response_model=Ticket)
async def create_ticket(
    ticket: TicketCreate,
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Create a new ticket."""
    db_service = get_database_service(supabase)
    
    # Verify project exists
    project = await db_service.projects.get_by_id(ticket.project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return await db_service.tickets.create(ticket, current_user.id, current_user.name)


@router.get("/", response_model=TicketList)
async def get_tickets(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    project_ids: Optional[str] = Query(None, description="Comma-separated project IDs"),
    statuses: Optional[str] = Query(None, description="Comma-separated statuses"),
    priorities: Optional[str] = Query(None, description="Comma-separated priorities"),
    assigned_to_ids: Optional[str] = Query(None, description="Comma-separated user IDs"),
    created_by_ids: Optional[str] = Query(None, description="Comma-separated user IDs"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Get all tickets with filtering and pagination."""
    db_service = get_database_service(supabase)
    
    # Parse filters
    filters = TicketFilters(
        page=page,
        size=size,
        search=search
    )
    
    if project_ids:
        filters.project_ids = [pid.strip() for pid in project_ids.split(",")]
    
    if statuses:
        try:
            filters.statuses = [Status(s.strip()) for s in statuses.split(",")]
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status value"
            )
    
    if priorities:
        try:
            filters.priorities = [Priority(int(p.strip())) for p in priorities.split(",")]
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid priority value"
            )
    
    if assigned_to_ids:
        filters.assigned_to_ids = [uid.strip() for uid in assigned_to_ids.split(",")]

    if created_by_ids:
        filters.created_by_ids = [uid.strip() for uid in created_by_ids.split(",")]
    
    tickets = await db_service.tickets.get_all_with_filters(filters)
    total = await db_service.tickets.count_with_filters(filters)
    
    return TicketList(
        tickets=tickets,
        total=total,
        page=page,
        size=size
    )


@router.get("/{ticket_id}", response_model=Ticket)
async def get_ticket(
    ticket_id: str,
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Get a specific ticket."""
    db_service = get_database_service(supabase)
    ticket = await db_service.tickets.get_by_id(ticket_id)
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    return ticket


@router.put("/{ticket_id}", response_model=Ticket)
async def update_ticket(
    ticket_id: str,
    ticket_update: TicketUpdate,
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Update a ticket."""
    db_service = get_database_service(supabase)
    
    # Check if ticket exists
    existing_ticket = await db_service.tickets.get_by_id(ticket_id)
    if not existing_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # If project_id is being updated, verify the new project exists
    if ticket_update.project_id:
        project = await db_service.projects.get_by_id(ticket_update.project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
    
    updated_ticket = await db_service.tickets.update(ticket_id, ticket_update)
    if not updated_ticket:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update ticket"
        )
    
    return updated_ticket


@router.delete("/{ticket_id}")
async def delete_ticket(
    ticket_id: str,
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Delete a ticket."""
    db_service = get_database_service(supabase)
    
    # Check if ticket exists
    existing_ticket = await db_service.tickets.get_by_id(ticket_id)
    if not existing_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    success = await db_service.tickets.delete(ticket_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete ticket"
        )
    
    return {"message": "Ticket deleted successfully"}
