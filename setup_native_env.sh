#!/bin/bash

# setup_native_env.sh
# Script para desplegar el ecosistema Meta Ad Studio nativamente en Debian 12.
# ADVERTENCIA: Este script instalará paquetes y configurará servicios usando sudo.

# --- Variables de Configuración ---
FRONTEND_REPO_URL="https://github.com/tu-usuario/meta-verse-visualizer-main.git" # <-- ¡CAMBIA ESTA URL!
DB_USER="admin"
DB_PASS="supersecret"
DB_NAME="meta_ad_studio_db"

API_PORT=3000
FRONTEND_PORT=5173
NGINX_PORT=8080

# --- Función para verificar comandos ---
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# --- 1. Verificación de Prerrequisitos ---
echo "🔎 Verificando prerrequisitos..."
PACKAGES_TO_INSTALL=""
if ! command_exists node; then PACKAGES_TO_INSTALL="$PACKAGES_TO_INSTALL nodejs npm"; fi
if ! command_exists npm; then PACKAGES_TO_INSTALL="$PACKAGES_TO_INSTALL npm"; fi
if ! command_exists psql; then PACKAGES_TO_INSTALL="$PACKAGES_TO_INSTALL postgresql postgresql-contrib"; fi
if ! command_exists nginx; then PACKAGES_TO_INSTALL="$PACKAGES_TO_INSTALL nginx"; fi
if ! command_exists pm2; then 
    echo "pm2 no encontrado. Se instalará globalmente a través de npm."
fi

if [ -n "$PACKAGES_TO_INSTALL" ]; then
    echo "📦 Instalando dependencias del sistema: $PACKAGES_TO_INSTALL"
    sudo apt-get update
    sudo apt-get install -y $PACKAGES_TO_INSTALL
fi

if ! command_exists pm2; then
    sudo npm install -g pm2
fi
echo "✅ Prerrequisitos listos."

# --- 2. Clonado de Repositorios ---
echo "🔄 Clonando el repositorio del frontend..."
if [ ! -d "meta-verse-visualizer-main" ]; then
    git clone $FRONTEND_REPO_URL meta-verse-visualizer-main
else
    echo "El directorio 'meta-verse-visualizer-main' ya existe, omitiendo clonado."
fi
echo "✅ Repositorio del frontend listo."

# --- 3. Configuración de la Base de Datos PostgreSQL ---
echo "🐘 Configurando la base de datos PostgreSQL..."
# Crea el usuario y la base de datos si no existen
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null
echo "✅ Base de datos '$DB_NAME' y usuario '$DB_USER' listos."

# --- 4. Configuración del Backend ---
echo "⚙️ Configurando el Backend (API)..."
# Crear archivo .env para el backend
cat > .env << EOF
# Backend .env
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"
PORT=${API_PORT}
EOF

echo "📦 Instalando dependencias del backend..."
npm install

echo "✅ Backend configurado."

# --- 5. Configuración del Frontend ---
echo "🎨 Configurando el Frontend (UI)..."
cd meta-verse-visualizer-main

echo "📦 Instalando dependencias del frontend..."
CYPRESS_INSTALL_BINARY=0 npm install

cd ..
echo "✅ Frontend configurado."

# --- 6. Configuración de Nginx como Reverse Proxy ---
echo "🌐 Configurando Nginx..."
NGINX_CONF_PATH="/etc/nginx/sites-available/meta_ad_studio"
cat <<EOF | sudo tee $NGINX_CONF_PATH
server {
    listen $NGINX_PORT;
    server_name localhost;

    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:$API_PORT/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Habilitar el sitio y reiniciar Nginx
sudo ln -sf $NGINX_CONF_PATH /etc/nginx/sites-enabled/
sudo nginx -t # Test de configuración
sudo systemctl restart nginx
echo "✅ Nginx configurado y reiniciado."

# --- 7. Lanzamiento de las Aplicaciones con PM2 ---
echo "🚀 Lanzando aplicaciones con PM2..."
pm2 stop backend-api frontend-ui || true
pm2 delete backend-api frontend-ui || true

# Lanzar Backend
pm2 start "npm run dev" --name "backend-api"

# Lanzar Frontend
cd meta-verse-visualizer-main
pm2 start "npm run dev -- --port $FRONTEND_PORT" --name "frontend-ui"
cd ..

pm2 save
echo "✅ Aplicaciones lanzadas en segundo plano."

# --- Instrucciones Finales ---
echo "🎉 ¡Despliegue nativo completado con éxito! 🎉"
echo ""
echo "Tu ecosistema 'Meta Ad Studio' está listo y funcionando."
echo "Puedes acceder a la interfaz de usuario en:"
echo "👉 http://localhost:$NGINX_PORT"
echo ""
echo "Para monitorear los servicios, usa el comando: pm2 list"
echo "Para ver los logs del backend: pm2 logs backend-api"
echo "Para ver los logs del frontend: pm2 logs frontend-ui"
