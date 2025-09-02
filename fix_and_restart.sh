#!/bin/bash

# fix_and_restart.sh
# Este script detiene y elimina los procesos PM2 incorrectos y los reemplaza
# con la configuración correcta, ejecutando solo el servidor API para el backend.

echo "🛑 Deteniendo y eliminando todos los procesos actuales de PM2..."
pm2 stop all
pm2 delete all

echo "🚀 Lanzando los servicios con la configuración CORRECTA..."

# 1. Lanzar el Backend (APUNTANDO DIRECTAMENTE AL SERVIDOR DE LA API)
# Esto evita que se levante la UI de "Gestión del ciclo de vida".
echo "   - Iniciando el backend API real..."
pm2 start server/dist/index.js --name "backend-api"

# 2. Lanzar el Frontend (el Visualizador del Metaverso)
# El flag --cwd (change working directory) asegura que se ejecute en la carpeta correcta.
echo "   - Iniciando el frontend UI del Visualizador..."
pm2 start "npm run dev" --name "frontend-ui" --cwd ./meta-verse-visualizer-main

# Guardar la nueva lista de procesos para que se reinicie automáticamente
pm2 save

echo "✅ ¡Servicios corregidos y reiniciados!"
echo ""
echo "Se ha eliminado la interfaz incorrecta y ahora solo el servidor API está corriendo para el backend."
echo "Puedes verificar el estado con: pm2 list"
echo ""
echo "🎉 ¡Por favor, refresca tu navegador en la siguiente dirección!"
echo "👉 http://localhost:8080"
