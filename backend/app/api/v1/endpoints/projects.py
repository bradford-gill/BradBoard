"""
Project endpoints.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from supabase import Client

from app.core.database import get_supabase
from app.api.deps import get_current_active_user
from app.schemas.user import User
from app.schemas.project import Project, ProjectCreate, ProjectUpdate, ProjectList
from app.services.database import get_database_service

router = APIRouter()


@router.post("/", response_model=Project)
async def create_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Create a new project."""
    db_service = get_database_service(supabase)
    return await db_service.projects.create(project, current_user.id, current_user.name)


@router.get("/", response_model=ProjectList)
async def get_projects(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Get all projects with pagination."""
    db_service = get_database_service(supabase)
    
    projects = await db_service.projects.get_all(page, size)
    total = await db_service.projects.count()
    
    return ProjectList(
        projects=projects,
        total=total,
        page=page,
        size=size
    )


@router.get("/{project_id}", response_model=Project)
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Get a specific project."""
    db_service = get_database_service(supabase)
    project = await db_service.projects.get_by_id(project_id)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project


@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Update a project."""
    db_service = get_database_service(supabase)
    
    # Check if project exists
    existing_project = await db_service.projects.get_by_id(project_id)
    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    updated_project = await db_service.projects.update(project_id, project_update)
    if not updated_project:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update project"
        )
    
    return updated_project


@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase)
):
    """Delete a project."""
    db_service = get_database_service(supabase)
    
    # Check if project exists
    existing_project = await db_service.projects.get_by_id(project_id)
    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    success = await db_service.projects.delete(project_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete project"
        )
    
    return {"message": "Project deleted successfully"}
