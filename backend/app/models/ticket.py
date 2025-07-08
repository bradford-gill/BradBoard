"""
Database models for tickets.
"""

from typing import Dict, Any, List, Optional
from supabase import Client
from app.schemas.ticket import TicketCreate, TicketUpdate, Ticket, TicketWithProject, TicketFilters


class TicketModel:
    """Database operations for tickets."""
    
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table = "tickets"
    
    async def create(self, ticket: TicketCreate, user_id: str, user_name: str) -> Ticket:
        """Create a new ticket."""
        ticket_data = {
            "title": ticket.title,
            "description": ticket.description,
            "project_id": ticket.project_id,
            "status": ticket.status.value,
            "priority": ticket.priority.value,
            "assigned_to_id": ticket.assigned_to_id,
            "assigned_to_name": ticket.assigned_to_name,
            "created_by_id": user_id,
            "created_by_name": user_name,
        }
        
        response = self.supabase.table(self.table).insert(ticket_data).execute()
        
        if response.data:
            return Ticket(**response.data[0])
        raise Exception("Failed to create ticket")
    
    async def get_by_id(self, ticket_id: str) -> Optional[Ticket]:
        """Get a ticket by ID."""
        response = self.supabase.table(self.table).select("*").eq("id", ticket_id).execute()
        
        if response.data:
            return Ticket(**response.data[0])
        return None
    
    async def get_all_with_filters(self, filters: TicketFilters) -> List[TicketWithProject]:
        """Get all tickets with filters and project information."""
        query = (
            self.supabase.table(self.table)
            .select("*, projects(title)")
        )
        
        # Apply filters
        if filters.project_ids:
            query = query.in_("project_id", filters.project_ids)
        
        if filters.statuses:
            query = query.in_("status", [s.value for s in filters.statuses])
        
        if filters.priorities:
            query = query.in_("priority", [p.value for p in filters.priorities])
        
        if filters.assigned_to_ids:
            query = query.in_("assigned_to_id", filters.assigned_to_ids)

        if filters.created_by_ids:
            query = query.in_("created_by_id", filters.created_by_ids)
        
        if filters.search:
            # Search in title and description
            query = query.or_(f"title.ilike.%{filters.search}%,description.ilike.%{filters.search}%")
        
        # Apply pagination and ordering
        offset = (filters.page - 1) * filters.size
        query = (
            query
            .order("priority", desc=False)
            .order("created_at", desc=True)
            .range(offset, offset + filters.size - 1)
        )
        
        response = query.execute()
        
        tickets = []
        for item in response.data:
            ticket_data = {k: v for k, v in item.items() if k != "projects"}
            ticket_data["project_title"] = item["projects"]["title"] if item["projects"] else "Unknown"
            tickets.append(TicketWithProject(**ticket_data))
        
        return tickets
    
    async def update(self, ticket_id: str, ticket: TicketUpdate) -> Optional[Ticket]:
        """Update a ticket."""
        update_data = {}
        
        for field, value in ticket.dict().items():
            if value is not None:
                if field in ["status", "priority"]:
                    update_data[field] = value.value
                else:
                    update_data[field] = value
        
        if not update_data:
            return await self.get_by_id(ticket_id)
        
        response = (
            self.supabase.table(self.table)
            .update(update_data)
            .eq("id", ticket_id)
            .execute()
        )
        
        if response.data:
            return Ticket(**response.data[0])
        return None
    
    async def delete(self, ticket_id: str) -> bool:
        """Delete a ticket."""
        response = self.supabase.table(self.table).delete().eq("id", ticket_id).execute()
        return len(response.data) > 0
    
    async def count_with_filters(self, filters: TicketFilters) -> int:
        """Get total count of tickets with filters."""
        query = self.supabase.table(self.table).select("id", count="exact")
        
        # Apply same filters as get_all_with_filters
        if filters.project_ids:
            query = query.in_("project_id", filters.project_ids)
        
        if filters.statuses:
            query = query.in_("status", [s.value for s in filters.statuses])
        
        if filters.priorities:
            query = query.in_("priority", [p.value for p in filters.priorities])
        
        if filters.assigned_to:
            query = query.in_("assigned_to", filters.assigned_to)
        
        if filters.created_by:
            query = query.in_("created_by_id", filters.created_by)
        
        if filters.search:
            query = query.or_(f"title.ilike.%{filters.search}%,description.ilike.%{filters.search}%")
        
        response = query.execute()
        return response.count or 0
    
    async def get_all_for_export(self) -> List[TicketWithProject]:
        """Get all tickets for CSV export."""
        response = (
            self.supabase.table(self.table)
            .select("*, projects(title)")
            .order("priority", desc=False)
            .order("created_at", desc=True)
            .execute()
        )
        
        tickets = []
        for item in response.data:
            ticket_data = {k: v for k, v in item.items() if k != "projects"}
            ticket_data["project_title"] = item["projects"]["title"] if item["projects"] else "Unknown"
            tickets.append(TicketWithProject(**ticket_data))
        
        return tickets
