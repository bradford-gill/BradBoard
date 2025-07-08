#!/bin/bash

# BradBoard Backend API Test Scripts
# Make sure your backend is running on http://localhost:8000
# Usage: chmod +x curl-test-scripts.sh && ./curl-test-scripts.sh

BASE_URL="http://localhost:8001/api/v1"
CONTENT_TYPE="Content-Type: application/json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Function to print test descriptions
print_test() {
    echo -e "${YELLOW}Testing: $1${NC}"
}

# Variables to store tokens and IDs
ACCESS_TOKEN=""
REFRESH_TOKEN=""
PROJECT_ID=""
TICKET_ID=""

print_header "HEALTH CHECK"
print_test "Root endpoint"
curl -X GET "$BASE_URL/../" | jq .

print_test "Health check"
curl -X GET "$BASE_URL/../health" | jq .

print_header "AUTHENTICATION TESTS"

print_test "User Registration"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
  }')

echo "$REGISTER_RESPONSE" | jq .

# Extract tokens from registration response
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token // empty')
REFRESH_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.refresh_token // empty')

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    echo -e "${GREEN}✓ Registration successful, tokens extracted${NC}"
else
    echo -e "${RED}✗ Registration failed or user already exists${NC}"
    
    print_test "User Login (fallback)"
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "$CONTENT_TYPE" \
      -d '{
        "email": "test@example.com",
        "password": "testpassword123"
      }')
    
    echo "$LOGIN_RESPONSE" | jq .
    
    # Extract tokens from login response
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token // empty')
    REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.refresh_token // empty')
fi

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
    echo -e "${RED}✗ Could not obtain access token. Exiting.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Access token obtained${NC}"

print_test "Token Refresh"
curl -X POST "$BASE_URL/auth/refresh" \
  -H "$CONTENT_TYPE" \
  -d "{\"refresh_token\": \"$REFRESH_TOKEN\"}" | jq .

print_header "PROJECT TESTS"

print_test "Create Project"
PROJECT_RESPONSE=$(curl -s -X POST "$BASE_URL/projects/" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Test Project",
    "description": "A test project for API testing"
  }')

echo "$PROJECT_RESPONSE" | jq .

# Extract project ID
PROJECT_ID=$(echo "$PROJECT_RESPONSE" | jq -r '.id // empty')

if [ -n "$PROJECT_ID" ] && [ "$PROJECT_ID" != "null" ]; then
    echo -e "${GREEN}✓ Project created with ID: $PROJECT_ID${NC}"
else
    echo -e "${RED}✗ Project creation failed${NC}"
fi

print_test "Get All Projects"
curl -X GET "$BASE_URL/projects/?page=1&size=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

if [ -n "$PROJECT_ID" ] && [ "$PROJECT_ID" != "null" ]; then
    print_test "Get Specific Project"
    curl -X GET "$BASE_URL/projects/$PROJECT_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

    print_test "Update Project"
    curl -X PUT "$BASE_URL/projects/$PROJECT_ID" \
      -H "$CONTENT_TYPE" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -d '{
        "title": "Updated Test Project",
        "description": "Updated description for testing"
      }' | jq .
fi

print_header "TICKET TESTS"

if [ -n "$PROJECT_ID" ] && [ "$PROJECT_ID" != "null" ]; then
    print_test "Create Ticket"
    TICKET_RESPONSE=$(curl -s -X POST "$BASE_URL/tickets/" \
      -H "$CONTENT_TYPE" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -d "{
        \"title\": \"Test Ticket\",
        \"description\": \"A test ticket for API testing\",
        \"project_id\": \"$PROJECT_ID\",
        \"status\": \"open\",
        \"priority\": 2,
        \"assigned_to_id\": null,
        \"assigned_to_name\": null
      }")

    echo "$TICKET_RESPONSE" | jq .

    # Extract ticket ID
    TICKET_ID=$(echo "$TICKET_RESPONSE" | jq -r '.id // empty')

    if [ -n "$TICKET_ID" ] && [ "$TICKET_ID" != "null" ]; then
        echo -e "${GREEN}✓ Ticket created with ID: $TICKET_ID${NC}"
    else
        echo -e "${RED}✗ Ticket creation failed${NC}"
    fi
else
    echo -e "${RED}✗ Skipping ticket tests - no project ID available${NC}"
fi

print_test "Get All Tickets"
curl -X GET "$BASE_URL/tickets/?page=1&size=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

print_test "Get Tickets with Filters"
curl -X GET "$BASE_URL/tickets/?page=1&size=10&statuses=open&priorities=2&search=test" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

if [ -n "$TICKET_ID" ] && [ "$TICKET_ID" != "null" ]; then
    print_test "Get Specific Ticket"
    curl -X GET "$BASE_URL/tickets/$TICKET_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

    print_test "Update Ticket"
    curl -X PUT "$BASE_URL/tickets/$TICKET_ID" \
      -H "$CONTENT_TYPE" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -d '{
        "title": "Updated Test Ticket",
        "description": "Updated description for testing",
        "status": "in progress",
        "priority": 3
      }' | jq .
fi

print_header "SMART CREATION TESTS"

if [ -n "$PROJECT_ID" ] && [ "$PROJECT_ID" != "null" ]; then
    print_test "Smart Create with Project ID"
    curl -X POST "$BASE_URL/create/" \
      -H "$CONTENT_TYPE" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -d "{
        \"text\": \"Create a high priority ticket to fix the login bug and a medium priority ticket to update the documentation\",
        \"project_id\": \"$PROJECT_ID\"
      }" | jq .
fi

print_test "Smart Create without Project ID"
curl -X POST "$BASE_URL/create/" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "text": "Create a new project called Mobile App with tickets for user authentication, push notifications, and app store deployment"
  }' | jq .

print_header "USERS TESTS"

print_test "Get All Users"
curl -X GET "$BASE_URL/users/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

print_test "Get Current User Info"
curl -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

print_header "EXPORT TESTS"

print_test "Export Tickets as CSV"
curl -X GET "$BASE_URL/export/tickets/csv" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  --output tickets_export.csv

if [ -f "tickets_export.csv" ]; then
    echo -e "${GREEN}✓ CSV export successful - saved as tickets_export.csv${NC}"
    echo "First few lines of CSV:"
    head -5 tickets_export.csv
else
    echo -e "${RED}✗ CSV export failed${NC}"
fi

print_header "CLEANUP TESTS"

if [ -n "$TICKET_ID" ] && [ "$TICKET_ID" != "null" ]; then
    print_test "Delete Ticket"
    curl -X DELETE "$BASE_URL/tickets/$TICKET_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
fi

if [ -n "$PROJECT_ID" ] && [ "$PROJECT_ID" != "null" ]; then
    print_test "Delete Project"
    curl -X DELETE "$BASE_URL/projects/$PROJECT_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
fi

print_test "Logout"
curl -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

print_header "TESTS COMPLETED"
echo -e "${GREEN}All API tests completed!${NC}"
echo -e "${YELLOW}Note: Some tests may fail if the backend is not running or if there are authentication issues.${NC}"
