"""
BradBoard FastAPI Application
Main entry point for the project management API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print("Starting BradBoard API...")
    yield
    # Shutdown
    print("Shutting down BradBoard API...")


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="BradBoard - Project management as simple as can be",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        lifespan=lifespan,
    )

    # Set up CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    return app


app = create_application()


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "BradBoard API", "version": settings.VERSION}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "bradboard-api"}


@app.get("/test-cors")
async def test_cors():
    """Test CORS endpoint."""
    return {"message": "CORS is working!", "timestamp": "2025-07-08"}
