#!/usr/bin/env bash
set -euo pipefail

# setup_dev_shortcut.sh
# Limpia lanzadores antiguos y crea un único lanzador "Meta-Ad Studio (Dev)"

PROJECT_DIR="/home/davicho/Davicho861/Meta-Ad-Studio-"
LAUNCHER_NAME="meta-ad-studio-dev.desktop"
LAUNCH_SCRIPT="$HOME/.local/bin/launch-meta-ad-studio-hot-reload.sh"
DESKTOP_USER_DIR="$HOME/.local/share/applications"
SYSTEM_DESKTOP_DIR="/usr/share/applications"
FRONTEND_URL="http://localhost:8082"

echo "Iniciando setup_dev_shortcut.sh"

# --- Fase 1: Limpieza total ---
echo "Buscando archivos .desktop relacionados..."
mapfile -t DESKTOP_FILES_USER < <(find "$DESKTOP_USER_DIR" -maxdepth 1 -type f -iname "*meta-ad-studio*" 2>/dev/null || true)
mapfile -t DESKTOP_FILES_SYSTEM < <(find "$SYSTEM_DESKTOP_DIR" -maxdepth 1 -type f -iname "*meta-ad-studio*" 2>/dev/null || true)

if [ ${#DESKTOP_FILES_USER[@]} -eq 0 ] && [ ${#DESKTOP_FILES_SYSTEM[@]} -eq 0 ]; then
  echo "No se encontraron .desktop existentes con 'meta-ad-studio' en el nombre."
else
  echo "Se encontraron los siguientes archivos .desktop de usuario:"
  for f in "${DESKTOP_FILES_USER[@]}"; do echo "  $f"; done
  echo "Se encontraron los siguientes archivos .desktop del sistema:"
  for f in "${DESKTOP_FILES_SYSTEM[@]}"; do echo "  $f"; done

  # Eliminar archivos de usuario
  for f in "${DESKTOP_FILES_USER[@]}"; do
    echo "Eliminando $f"
    rm -f "$f" || true
  done

  # Eliminar archivos del sistema con sudo
  if [ ${#DESKTOP_FILES_SYSTEM[@]} -gt 0 ]; then
    echo "Se necesita privilegio sudo para eliminar lanzadores del sistema. Se solicitará contraseña si procede."
    for f in "${DESKTOP_FILES_SYSTEM[@]}"; do
      echo "Eliminando $f con sudo"
      sudo rm -f "$f" || true
    done
  fi
fi

# Eliminar scripts de lanzamiento antiguos en ~/.local/bin que contengan 'meta-ad-studio'
echo "Buscando scripts antiguos en ~/.local/bin que contengan 'meta-ad-studio'..."
mapfile -t OLD_SCRIPTS < <(find "$HOME/.local/bin" -maxdepth 1 -type f -iname "*meta-ad-studio*" 2>/dev/null || true)
if [ ${#OLD_SCRIPTS[@]} -eq 0 ]; then
  echo "No se encontraron scripts de lanzamiento antiguos."
else
  for s in "${OLD_SCRIPTS[@]}"; do
    echo "Eliminando script $s"
    rm -f "$s" || true
  done
fi

# Actualizar base de datos de lanzadores de usuario
echo "Actualizando la base de datos de aplicaciones de usuario..."
update-desktop-database "$DESKTOP_USER_DIR" 2>/dev/null || true

# --- Fase 2: Crear acceso directo definitivo ---
# Asegurar directorios
mkdir -p "$HOME/.local/bin"
mkdir -p "$DESKTOP_USER_DIR"

# Buscar icono dentro del proyecto (priorizar .svg luego .png)
ICON_PATH=""
if [ -d "$PROJECT_DIR" ]; then
  ICON_PATH=$(find "$PROJECT_DIR" -type f -iname "*.svg" 2>/dev/null | head -n 1 || true)
  if [ -z "$ICON_PATH" ]; then
    ICON_PATH=$(find "$PROJECT_DIR" -type f -iname "*.png" 2>/dev/null | head -n 1 || true)
  fi
fi

if [ -z "$ICON_PATH" ]; then
  # usar icono genérico del sistema
  ICON_PATH="applications-development"
  echo "No se encontró icono en el proyecto. Se usará icono genérico: $ICON_PATH"
else
  echo "Icono encontrado: $ICON_PATH"
fi

# Crear script de lanzamiento inteligente
cat > "$LAUNCH_SCRIPT" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/home/davicho/Davicho861/Meta-Ad-Studio-"
FRONTEND_URL="http://localhost:5173"

cd "$PROJECT_DIR"

# Abrir una terminal que ejecute 'make dev' (no bloqueante)
if command -v gnome-terminal >/dev/null 2>&1; then
  gnome-terminal -- bash -c "echo 'Lanzando Meta-Ad-Studio en modo Hot-Reload...'; make dev; exec bash" &
elif command -v x-terminal-emulator >/dev/null 2>&1; then
  x-terminal-emulator -e bash -c "echo 'Lanzando Meta-Ad-Studio en modo Hot-Reload...'; make dev; exec bash" &
else
  echo "No se encontró un emulador de terminal gráfico (gnome-terminal). Ejecutando make dev en background..."
  nohup make dev >/dev/null 2>&1 &
fi

# Esperar a que el servidor frontend responda (timeout 60s)
echo "Esperando a que el servidor frontend responda en $FRONTEND_URL ..."
TIMEOUT=60
SLEEP_INTERVAL=1
ELAPSED=0
while ! curl -sSf "$FRONTEND_URL" >/dev/null 2>&1; do
  sleep $SLEEP_INTERVAL
  ELAPSED=$((ELAPSED + SLEEP_INTERVAL))
  if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
    echo "Timeout esperando a que $FRONTEND_URL responda (esperado < $TIMEOUT s). Abriendo de todas formas."
    break
  fi
done

# Abrir la URL en el navegador predeterminado
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$FRONTEND_URL" >/dev/null 2>&1 || true
else
  echo "xdg-open no disponible. Por favor abra $FRONTEND_URL manualmente."
fi
EOF

chmod +x "$LAUNCH_SCRIPT"

# Crear archivo .desktop
DESKTOP_FILE_PATH="$DESKTOP_USER_DIR/$LAUNCHER_NAME"
cat > "$DESKTOP_FILE_PATH" <<EOF
[Desktop Entry]
Version=1.0
Name=Meta-Ad Studio (Dev)
Comment=Entorno de desarrollo con Hot Reload para Meta-Ad Studio
Exec=$LAUNCH_SCRIPT
Icon=$ICON_PATH
Terminal=false
Type=Application
Categories=Development;IDE;Network;
StartupNotify=true
EOF

chmod 644 "$DESKTOP_FILE_PATH"

# Actualizar base de datos nuevamente
update-desktop-database "$DESKTOP_USER_DIR" 2>/dev/null || true

# Mensaje final
echo "¡Éxito! El acceso directo 'Meta-Ad Studio (Dev)' ha sido creado en: $DESKTOP_FILE_PATH"

# Lanzar el lanzador una vez para iniciar la pila (opcionalmente)
read -p "¿Desea iniciar ahora la pila de desarrollo y abrir el navegador? [y/N]: " RESP || RESP=N
RESP=${RESP:-N}
if [[ "$RESP" =~ ^[Yy]$ ]]; then
  echo "Ejecutando el script de lanzamiento..."
  "$LAUNCH_SCRIPT" >/dev/null 2>&1 &
  echo "Script de lanzamiento disparado en background. Revise la terminal que se abrió para logs."
else
  echo "No se inició la pila. Puede iniciarla desde el acceso directo en el menú de aplicaciones."
fi

exit 0
