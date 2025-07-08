# BradBoard 
Project management - as simple as can be.

## Features
- Projects & Tickets 
- Add tickets(s) using plan text 
- Ticket view
- Filter by project, user, date, status, ...
- Simple Auth

## Tech Stack
Frontend: React (typescript)
Backend: FastAPI
DB: Supabase (Postgres)
Auth: Supabase
Proxy: Caddy (bradboard.blackmore.ai)
Hosting: AWS
CI: GitHub Actions
Containerization: Docker Compose

## Data Models 
(Needs to be in frontend, backend, & supabase)
~~~python
from pydantic import BaseModel
from enum import Enum

class Project(BaseModel):
    # Table name: projects
    id: str # uuid
    title: str
    description: str
    created_by: str
    # Timestamps
    created_at: datetime.datetime # Compatable with supabase
    updated_at: datetime.datetime # Compatable with supabase

class Priority(int, Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3

class Ticket(BaseModel):
    # Table name: tickets
    id: str # uuid
    project_id: str # uuid, FK to projects
    title: str
    description: str
    created_by: str
    priority: Priority # 1-3
    assigned_to: str
    
    # Timestamps
    created_at: datetime.datetime # Compatable with supabase
    updated_at: datetime.datetime # Compatable with supabase
~~~

## Frontend
React with typescript

### Pages:
For simplicity, there are only two pages.

#### Login
#### Tickets Page
Top header row:
- Add Ticket
- Add Project 
- Export All As CSV
- Logout

Filters Section: 
Row 1: Columns to filter tickets with options to select by (drop down multi-select): Project, User, Status
Row 2: Search by title & description

Table:
Each row is a ticket, sorted by priority (asc) then created_at (desc)

### Modals:
- Add Ticket(s)
- Add Ticket
- Add / Edit Project

##### Filtering 

## Backend
### Auth Endpoints:
#### /auth/login
#### /auth/logout
#### /auth/register
#### /auth/refresh_token

### /projects
- Standard CRUD endpoints.
- Get all or filtered projects.

### /tickets
- Standard CRUD endpoints.
- Get all or filtered tickets, see frontend. 

### /create
Given a string of text, project id, and current user id the LLM will be called to create tickets. The LLM will be exposed two tools, create project & create ticket.

For simplicity we will use a standard tool calling loop using openai function calling. 

### Other
- /health
- /export (send all tickets as csv)

## DB
RLS: All users can CRUD any projects & tickets anyone creates.

## AWS
Servers:
- Prod
- Dev

## CI 
Simple CI/CD pipeline using GitHub Actions.
1. Builds and deploys latest code to server.