# BradBoard 
Project management - as simple as can be.

## Features
- Projects & Tickets 
- Add tickets(s) using plan text 
- Ticket view
- Filter by project, user, date, status, ...
- Simple Auth

## High level design 
Frontend: React
Backend: FastAPI
DB: Supabase (Postgres)
Auth: Supabase
Proxy: Caddy (bradboard.blackmore.ai)
Hosting: AWS
Deployment: GitHub Actions
Containerization: Docker Compose

## Data Models 
(Needs to be in frontend, backend, & supabase)
~~~python
from pydantic import BaseModel

class Project(BaseModel):
    # Table name: projects
    id: str # uuid
    title: str
    description: str
    created_by: str
    # Timestamps
    created_at: datetime.datetime # Compatable with supabase
    updated_at: datetime.datetime # Compatable with supabase

class Ticket(BaseModel):
    # Table name: tickets
    id: str # uuid
    project_id: str # uuid, FK to projects
    title: str
    description: str
    created_by: str
    priority: int # 1-3
    assigned_to: str
    
    # Timestamps
    created_at: datetime.datetime # Compatable with supabase
    updated_at: datetime.datetime # Compatable with supabase
~~~

