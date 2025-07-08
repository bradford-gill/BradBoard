# BradBoard 
Project management - as simple as can be.

## Features
- Projects & Tickets 
- Add tickets(s) using plan text 
- Ticket view
- Filter by project, user, date, status, ...
- Simple Auth

## Tech Stack
Frontend: React (typescript) (Created in bolt, do not create)
Backend: FastAPI
DB: Supabase (Postgres)
Auth: Supabase
Proxy: Caddy (bradboard.blackmore.ai)
Hosting: AWS
CI: GitHub Actions
Containerization: Docker Compose

## Data Models 

~~~python
from pydantic import BaseModel
from enum import Enum

# (Needs to be in frontend, backend, & supabase)
class Project(BaseModel):
    # Table name: projects
    id: str # uuid
    title: str
    description: str
    created_by_id: str # uuid, FK to users
    created_by_name: str
    # Timestamps
    created_at: datetime.datetime # Compatable with supabase
    updated_at: datetime.datetime # Compatable with supabase

class Priority(int, Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3

class Status(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in progress"
    DONE = "done"

# (Needs to be in frontend, backend, & supabase)
class Ticket(BaseModel):
    # Table name: tickets
    id: str # uuid
    project_id: str # uuid, FK to projects
    title: str
    description: str
    created_by_id: str # uuid, FK to users
    created_by_name: str
    status: Status # open, in progress, done
    priority: Priority # 1-3
    assigned_to_id: str # uuid, FK to users (optional)
    assigned_to_name: str # optional

    # Timestamps
    created_at: datetime.datetime # Compatable with supabase
    updated_at: datetime.datetime # Compatable with supabase

# Each endpoint will also need request & return models.
~~~

## Frontend (Created in bolt, do not create)
React with typescript

### Styles:
Primary:
- Charcoal Black #1C1C1C
- Cloud White #F5F5F5

Accent:
- Slate Gray #4B4B4B
- Electric Blue #3A8DFF

Fonts:
- Primary: Inter
- Secondary: Familjen Grotesk

### Pages:
For simplicity, there are only two pages.

#### Login
#### Tickets Page
Top header row:
- Smart Add Ticket(s)
- Add Project 
- Export All As CSV
- Logout

Filters Section: 
Row 1: Columns to filter tickets with options to select by (drop down multi-select):
- Columns: Project, User, Status
Row 2: Search by title & description

Table:
Each row is a ticket, sorted by priority (asc) then created_at (desc)

### Modals:
- Add Ticket(s)
- Add / Edit Ticket
- Add / Edit Project

## Backend
Fast API App.
backend/app/
├── main.py              # App entry point
├── core/
│   ├── config.py        # Settings and configuration
│   ├── security.py      # Auth utilities
│   └── database.py      # DB connection
├── api/
│   ├── __init__.py
│   ├── deps.py          # Dependencies
│   └── v1/
│       ├── __init__.py
│       ├── router.py    # Main API router
│       └── endpoints/
│           ├── users.py
│           └── items.py
├── models/              # Database models
├── schemas/             # Pydantic models
├── services/            # Business logic
└── tests/

### Auth Endpoints:
#### `/auth/login`
#### `/auth/logout`
#### `/auth/register`
#### `/auth/refresh_token`

### `/projects`
- Standard CRUD endpoints.
- Get all or filtered projects.
- Authenticated users can CRUD any project.

### `/tickets`
- Standard CRUD endpoints.
- Get all or filtered tickets, see frontend. 
- Authenticated users can CRUD any ticket.

### `/create`
Authenticated users can access this endpoint

Given a string of text, project id, and current user id the LLM will be called to create tickets. The LLM will be exposed two tools, create project & create ticket.

For simplicity we will use a standard tool calling loop using openai function calling. 

### Other
- /health
- /export (send all tickets as csv) (authenticated users only)

## DB (Supabase)
Must create queies to create the tables and assign RLS rules

RLS: All authenticated users can CRUD any projects & tickets anyone creates.

## AWS
Servers:
- Prod
- Dev

## CI 
Simple CI/CD pipeline using GitHub Actions.
1. Builds and deploys latest code to server.