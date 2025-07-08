"""
Export endpoints for data export functionality.
"""

import io
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from supabase import Client

from app.core.database import get_supabase
from app.api.deps import get_current_active_user
from app.schemas.user import User
from app.services.database import get_database_service

router = APIRouter()


@router.get("/tickets/csv")
async def export_tickets_csv(
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Export all tickets as CSV."""
    try:
        db_service = get_database_service(supabase)
        tickets = await db_service.tickets.get_all_for_export()
        
        # Convert tickets to DataFrame
        ticket_data = []
        for ticket in tickets:
            ticket_data.append({
                "ID": ticket.id,
                "Title": ticket.title,
                "Description": ticket.description,
                "Project": ticket.project_title,
                "Project ID": ticket.project_id,
                "Status": ticket.status.value,
                "Priority": ticket.priority.value,
                "Priority Name": ticket.priority.name,
                "Assigned To": ticket.assigned_to or "",
                "Created By ID": ticket.created_by_id,
                "Created By Name": ticket.created_by_name,
                "Created At": ticket.created_at.isoformat(),
                "Updated At": ticket.updated_at.isoformat(),
            })
        
        df = pd.DataFrame(ticket_data)
        
        # Create CSV in memory
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        
        # Create streaming response
        response = StreamingResponse(
            io.BytesIO(output.getvalue().encode()),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=bradboard_tickets.csv"}
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Export failed: {str(e)}"
        )
