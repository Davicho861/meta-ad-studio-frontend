#!/bin/bash
echo "--- Desinstalación Completa de Docker ---"

echo "[INFO] Deteniendo el servicio de Docker..."
sudo systemctl stop docker
sudo systemctl stop docker.socket

echo "[INFO] Purgando paquetes de Docker..."
sudo apt-get purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
sudo apt-get autoremove -y

echo "[INFO] Eliminando directorios residuales de Docker..."
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
sudo rm -rf /etc/docker
sudo rm -rf ~/.docker

echo "[INFO] Limpiando paquetes obsoletos..."
sudo apt-get autoclean

echo "[INFO] Verificando que Docker ya no esté instalado..."
if command -v docker &> /dev/null
then
    echo "[ERROR] Docker sigue presente en el sistema."
else
    echo "[OK] Docker ha sido eliminado exitosamente."
fi

echo "--- Desinstalación completada ---"
