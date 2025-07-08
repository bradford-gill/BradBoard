# BradBoard Backend

FastAPI backend for the BradBoard project management application.

## Features

- **Authentication**: Supabase Auth integration with JWT tokens
- **Projects**: Full CRUD operations for project management
- **Tickets**: Advanced ticket management with filtering and search
- **Smart Creation**: AI-powered ticket creation using OpenAI
- **Export**: CSV export functionality
- **Real-time**: WebSocket support for live updates

## Tech Stack

- **Framework**: FastAPI 0.104+
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4 for smart ticket creation
- **Validation**: Pydantic v2
- **Testing**: pytest with async support

## Project Structure

```
backend/
├── app/
│   ├── api/                 # API routes
│   │   ├── deps.py         # Dependencies
│   │   └── v1/
│   │       ├── router.py   # Main router
│   │       └── endpoints/  # API endpoints
│   ├── core/               # Core functionality
│   │   ├── config.py       # Settings
│   │   ├── database.py     # DB connection
│   │   └── security.py     # Auth utilities
│   ├── models/             # Database models
│   ├── schemas/            # Pydantic schemas
│   ├── services/           # Business logic
│   └── tests/              # Test files
├── requirements.txt        # Dependencies
├── Dockerfile             # Development container
├── Dockerfile.prod        # Production container
└── .env.example           # Environment template
```

## Local Development

```bash
# uv venv # (if not already created)
cd backend
source .venv/bin/activate
uv pip install -r requirements.txt
export $(grep -v '^#' .env | xargs)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

### Run with Docker

```bash
# from project root directory
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8080/docs
- **ReDoc**: http://localhost:8080/redoc
- **OpenAPI JSON**: http://localhost:8080/api/v1/openapi.json

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `SECRET_KEY` | JWT secret key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `ENVIRONMENT` | Environment (development/production) | No |

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Projects
- `GET /api/v1/projects` - List projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/{id}` - Get project
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project

### Tickets
- `GET /api/v1/tickets` - List tickets (with filtering)
- `POST /api/v1/tickets` - Create ticket
- `GET /api/v1/tickets/{id}` - Get ticket
- `PUT /api/v1/tickets/{id}` - Update ticket
- `DELETE /api/v1/tickets/{id}` - Delete ticket

### Smart Creation
- `POST /api/v1/create` - Create tickets from text using AI

### Export
- `GET /api/v1/export/tickets/csv` - Export tickets as CSV

### Utility
- `GET /health` - Health check

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest app/tests/test_main.py -v
```

## Development

### Code Style
- Follow PEP 8
- Use type hints
- Document functions with docstrings
- Use async/await for I/O operations

### Adding New Endpoints
1. Create schema in `schemas/`
2. Add model in `models/`
3. Implement service in `services/`
4. Create endpoint in `api/v1/endpoints/`
5. Add to router in `api/v1/router.py`
6. Write tests in `tests/`

## Deployment

See the main project README and `deploy/` directory for deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request