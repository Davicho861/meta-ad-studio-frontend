#!/bin/bash

# cleanup_docker_env.sh
# Este script detiene y elimina todos los componentes de Docker creados por el script anterior.

echo "🛑 Deteniendo y eliminando contenedores de Docker..."
docker-compose -f docker-compose.local.yml down --volumes --rmi local

echo "🗑️ Eliminando archivos de configuración generados..."
rm -f .env
rm -f docker-compose.local.yml
rm -f nginx.local.conf
rm -f Dockerfile

# Opcional: Si quieres eliminar también el repositorio del frontend
# read -p "¿Deseas eliminar también el directorio 'meta-verse-visualizer-main'? (s/n) " -n 1 -r
# echo
# if [[ $REPLY =~ ^[Ss]$ ]]
# then
#     echo "🗑️ Eliminando el repositorio del frontend..."
#     rm -rf meta-verse-visualizer-main
# fi

echo "✅ ¡Limpieza completada! El entorno Docker ha sido desmantelado."
