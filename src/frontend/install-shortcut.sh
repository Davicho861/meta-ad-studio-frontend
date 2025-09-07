# Generating a .desktop file with absolute path and cleaning up desktop/meta-studio.desktop to avoid immediate closures

#!/usr/bin/env bash
#!/usr/bin/env bash
set -euo pipefail
echo "Instalando el lanzador de Meta-Ad Studio..."
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Ensure the orchestrator is executable
chmod +x "$SCRIPT_DIR/meta-studio.sh" || true
echo "✓ Permisos del orquestador asegurados."

# Create the applications directory
mkdir -p "$HOME/.local/share/applications"

DESKTOP_PATH="$HOME/.local/share/applications/meta-studio.desktop"
cat > "$DESKTOP_PATH" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Meta-Ad Studio (Dev Env)
Comment=Lanza y gestiona el entorno de desarrollo de Meta-Ad Studio
Exec=gnome-terminal -- /bin/bash -ic "$SCRIPT_DIR/meta-studio.sh; exec bash"
Icon=utilities-terminal
Terminal=false
Categories=Development;
StartupNotify=true
EOF

echo "✓ Acceso directo creado en $DESKTOP_PATH"

# Update desktop database if available
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database "$HOME/.local/share/applications/" || true
    echo "✓ Base de datos de aplicaciones actualizada."
fi

echo -e "\n¡Instalación completa! Busca 'Meta-Ad Studio (Dev Env)' en tu menú de aplicaciones."
