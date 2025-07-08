#!/bin/bash

# Quick Backend Test Script
# Tests basic functionality of the BradBoard API

BASE_URL="http://localhost:8001"
API_URL="$BASE_URL/api/v1"

echo "🚀 Testing BradBoard Backend API"
echo "================================"

# Test 1: Health Check
echo "1. Testing health endpoints..."
echo "   Root endpoint:"
ROOT_RESPONSE=$(curl -s "$BASE_URL/")
echo "   $ROOT_RESPONSE"

echo "   Health check:"
HEALTH_RESPONSE=$(curl -s "$BASE_URL/health")
echo "   $HEALTH_RESPONSE"

# Test 2: Authentication
echo ""
echo "2. Testing authentication..."
echo "   Attempting login with test user:"

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }')

echo "   $LOGIN_RESPONSE"

# Extract access token (simple grep method since jq is not available)
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    echo "   ✅ Login successful"
    
    # Test 3: Projects
    echo ""
    echo "3. Testing projects endpoint..."
    PROJECTS_RESPONSE=$(curl -s -X GET "$API_URL/projects/?page=1&size=5" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    echo "   $PROJECTS_RESPONSE"

    # Test 4: Tickets
    echo ""
    echo "4. Testing tickets endpoint..."
    TICKETS_RESPONSE=$(curl -s -X GET "$API_URL/tickets/?page=1&size=5" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    echo "   $TICKETS_RESPONSE"
    
    echo ""
    echo "✅ Basic API tests completed successfully!"
    echo "💡 Use the full test script (curl-test-scripts.sh) for comprehensive testing"
    
else
    echo "   ❌ Login failed - you may need to register first"
    echo ""
    echo "   Attempting registration..."
    
    REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "password": "testpassword123",
        "name": "Test User"
      }')

    echo "   $REGISTER_RESPONSE"

    ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
        echo "   ✅ Registration successful"
        echo "   💡 Now you can run this script again or use the full test suite"
    else
        echo "   ❌ Registration also failed"
        echo "   🔍 Check if the backend is running and Supabase is configured"
    fi
fi

echo ""
echo "📋 Next steps:"
echo "   - Run full tests: ./curl-test-scripts.sh"
echo "   - Check manual commands: cat manual-curl-commands.md"
echo "   - Ensure backend is running: docker-compose up backend"
