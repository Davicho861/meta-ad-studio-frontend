#!/usr/bin/env bash
# Lanzador robusto para levantar el entorno de desarrollo (Meta-Ad-Studio-)
# Detecta su ubicación, verifica prerrequisitos, se auto-actualiza y levanta docker-compose.dev.yml

set -euo pipefail

info() { echo -e "[INFO] $*"; }
warn() { echo -e "[WARN] $*"; }
err() { echo -e "[ERROR] $*"; }

THIS_SCRIPT="$(readlink -f "$0")"
SCRIPTS_DIR="$(dirname "$THIS_SCRIPT")"
# Asumimos que el directorio del proyecto es el padre del directorio scripts/
PROJECT_ROOT="$(readlink -f "$SCRIPTS_DIR/..")"

cd "$PROJECT_ROOT" || { err "No se puede acceder al directorio del proyecto: $PROJECT_ROOT"; exit 2; }

info "Proyecto detectado en: $PROJECT_ROOT"

echo
info "Verificando prerrequisitos..."
missing=()
for cmd in git docker docker-compose; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    missing+=("$cmd")
  fi
done

if [ ${#missing[@]} -ne 0 ]; then
  err "Faltan prerrequisitos: ${missing[*]}"
  echo
  echo "Instala los paquetes necesarios y vuelve a ejecutar este lanzador." 
  echo "En Debian/Ubuntu: sudo apt install git docker.io docker-compose -y"
  exit 3
fi

echo
info "Auto-actualizando el repositorio..."
# Intentamos actualizar sin romper cambios locales: primero guardar la rama actual
current_branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")"

# Fetch remoto y reintentar pull seguro
if git rev-parse --git-dir >/dev/null 2>&1; then
  git fetch --all --prune || warn "git fetch falló; procediendo con precaución"
  if git pull origin "$current_branch" --ff-only 2>/dev/null; then
    info "Repositorio actualizado (branch: $current_branch)."
  else
    warn "No fue posible fast-forward pull en la rama $current_branch. Intentando 'git pull --rebase'..."
    if git pull --rebase origin "$current_branch"; then
      info "Repositorio actualizado con rebase."
    else
      warn "Actualización automática falló. Conservando estado local; continúa bajo tu propio riesgo."
    fi
  fi
  git submodule update --init --recursive || warn "No se pudo actualizar algún submódulo, verifica manualmente."
else
  warn "Este directorio no parece ser un repositorio git. Omisión de la actualización automática."
fi

echo
info "Lanzando el entorno de desarrollo (docker-compose.dev.yml)..."
if docker-compose -f docker-compose.dev.yml up -d --build; then
  info "Comando de despliegue ejecutado correctamente."
else
  err "docker-compose falló. Revisa los logs para más detalles."
  docker-compose -f docker-compose.dev.yml logs --no-color --tail=200 || true
  exit 4
fi

echo
info "Estado de los servicios (docker-compose -f docker-compose.dev.yml ps):"
docker-compose -f docker-compose.dev.yml ps || true

echo
info "¡Entorno listo! Abre http://localhost:5173 en tu navegador para ver la UI."

exit 0
