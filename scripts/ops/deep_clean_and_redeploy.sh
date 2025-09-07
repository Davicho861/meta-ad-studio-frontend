#!/bin/bash

# deep_clean_and_redeploy.sh
# Script para una limpieza profunda y un redespliegue garantizado (con sudo).

echo "🛑 DETENIENDO Y ELIMINANDO TODOS LOS PROCESOS DE PM2..."
sudo pm2 stop all
sudo pm2 delete all
sudo pm2 save --force # Forza el guardado de una lista de procesos vacía

echo "🗑️ ELIMINANDO DEPENDENCIAS ANTIGUAS (node_modules) CON SUDO..."
echo "   - Eliminando del backend..."
sudo rm -rf node_modules
echo "   - Eliminando del frontend..."
sudo rm -rf meta-verse-visualizer-main/node_modules

echo "📦 REINSTALANDO DEPENDENCIAS DESDE CERO CON SUDO..."
echo "   - Instalando para el backend..."
sudo npm install
echo "   - Instalando para el frontend..."
(cd meta-verse-visualizer-main && sudo npm install) # Usamos un subshell para no cambiar de directorio

echo "🚀 LANZANDO SERVICIOS CON LA CONFIGURACIÓN CORRECTA Y DEFINITIVA..."

# 1. Iniciar el Backend API (apuntando DIRECTAMENTE al archivo del servidor)
sudo pm2 start server/dist/index.js --name "backend-api"

# 2. Iniciar el Frontend UI (el visualizador) en el puerto correcto
sudo pm2 start "npm run dev -- --port 5173" --name "frontend-ui" --cwd ./meta-verse-visualizer-main

# Guardar la nueva lista de procesos correcta
sudo pm2 save

echo "✅ ¡Redespliegue completado!"
sudo pm2 list # Mostramos la lista final para confirmar que todo está correcto

echo ""
echo "🎉 Por favor, ahora sí, ve a tu navegador y realiza una 'Hard Refresh':"
echo "   - En Chrome/Firefox/Edge: Presiona Ctrl + Shift + R"
echo "   - En Safari: Presiona Cmd + Shift + R"
echo ""
echo "La dirección es: http://localhost:8080"
