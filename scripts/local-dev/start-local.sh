#!/usr/bin/env bash
set -euo pipefail

# start-local.sh - Orquesta un entorno de desarrollo local para Meta Ad Studio (Debian)
# Requisitos: docker, docker-compose, node (npm/pnpm/yarn)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[meta-ad-studio] Inicio del arranque local desde: $ROOT_DIR"

# 1) Prerrequisitos
command -v docker >/dev/null 2>&1 || { echo "docker no está instalado. Instala docker y vuelve a intentarlo."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "docker-compose no está instalado. Instala docker-compose y vuelve a intentarlo."; exit 1; }

# 2) Detectar carpetas probables
FRONTEND_DIR="$ROOT_DI./src/frontend"
BACKEND_DIR="$ROOT_DIR/src/backend/server"
if [ ! -d "$BACKEND_DIR" ]; then
  # fallback a carpeta 'backend' si existe
  BACKEND_DIR="$ROOT_DI./src/backend"
fi
if [ ! -d "$BACKEND_DIR" ]; then
  # otro fallback: src/backend/server
  BACKEND_DIR="$ROOT_DIR/src/backend/server"
fi

echo "Frontend: $FRONTEND_DIR"
echo "Backend:  $BACKEND_DIR"

# 3) Copiar .env.example donde falte
copy_env_if_missing(){
  local dir="$1"
  if [ -d "$dir" ]; then
    if [ -f "$dir/.env" ]; then
      echo "  - .env ya existe en $dir"
    else
      if [ -f "$dir/.env.example" ]; then
        cp "$dir/.env.example" "$dir/.env"
        echo "  - Copiado .env.example -> $dir/.env"
      else
        # intentar .env.template o .env.local
        if [ -f "$dir/.env.template" ]; then
          cp "$dir/.env.template" "$dir/.env"
          echo "  - Copiado .env.template -> $dir/.env"
        else
          echo "  - Atención: no se encontró .env.example en $dir. Crea uno si necesitas variables de entorno."
        fi
      fi
    fi
  fi
}

echo "Comprobando y creando archivos .env en frontend y backend (si faltan):"
copy_env_if_missing "$FRONTEND_DIR"
copy_env_if_missing "$BACKEND_DIR"

# 4) Iniciar servicios Docker (detached)
if [ -f "$ROOT_DIR/docker-compose.yml" ]; then
  echo "Iniciando servicios docker-compose..."
  docker-compose -f "$ROOT_DIR/docker-compose.yml" up -d
else
  echo "No se encontró docker-compose.yml en la raíz. Saltando arranque de contenedores.";
fi

# 5) Instalar dependencias en frontend y backend
install_deps_if_needed(){
  local dir="$1"
  if [ -d "$dir" ]; then
    echo "Instalando dependencias en $dir"
    if [ -f "$dir/package-lock.json" ] || [ -f "$dir/package.json" ]; then
      (cd "$dir" && if command -v pnpm >/dev/null 2>&1 && [ -f pnpm-lock.yaml ]; then pnpm install; elif command -v npm >/dev/null 2>&1; then npm install; else echo "No se encontró npm/pnpm. Instala node y npm/pnpm."; fi)
    else
      echo "  - No se encontró package.json en $dir, saltando instalación."
    fi
  fi
}

install_deps_if_needed "$BACKEND_DIR"
install_deps_if_needed "$FRONTEND_DIR"

# 6) Ejecutar migraciones Prisma dentro del backend local (si procede)
run_prisma_migrate(){
  local dir="$1"
  if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
    if grep -q "prisma" "$dir/package.json" 2>/dev/null || [ -f "$dir/prisma/schema.prisma" ]; then
      echo "Aplicando migraciones Prisma en $dir (npx prisma migrate dev)..."
      (cd "$dir" && if command -v npx >/dev/null 2>&1; then npx prisma migrate dev || true; else echo "npx no disponible. Asegúrate de tener Node.js instalado."; fi)
    else
      echo "  - No parece haber Prisma en $dir, saltando migraciones."
    fi
  fi
}

run_prisma_migrate "$BACKEND_DIR"

# 7) Arrancar backend en modo desarrollo
start_backend(){
  local dir="$1"
  if [ -d "$dir" ]; then
    if [ -f "$dir/package.json" ] && grep -q "dev" "$dir/package.json" 2>/dev/null; then
      echo "Iniciando backend (npm run dev) en $dir"
      (cd "$dir" && if command -v npm >/dev/null 2>&1; then npm run dev & disown; else echo "npm no disponible; inicia el backend manualmente."; fi)
    else
      echo "  - No hay script dev en $dir, intenta 'npm start' o revisa package.json."
    fi
  fi
}

start_backend "$BACKEND_DIR"

# 8) Iniciar frontend / app de escritorio
start_frontend_and_desktop(){
  local dir="$1"
  if [ -d "$dir" ]; then
    # Preferir script 'dev' en frontend
    if [ -f "$dir/package.json" ]; then
      if grep -q "dev" "$dir/package.json" 2>/dev/null; then
        echo "Iniciando frontend (npm run dev) en $dir"
        (cd "$dir" && if command -v npm >/dev/null 2>&1; then npm run dev & disown; fi)
      elif grep -q "start" "$dir/package.json" 2>/dev/null; then
        echo "Iniciando frontend (npm start) en $dir"
        (cd "$dir" && npm start & disown)
      else
        echo "  - No se encontró script dev/start en $dir."
      fi
    fi
  fi

  # Intentar lanzar la app nativa si existe un script en la raíz (npm run tauri/electron)
  if [ -f "$ROOT_DIR/package.json" ]; then
    if grep -q "tauri" "$ROOT_DIR/package.json" 2>/dev/null; then
      echo "Lanzando app Tauri (npm run tauri dev) desde raíz"
      (cd "$ROOT_DIR" && npm run tauri dev & disown)
    elif grep -q "electron" "$ROOT_DIR/package.json" 2>/dev/null || grep -q "electron" "$FRONTEND_DIR/package.json" 2>/dev/null; then
      echo "Lanzando app Electron (npm run dev / npm start)"
      if grep -q "dev" "$ROOT_DIR/package.json" 2>/dev/null; then
        (cd "$ROOT_DIR" && npm run dev & disown)
      elif [ -f "$FRONTEND_DIR/package.json" ] && grep -q "dev" "$FRONTEND_DIR/package.json" 2>/dev/null; then
        (cd "$FRONTEND_DIR" && npm run dev & disown)
      else
        # fallback: npm start
        (cd "$ROOT_DIR" && npm start & disown) || true
      fi
    else
      echo "No se detectó Tauri ni Electron en package.json; si la app es una web, usa el frontend dev arriba.";
    fi
  fi
}

start_frontend_and_desktop "$FRONTEND_DIR"

echo "\n[meta-ad-studio] Arranque completado. Verifica los logs y ajustes en .env si algo falla."
echo "- Backend: revisa $BACKEND_DIR para comandos de inicio específicos." 
echo "- Frontend: revisa $FRONTEND_DIR para comandos de inicio específicos." 

exit 0
