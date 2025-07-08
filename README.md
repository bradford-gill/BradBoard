# BradBoard
Project management - as simple as can be.

## Overview

BradBoard is a streamlined project management application designed for simplicity and efficiency. It focuses on the core essentials: projects, tickets, and smart creation powered by AI.

## Features

- **Projects & Tickets**: Clean, intuitive project and ticket management
- **Smart Creation**: Add tickets using natural language with AI assistance
- **Advanced Filtering**: Filter by project, user, date, status, priority, and more
- **Search**: Full-text search across ticket titles and descriptions
- **CSV Export**: Export all tickets for external analysis
- **Simple Authentication**: Secure user management with Supabase Auth
- **Real-time Updates**: Live updates across all connected clients

## Tech Stack

- **Frontend**: React with TypeScript (created in bolt.new)
- **Backend**: FastAPI with Python 3.11+
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4 for smart ticket creation
- **Proxy**: Caddy for reverse proxy and SSL
- **Hosting**: AWS EC2
- **CI/CD**: GitHub Actions
- **Containerization**: Docker Compose

## Project Structure

```
BradBoard/
├── frontend/              # React frontend (created in bolt.new)
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Core functionality
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── tests/       # Test files
│   ├── requirements.txt
│   └── Dockerfile
├── supabase-db/          # Database schema and migrations
├── caddy/               # Caddy configuration
├── deploy/              # Deployment scripts and docs
├── .github/workflows/   # CI/CD pipelines
├── docker-compose.yml   # Development environment
└── docker-compose.prod.yml # Production environment
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Supabase account and project
- OpenAI API key (for smart creation)
- Domain name (for production)

### 1. Clone Repository

```bash
git clone https://github.com/your-username/BradBoard.git
cd BradBoard
```

### 2. Environment Setup

```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your Supabase and OpenAI credentials

# Production environment (if deploying)
cp backend/.env.prod.example backend/.env.prod
# Edit backend/.env.prod with production credentials
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL scripts in `supabase-db/` in order:
   - `01_create_tables.sql`
   - `02_rls_policies.sql`
   - `03_sample_data.sql` (optional)

### 4. Development

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 5. Production Deployment

See `deploy/aws-setup.md` for detailed deployment instructions.

```bash
# Deploy to production
./deploy/deploy.sh prod
```

## API Documentation

Once the backend is running, you can access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Data Models

### Project
```python
class Project(BaseModel):
    id: str                    # UUID
    title: str
    description: str
    created_by: str           # User ID
    created_at: datetime
    updated_at: datetime
```

### Ticket
```python
class Ticket(BaseModel):
    id: str                    # UUID
    project_id: str           # UUID, FK to projects
    title: str
    description: str
    created_by_id: str        # UUID, FK to users
    created_by_name: str
    status: Status            # open, in progress, done
    priority: Priority        # 1 (LOW), 2 (MEDIUM), 3 (HIGH)
    assigned_to_id: str       # Optional UUID, FK to users
    assigned_to_name: str     # Optional
    created_at: datetime
    updated_at: datetime
```

## Key Features

### Smart Ticket Creation
The `/api/v1/create` endpoint uses OpenAI's function calling to parse natural language input and create appropriate tickets and projects. Simply describe what you need in plain text, and the AI will:

- Create new projects if needed
- Break down complex requests into multiple tickets
- Set appropriate priorities and statuses
- Generate descriptive titles and detailed descriptions

### Advanced Filtering
The ticket list supports comprehensive filtering:
- **Projects**: Filter by one or more projects
- **Status**: Filter by ticket status (open, in progress, done)
- **Priority**: Filter by priority level (1-3)
- **Users**: Filter by assigned user or creator
- **Search**: Full-text search in titles and descriptions
- **Pagination**: Efficient pagination for large datasets

### Export Functionality
Export all tickets to CSV format with complete metadata for external analysis or reporting.

## Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Running Tests
```bash
cd backend
pytest
pytest --cov=app  # With coverage
```

### Database Migrations
Database schema changes should be made by:
1. Updating SQL files in `supabase-db/`
2. Running the scripts in your Supabase dashboard
3. Testing with sample data

## Deployment

### Development Server
- Automatic deployment on push to `develop` branch
- Uses Docker Compose for containerization
- Caddy handles reverse proxy and basic SSL

### Production Server
- Automatic deployment on push to `main` branch
- Full SSL termination with Let's Encrypt
- Rate limiting and security headers
- Comprehensive logging and monitoring

### Required GitHub Secrets
- `DOCKER_USERNAME` / `DOCKER_PASSWORD`
- `DEV_HOST` / `DEV_USERNAME` / `DEV_SSH_KEY`
- `PROD_HOST` / `PROD_USERNAME` / `PROD_SSH_KEY`
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`pytest`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.
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
    created_by_id: str # uuid, FK to users
    created_by_name: str
    # Timestamps
    created_at: datetime.datetime # Compatable with supabase
    updated_at: datetime.datetime # Compatable with supabase

class Ticket(BaseModel):
    # Table name: tickets
    id: str # uuid
    project_id: str # uuid, FK to projects
    title: str
    description: str
    created_by_id: str # uuid, FK to users
    created_by_name: str
    priority: int # 1-3
    assigned_to_id: str # uuid, FK to users (optional)
    assigned_to_name: str # optional

    # Timestamps
    created_at: datetime.datetime # Compatable with supabase
    updated_at: datetime.datetime # Compatable with supabase
~~~

