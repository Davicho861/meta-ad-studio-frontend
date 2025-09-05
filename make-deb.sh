#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

LOGFILE="$ROOT_DIR/make-deb.log"
: > "$LOGFILE"

echo "[meta-ad-studio] Ejecutando: npm run make" | tee -a "$LOGFILE"
if ! command -v npm >/dev/null 2>&1; then
  echo "npm no encontrado. Instala Node.js y npm." | tee -a "$LOGFILE"
  exit 1
fi

# Ejecutar make
npm run make 2>&1 | tee -a "$LOGFILE"

# Buscar .deb en las rutas comunes
CANDIDATE_DIRS=(
  "$ROOT_DIR/out/make/deb/x64"
  "$ROOT_DIR/out/make/deb"
  "$ROOT_DIR/out"
)

FOUND=0
for d in "${CANDIDATE_DIRS[@]}"; do
  if [ -d "$d" ]; then
    echo "Buscando .deb en: $d" | tee -a "$LOGFILE"
    debs=("$d"/*.deb)
    if [ -e "${debs[0]}" ]; then
      echo "Paquetes .deb encontrados en $d:" | tee -a "$LOGFILE"
      ls -la "$d"/*.deb | tee -a "$LOGFILE"
      echo "\nInstala con:\n  sudo dpkg -i ${debs[0]}\n  sudo apt-get install -f" | tee -a "$LOGFILE"
      FOUND=1
      break
    fi
  fi
done

if [ "$FOUND" -eq 0 ]; then
  echo "No se encontró ningún .deb en las rutas esperadas. Revisa $LOGFILE para más detalles." | tee -a "$LOGFILE"
  exit 2
fi

echo "Hecho. Registro disponible en $LOGFILE" | tee -a "$LOGFILE"
