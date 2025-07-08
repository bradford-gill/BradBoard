"""
Smart creation endpoints using LLM.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.core.database import get_supabase
from app.api.deps import get_current_active_user
from app.schemas.user import User
from app.schemas.create import SmartCreateRequest, SmartCreateResponse
from app.services.llm import LLMService

router = APIRouter()


@router.post("/", response_model=SmartCreateResponse)
async def smart_create(
    request: SmartCreateRequest,
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Create tickets and projects from natural language text using LLM."""
    try:
        llm_service = LLMService(supabase, current_user.id, current_user.name)
        result = await llm_service.process_text(request.text, request.project_id)
        
        return SmartCreateResponse(
            created_projects=result["created_projects"],
            created_tickets=result["created_tickets"],
            message=result["message"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Smart creation failed: {str(e)}"
        )
