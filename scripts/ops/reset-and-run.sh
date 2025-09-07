#!/bin/bash

echo "🚀 Iniciando el entorno de desarrollo completo para Meta Ad Studio..."

echo "🔥 Fase 1: Limpieza profunda del entorno Docker..."
docker-compose down --volumes --remove-orphans

echo "🏗️ Fase 2: Construyendo y levantando el stack completo..."
docker-compose up --build -d

echo "Applying a 15-second delay to ensure services are fully initialized..."
sleep 15

echo "🗃️ Fase 3: Aplicando migraciones de la base de datos..."
docker-compose exec api-server npx prisma migrate dev

echo "✅ Entorno listo. Ahora validando con tests..."
echo " backend tests..."
docker-compose exec api-server npm test

echo " frontend tests..."
(cd src/frontend/meta-verse-visualizer-main && npm test)

echo "🎉 ¡Todo listo! El entorno está desplegado y validado."
echo "Frontend disponible en http://localhost:<PUERTO_FRONTEND>"
echo "API disponible en http://localhost:3001"
