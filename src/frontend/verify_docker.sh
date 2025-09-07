#!/bin/bash
echo "--- Verificación de Docker y Backup del Proyecto ---"

# 1. Verificar si Docker está instalado
echo "[INFO] Verificando si Docker está instalado..."
if ! command -v docker &> /dev/null
then
    echo "[ADVERTENCIA] Docker no parece estar instalado. No se pueden listar contenidos."
    exit 0
else
    echo "[OK] Docker está instalado."
fi

# 2. Listar contenido de Docker
echo -e "
--- Listando Contenido de Docker ---"
echo "--- Contenedores (activos e inactivos) ---"
docker ps -a
echo -e "
--- Imágenes ---"
docker images -a
echo -e "
--- Volúmenes ---"
docker volume ls

# 3. Estimar espacio ocupado por Docker
echo -e "
--- Estimando Espacio Ocupado por Docker ---"
docker system df

# 4. Comando de backup
echo -e "
--- Comando de Backup Sugerido ---"
BACKUP_DIR="$HOME/backup-meta-app-$(date +%Y%m%d)"
echo "Para hacer un backup completo del proyecto, ejecuta el siguiente comando:"
echo "cp -r '/home/davicho/Documentos/Meta Studio Ad Studio App SPA' '$BACKUP_DIR'"
echo "----------------------------------------------------"
