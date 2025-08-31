#!/bin/bash
# setup_environment.sh
set -e

echo "Updating Debian 12..."
sudo apt update && sudo apt upgrade -y

echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
npm install

echo "Installing Docker..."
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker

echo "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql

echo "Configuring environment variables..."
# Add environment variable setup here

echo "Verifying installations..."
node --version
npm --version
docker --version
docker-compose --version
psql --version
