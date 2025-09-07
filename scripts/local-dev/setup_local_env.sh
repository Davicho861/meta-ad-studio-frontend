#!/bin/bash

# Abort on any error
set -e

# --- Helper Functions ---
command_exists() {
    command -v "$1" &> /dev/null
}

# --- Prerequisite Verification ---
echo "### Verifying prerequisites... ###"
if ! command_exists git; then
    echo "Error: git is not installed. Please install it before running this script."
    exit 1
fi
if ! command_exists docker; then
    echo "Error: docker is not installed. Please install it before running this script."
    exit 1
fi
if ! command_exists docker-compose; then
    echo "Error: docker-compose is not installed. Please install it before running this script."
    exit 1
fi
echo "### Prerequisites verified successfully. ###"
echo

# --- Repository Cloning ---
FRONTEND_REPO_DIR="meta-verse-visualizer-main"
FRONTEND_REPO_URL="https://github.com/Davicho861/Meta-Ad-Studio-.git"

echo "### Checking for Frontend Repository... ###"
if [ ! -d "$FRONTEND_REPO_DIR" ]; then
    echo "Directory '$FRONTEND_REPO_DIR' not found. Cloning repository..."
    git clone "$FRONTEND_REPO_URL" "$FRONTEND_REPO_DIR"
else
    echo "Directory '$FRONTEND_REPO_DIR' already exists. Skipping clone."
fi
echo "### Frontend repository is ready. ###"
echo

# --- Configuration File Generation ---
echo "### Generating configuration files... ###"

# 1. .env file
echo "Generating .env file..."
cat <<EOF > .env
# PostgreSQL Config
POSTGRES_USER=admin
POSTGRES_PASSWORD=supersecret
POSTGRES_DB=meta_ad_studio_db
DB_PORT=5432

# Backend API Config
API_PORT=3000

# Frontend UI Config
FRONTEND_PORT=5173

# Nginx Reverse Proxy
NGINX_PORT=8080
EOF

# 2. docker-compose.local.yml file
echo "Generating docker-compose.local.yml file..."
cat <<EOF > docker-compose.local.yml
version: '3.8'

services:
  postgres-db:
    image: postgres:14-alpine
    container_name: postgres-db
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "\${DB_PORT}:5432"
    restart: unless-stopped

  backend-api:
    container_name: backend-api
    build:
      context: .
      dockerfile: Dockerfile # Assuming a Dockerfile exists in the current directory
    ports:
      - "\${API_PORT}:\${API_PORT}"
    depends_on:
      - postgres-db
    environment:
      DATABASE_URL: postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@postgres-db:5432/\${POSTGRES_DB}?schema=public
      PORT: \${API_PORT}
    restart: unless-stopped

  frontend-ui:
    container_name: frontend-ui
    build:
      context: ./meta-verse-visualizer-main
      dockerfile: Dockerfile # Assuming a Dockerfile exists in the frontend repo
    ports:
      - "\${FRONTEND_PORT}:\${FRONTEND_PORT}"
    restart: unless-stopped

  reverse-proxy:
    container_name: reverse-proxy
    build:
      context: .
      dockerfile: reverse-proxy.Dockerfile
    ports:
      - "\${NGINX_PORT}:80"
    depends_on:
      - backend-api
      - frontend-ui
    restart: unless-stopped

volumes:
  postgres_data:
EOF

# 3. nginx.local.conf file
echo "Generating nginx.local.conf file..."
cat <<EOF > nginx.local.conf
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://frontend-ui:5173; # Default Vite port
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/ {
        proxy_pass http://backend-api:3000/; # Backend API port
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# 4. Dockerfile for Nginx reverse-proxy
echo "Generating reverse-proxy.Dockerfile..."
cat <<EOF > reverse-proxy.Dockerfile
FROM nginx:alpine
COPY nginx.local.conf /etc/nginx/conf.d/default.conf
EOF

echo "### All configuration files generated successfully. ###"
echo

# --- Launching the Docker Stack ---
echo "### Building and launching the Docker stack... ###"
echo "This may take a few minutes..."

docker-compose -f docker-compose.local.yml up --build -d

echo
echo "-----------------------------------------------------"
echo "✅  Environment setup complete!"
echo
echo "The application stack is running in the background."
echo "You can access the Meta Ad Studio UI at:"
echo "➡️   http://localhost:8080"
echo
echo "To stop the services, run: docker-compose -f docker-compose.local.yml down"
echo "-----------------------------------------------------"

exit 0
