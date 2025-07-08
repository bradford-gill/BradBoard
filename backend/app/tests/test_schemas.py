"""
Tests for Pydantic schemas.
"""

import pytest
from datetime import datetime
from app.schemas.base import Priority, Status
from app.schemas.project import ProjectCreate, Project
from app.schemas.ticket import TicketCreate, Ticket
from app.schemas.user import UserCreate, User


def test_priority_enum():
    """Test Priority enum values."""
    assert Priority.LOW == 1
    assert Priority.MEDIUM == 2
    assert Priority.HIGH == 3


def test_status_enum():
    """Test Status enum values."""
    assert Status.OPEN == "open"
    assert Status.IN_PROGRESS == "in progress"
    assert Status.DONE == "done"


def test_project_create_schema():
    """Test ProjectCreate schema validation."""
    project_data = {
        "title": "Test Project",
        "description": "A test project description"
    }
    project = ProjectCreate(**project_data)
    assert project.title == "Test Project"
    assert project.description == "A test project description"


def test_project_schema():
    """Test Project schema validation."""
    project_data = {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Test Project",
        "description": "A test project description",
        "created_by": "user-123",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    project = Project(**project_data)
    assert project.id == "123e4567-e89b-12d3-a456-426614174000"
    assert project.title == "Test Project"


def test_ticket_create_schema():
    """Test TicketCreate schema validation."""
    ticket_data = {
        "title": "Test Ticket",
        "description": "A test ticket description",
        "project_id": "123e4567-e89b-12d3-a456-426614174000",
        "status": Status.OPEN,
        "priority": Priority.HIGH
    }
    ticket = TicketCreate(**ticket_data)
    assert ticket.title == "Test Ticket"
    assert ticket.status == Status.OPEN
    assert ticket.priority == Priority.HIGH


def test_ticket_schema():
    """Test Ticket schema validation."""
    ticket_data = {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "title": "Test Ticket",
        "description": "A test ticket description",
        "project_id": "123e4567-e89b-12d3-a456-426614174000",
        "status": Status.OPEN,
        "priority": Priority.HIGH,
        "created_by_id": "user-123",
        "created_by_name": "Test User",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    ticket = Ticket(**ticket_data)
    assert ticket.id == "123e4567-e89b-12d3-a456-426614174001"
    assert ticket.title == "Test Ticket"
    assert ticket.status == Status.OPEN


def test_user_create_schema():
    """Test UserCreate schema validation."""
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "name": "Test User"
    }
    user = UserCreate(**user_data)
    assert user.email == "test@example.com"
    assert user.password == "testpassword123"
    assert user.name == "Test User"


def test_user_schema():
    """Test User schema validation."""
    user_data = {
        "id": "user-123",
        "email": "test@example.com",
        "name": "Test User"
    }
    user = User(**user_data)
    assert user.id == "user-123"
    assert user.email == "test@example.com"
    assert user.name == "Test User"
