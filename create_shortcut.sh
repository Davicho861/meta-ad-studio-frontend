#!/bin/bash

# Script de instalación para acceso directo de Meta-Ad-Studio
# Generado automáticamente por Kilo Code

set -e  # Salir en caso de error

# Rutas absolutas
PROJECT_DIR="/home/davicho/Davicho861/Meta-Ad-Studio-"
HOME_DIR="/home/davicho"
LOCAL_BIN_DIR="$HOME_DIR/.local/bin"
LOCAL_APPS_DIR="$HOME_DIR/.local/share/applications"

# Crear directorios si no existen
mkdir -p "$LOCAL_BIN_DIR"
mkdir -p "$LOCAL_APPS_DIR"

# Función para detectar terminal disponible
detect_terminal() {
    if command -v gnome-terminal >/dev/null 2>&1; then
        echo "gnome-terminal"
    elif command -v xfce4-terminal >/dev/null 2>&1; then
        echo "xfce4-terminal"
    elif command -v konsole >/dev/null 2>&1; then
        echo "konsole"
    elif command -v xterm >/dev/null 2>&1; then
        echo "xterm"
    else
        echo "x-terminal-emulator"
    fi
}

TERMINAL_CMD=$(detect_terminal)

# Buscar icono en el proyecto
find_icon() {
    # Priorizar .svg
    ICON=$(find "$PROJECT_DIR" -type f \( -name "*.svg" \) | head -n 1)
    if [ -z "$ICON" ]; then
        # Luego .png
        ICON=$(find "$PROJECT_DIR" -type f \( -name "*.png" \) | head -n 1)
    fi
    if [ -z "$ICON" ]; then
        # Icono genérico
        ICON="utilities-terminal"
    fi
    echo "$ICON"
}

ICON_PATH=$(find_icon)

# Crear script de lanzamiento
LAUNCH_SCRIPT="$LOCAL_BIN_DIR/launch-meta-ad-studio.sh"
cat > "$LAUNCH_SCRIPT" << EOF
#!/bin/bash
cd "$PROJECT_DIR"
$TERMINAL_CMD -- bash -c "make dev; exec bash"
EOF

chmod +x "$LAUNCH_SCRIPT"

# Crear archivo .desktop
DESKTOP_FILE="$LOCAL_APPS_DIR/meta-ad-studio.desktop"
cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Name=Meta-Ad Studio (Dev)
Comment=Lanzar el entorno de desarrollo de Meta-Ad Studio
Exec=$LAUNCH_SCRIPT
Icon=$ICON_PATH
Terminal=false
Type=Application
Categories=Development;IDE;
EOF

# Actualizar base de datos de aplicaciones
update-desktop-database "$LOCAL_APPS_DIR" 2>/dev/null || true

# Crear script de desinstalación
UNINSTALL_SCRIPT="$PROJECT_DIR/uninstall_shortcut.sh"
cat > "$UNINSTALL_SCRIPT" << EOF
#!/bin/bash
rm -f "$DESKTOP_FILE"
rm -f "$LAUNCH_SCRIPT"
update-desktop-database "$LOCAL_APPS_DIR" 2>/dev/null || true
echo "Acceso directo desinstalado correctamente."
EOF

chmod +x "$UNINSTALL_SCRIPT"

# Reporte final
echo "Instalación completada exitosamente."
echo "Acceso directo creado: Meta-Ad Studio (Dev)"
echo "Script de lanzamiento: $LAUNCH_SCRIPT"
echo "Archivo .desktop: $DESKTOP_FILE"
echo "Script de desinstalación: $UNINSTALL_SCRIPT"
echo "Icono utilizado: $ICON_PATH"
echo "Terminal detectado: $TERMINAL_CMD"
echo ""
echo "Para desinstalar, ejecuta: $UNINSTALL_SCRIPT"
