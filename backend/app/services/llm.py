"""
LLM service for smart ticket and project creation.
"""

import json
from typing import List, Dict, Any
from openai import OpenAI
from supabase import Client

from app.core.config import settings
from app.schemas.project import ProjectCreate, Project
from app.schemas.ticket import TicketCreate, Ticket
from app.schemas.base import Status, Priority
from app.services.database import get_database_service


class LLMService:
    """Service for LLM-powered ticket and project creation."""
    
    def __init__(self, supabase: Client, user_id: str, user_name: str):
        self.supabase = supabase
        self.user_id = user_id
        self.user_name = user_name
        self.db_service = get_database_service(supabase)
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    def get_tools(self) -> List[Dict[str, Any]]:
        """Get available tools for the LLM."""
        return [
            {
                "type": "function",
                "function": {
                    "name": "create_project",
                    "description": "Create a new project",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string",
                                "description": "The project title"
                            },
                            "description": {
                                "type": "string",
                                "description": "The project description"
                            }
                        },
                        "required": ["title", "description"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "create_ticket",
                    "description": "Create a new ticket",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string",
                                "description": "The ticket title"
                            },
                            "description": {
                                "type": "string",
                                "description": "The ticket description"
                            },
                            "project_id": {
                                "type": "string",
                                "description": "The project ID this ticket belongs to"
                            },
                            "priority": {
                                "type": "integer",
                                "description": "Priority level: 1 (LOW), 2 (MEDIUM), 3 (HIGH)",
                                "enum": [1, 2, 3]
                            },
                            "status": {
                                "type": "string",
                                "description": "Ticket status",
                                "enum": ["open", "in progress", "done"]
                            },
                            "assigned_to_id": {
                                "type": "string",
                                "description": "User ID to assign the ticket to (optional)"
                            },
                            "assigned_to_name": {
                                "type": "string",
                                "description": "User name to assign the ticket to (optional)"
                            }
                        },
                        "required": ["title", "description", "project_id"]
                    }
                }
            }
        ]
    
    async def create_project_tool(self, title: str, description: str) -> Project:
        """Tool function to create a project."""
        project_data = ProjectCreate(title=title, description=description)
        return await self.db_service.projects.create(project_data, self.user_id, self.user_name)
    
    async def create_ticket_tool(
        self,
        title: str,
        description: str,
        project_id: str,
        priority: int = 2,
        status: str = "open",
        assigned_to_id: str = None,
        assigned_to_name: str = None
    ) -> Ticket:
        """Tool function to create a ticket."""
        ticket_data = TicketCreate(
            title=title,
            description=description,
            project_id=project_id,
            priority=Priority(priority),
            status=Status(status),
            assigned_to_id=assigned_to_id,
            assigned_to_name=assigned_to_name
        )
        return await self.db_service.tickets.create(ticket_data, self.user_id, self.user_name)
    
    async def process_text(self, text: str, project_id: str = None) -> Dict[str, Any]:
        """Process text input and create tickets/projects using LLM."""
        created_projects = []
        created_tickets = []
        
        # Get existing projects for context
        existing_projects = await self.db_service.projects.get_all(1, 100)
        project_context = "\n".join([f"- {p.title} (ID: {p.id}): {p.description}" for p in existing_projects])
        
        system_prompt = f"""You are a project management assistant. Your job is to analyze user input and create appropriate projects and tickets.

Available projects:
{project_context}

Rules:
1. If a project_id is provided, use it for tickets unless the user explicitly mentions a different project
2. If no suitable project exists, create a new one first
3. Break down complex requests into multiple tickets
4. Set appropriate priorities: 1 (LOW), 2 (MEDIUM), 3 (HIGH)
5. Use descriptive titles and detailed descriptions
6. Default status is "open" unless specified otherwise

Current user ID: {self.user_id}
Provided project_id: {project_id or "None"}

Analyze the following text and create the necessary projects and tickets:"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ]
        
        try:
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=messages,
                tools=self.get_tools(),
                tool_choice="auto"
            )
            
            message = response.choices[0].message
            
            if message.tool_calls:
                for tool_call in message.tool_calls:
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments)
                    
                    if function_name == "create_project":
                        project = await self.create_project_tool(**function_args)
                        created_projects.append(project)
                    
                    elif function_name == "create_ticket":
                        # If no project_id in args and we have a provided project_id, use it
                        if "project_id" not in function_args and project_id:
                            function_args["project_id"] = project_id
                        
                        ticket = await self.create_ticket_tool(**function_args)
                        created_tickets.append(ticket)
            
            return {
                "created_projects": created_projects,
                "created_tickets": created_tickets,
                "message": f"Successfully created {len(created_projects)} projects and {len(created_tickets)} tickets"
            }
            
        except Exception as e:
            raise Exception(f"LLM processing failed: {str(e)}")
