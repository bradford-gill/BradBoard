# BradBoard Backend API - Manual Curl Commands

Base URL: `http://localhost:8080/api/v1`

## Health Check

```bash
# Root endpoint
curl -X GET "http://localhost:8080/"

# Health check
curl -X GET "http://localhost:8080/health"
```

## Authentication

### Register User
```bash
curl -X POST "http://localhost:8080/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
  }'
```

### Login User
```bash
curl -X POST "http://localhost:8001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### Refresh Token
```bash
curl -X POST "http://localhost:8001/api/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

### Logout
```bash
curl -X POST "http://localhost:8001/api/v1/auth/logout" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Projects

### Create Project
```bash
curl -X POST "http://localhost:8001/api/v1/projects/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "title": "My Test Project",
    "description": "A project for testing the API"
  }'
```

### Get All Projects
```bash
curl -X GET "http://localhost:8001/api/v1/projects/?page=1&size=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get Specific Project
```bash
curl -X GET "http://localhost:8001/api/v1/projects/PROJECT_ID_HERE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Update Project
```bash
curl -X PUT "http://localhost:8001/api/v1/projects/PROJECT_ID_HERE" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "title": "Updated Project Title",
    "description": "Updated project description"
  }'
```

### Delete Project
```bash
curl -X DELETE "http://localhost:8001/api/v1/projects/PROJECT_ID_HERE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Tickets

### Create Ticket
```bash
curl -X POST "http://localhost:8001/api/v1/tickets/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "title": "Fix login bug",
    "description": "Users cannot log in with valid credentials",
    "project_id": "PROJECT_ID_HERE",
    "status": "open",
    "priority": 3,
    "assigned_to_id": null,
    "assigned_to_name": null
  }'
```

### Get All Tickets
```bash
curl -X GET "http://localhost:8001/api/v1/tickets/?page=1&size=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get Tickets with Filters
```bash
# Filter by status
curl -X GET "http://localhost:8001/api/v1/tickets/?statuses=open,in%20progress" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"

# Filter by priority
curl -X GET "http://localhost:8001/api/v1/tickets/?priorities=2,3" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"

# Filter by project
curl -X GET "http://localhost:8001/api/v1/tickets/?project_ids=PROJECT_ID_HERE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"

# Search in title/description
curl -X GET "http://localhost:8001/api/v1/tickets/?search=login" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"

# Combined filters
curl -X GET "http://localhost:8001/api/v1/tickets/?page=1&size=5&statuses=open&priorities=3&search=bug" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get Specific Ticket
```bash
curl -X GET "http://localhost:8001/api/v1/tickets/TICKET_ID_HERE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Update Ticket
```bash
curl -X PUT "http://localhost:8001/api/v1/tickets/TICKET_ID_HERE" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "title": "Updated ticket title",
    "description": "Updated description",
    "status": "in progress",
    "priority": 2,
    "assigned_to_id": "USER_ID_HERE",
    "assigned_to_name": "John Doe"
  }'
```

### Delete Ticket
```bash
curl -X DELETE "http://localhost:8001/api/v1/tickets/TICKET_ID_HERE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Smart Creation (AI-powered)

### Create with Project ID
```bash
curl -X POST "http://localhost:8001/api/v1/create/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "text": "Create a high priority ticket to fix the login bug and a medium priority ticket to update the documentation",
    "project_id": "PROJECT_ID_HERE"
  }'
```

### Create without Project ID (will create new project)
```bash
curl -X POST "http://localhost:8001/api/v1/create/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "text": "Create a new project called Mobile App with tickets for user authentication, push notifications, and app store deployment"
  }'
```

## Export

### Export Tickets as CSV
```bash
curl -X GET "http://localhost:8001/api/v1/export/tickets/csv" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  --output tickets_export.csv
```

## Status and Priority Values

### Status Options:
- `"open"`
- `"in progress"`
- `"done"`

### Priority Options:
- `1` (LOW)
- `2` (MEDIUM)
- `3` (HIGH)

## Quick Test Workflow

1. **Register/Login** to get access token
2. **Create a project** and note the project ID
3. **Create tickets** using the project ID
4. **Test filtering** and searching tickets
5. **Update tickets** to change status/priority
6. **Export data** as CSV
7. **Clean up** by deleting test data

## Notes

- Replace `YOUR_ACCESS_TOKEN_HERE` with the actual token from login/register response
- Replace `PROJECT_ID_HERE` and `TICKET_ID_HERE` with actual IDs from create responses
- All endpoints require authentication except register, login, and health checks
- The backend should be running on `http://localhost:8001` (or update the URLs accordingly)
- Use `jq` to format JSON responses: `curl ... | jq .`
