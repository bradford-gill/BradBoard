#!/bin/bash

# BradBoard Server Initialization Script
# Run this script on a fresh Ubuntu 22.04 server

set -e

echo "🚀 Starting BradBoard server initialization..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
rm get-docker.sh

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
echo "📚 Installing Git..."
sudo apt install git -y

# Install other useful tools
echo "🛠️ Installing additional tools..."
sudo apt install -y htop curl wget unzip ufw

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/bradboard
sudo chown $USER:$USER /opt/bradboard

# Set up log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/docker > /dev/null <<EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF

# Configure automatic updates
echo "🔄 Setting up automatic security updates..."
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Create deployment user (optional)
echo "👤 Creating deployment user..."
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy
sudo mkdir -p /home/deploy/.ssh
sudo chown deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh

echo "✅ Server initialization complete!"
echo ""
echo "Next steps:"
echo "1. Add your SSH public key to /home/deploy/.ssh/authorized_keys"
echo "2. Clone the BradBoard repository to /opt/bradboard"
echo "3. Configure environment variables"
echo "4. Run docker-compose to start the application"
echo ""
echo "Note: You may need to log out and back in for Docker group changes to take effect."
