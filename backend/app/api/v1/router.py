"""
Main API router for v1 endpoints.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, projects, tickets, create, export, users

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
api_router.include_router(create.router, prefix="/create", tags=["smart-creation"])
api_router.include_router(export.router, prefix="/export", tags=["export"])
