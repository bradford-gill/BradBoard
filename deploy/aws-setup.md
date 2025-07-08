# AWS Deployment Setup for BradBoard

## Prerequisites

1. AWS Account with appropriate permissions
2. Two EC2 instances (Development and Production)
3. Domain name configured (bradboard.blackmore.ai)
4. SSH key pairs for server access

## EC2 Instance Requirements

### Minimum Specifications
- **Instance Type**: t3.small (2 vCPU, 2 GB RAM)
- **Storage**: 20 GB gp3 SSD
- **OS**: Ubuntu 22.04 LTS
- **Security Groups**: Allow HTTP (80), HTTPS (443), SSH (22)

### Recommended for Production
- **Instance Type**: t3.medium (2 vCPU, 4 GB RAM)
- **Storage**: 30 GB gp3 SSD

## Server Setup Instructions

### 1. Initial Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install git -y

# Create application directory
sudo mkdir -p /opt/bradboard
sudo chown $USER:$USER /opt/bradboard
```

### 2. Clone Repository

```bash
cd /opt/bradboard
git clone https://github.com/your-username/BradBoard.git .
```

### 3. Environment Configuration

```bash
# Copy environment files
cp backend/.env.prod.example backend/.env.prod

# Edit environment variables
nano backend/.env.prod
```

### 4. SSL Certificate Setup (Production Only)

Caddy will automatically handle SSL certificates via Let's Encrypt when using the production Caddyfile.

## Deployment Commands

### Development Server
```bash
cd /opt/bradboard
docker-compose -f docker-compose.prod.yml up -d
```

### Production Server
```bash
cd /opt/bradboard
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring and Maintenance

### View Logs
```bash
# Backend logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Caddy logs
docker-compose -f docker-compose.prod.yml logs -f caddy

# All services
docker-compose -f docker-compose.prod.yml logs -f
```

### Update Application
```bash
cd /opt/bradboard
git pull origin main  # or develop for dev server
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
docker system prune -f
```

### Backup Strategy
- Database: Handled by Supabase (automatic backups)
- Application: Git repository serves as backup
- Logs: Rotate and archive as needed

## Security Considerations

1. **Firewall**: Configure UFW or AWS Security Groups
2. **SSH**: Use key-based authentication only
3. **Updates**: Regular system updates via unattended-upgrades
4. **Monitoring**: Set up CloudWatch or similar monitoring
5. **Secrets**: Use AWS Secrets Manager for sensitive data

## DNS Configuration

Point your domain to the EC2 instance:
- **A Record**: bradboard.blackmore.ai → EC2 Public IP
- **CNAME**: www.bradboard.blackmore.ai → bradboard.blackmore.ai

## GitHub Secrets Required

Add these secrets to your GitHub repository:

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password
- `DEV_HOST`: Development server IP
- `DEV_USERNAME`: Development server SSH username
- `DEV_SSH_KEY`: Development server SSH private key
- `PROD_HOST`: Production server IP
- `PROD_USERNAME`: Production server SSH username
- `PROD_SSH_KEY`: Production server SSH private key
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `OPENAI_API_KEY`: OpenAI API key
