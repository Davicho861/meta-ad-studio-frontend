#!/bin/bash
echo "--- Limpieza Profunda de Docker ---"
echo "[ADVERTENCIA] Este script eliminará TODOS los contenedores, imágenes, volúmenes y redes de Docker."
echo "Esta acción es IRREVERSIBLE."

echo -e "
--- Espacio en disco ANTES de la limpieza ---"
df -h /var/lib/docker || df -h

echo -e "
--- Ejecutando limpieza profunda (docker system prune -a --volumes) ---"
# El comando pedirá confirmación (y/N). La ejecución continuará cuando el usuario confirme.
docker system prune -a --volumes

echo -e "
--- Espacio en disco DESPUÉS de la limpieza ---"
df -h /var/lib/docker || df -h

echo -e "
--- Limpieza completada ---"
