#!/bin/bash

# BradBoard Deployment Script
# Usage: ./deploy.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
COMPOSE_FILE="docker-compose.prod.yml"

if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "prod" ]; then
    echo "❌ Invalid environment. Use 'dev' or 'prod'"
    exit 1
fi

echo "🚀 Deploying BradBoard to $ENVIRONMENT environment..."

# Check if we're in the right directory
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ docker-compose.prod.yml not found. Are you in the right directory?"
    exit 1
fi

# Check if environment file exists
ENV_FILE="backend/.env.prod"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Environment file $ENV_FILE not found"
    echo "Please copy backend/.env.prod.example to backend/.env.prod and configure it"
    exit 1
fi

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Pull latest Docker images
echo "🐳 Pulling Docker images..."
docker-compose -f $COMPOSE_FILE pull

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

# Start new containers
echo "▶️ Starting containers..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service health..."
if docker-compose -f $COMPOSE_FILE ps | grep -q "Up"; then
    echo "✅ Services are running"
else
    echo "❌ Some services failed to start"
    docker-compose -f $COMPOSE_FILE logs
    exit 1
fi

# Clean up old images and containers
echo "🧹 Cleaning up..."
docker system prune -f

# Show running containers
echo "📊 Current status:"
docker-compose -f $COMPOSE_FILE ps

echo "✅ Deployment complete!"
echo ""
echo "🌐 Application should be available at:"
if [ "$ENVIRONMENT" = "prod" ]; then
    echo "   https://bradboard.blackmore.ai"
else
    echo "   http://$(curl -s ifconfig.me)"
fi
echo ""
echo "📝 To view logs:"
echo "   docker-compose -f $COMPOSE_FILE logs -f"
