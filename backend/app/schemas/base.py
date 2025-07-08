"""
Base schemas and enums for BradBoard.
"""

from datetime import datetime
from enum import Enum
from pydantic import BaseModel


class Priority(int, Enum):
    """Ticket priority levels."""
    LOW = 1
    MEDIUM = 2
    HIGH = 3


class Status(str, Enum):
    """Ticket status options."""
    OPEN = "open"
    IN_PROGRESS = "in progress"
    DONE = "done"


class TimestampMixin(BaseModel):
    """Mixin for timestamp fields."""
    created_at: datetime
    updated_at: datetime
