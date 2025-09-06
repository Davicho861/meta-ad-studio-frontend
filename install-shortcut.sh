#!/usr/bin/env bash
set -euo pipefail
echo "Instalando el lanzador de Meta-Ad Studio..."
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Ensure the orchestrator is executable
chmod +x "$SCRIPT_DIR/meta-studio.sh" || true
echo "✓ Permisos del orquestador asegurados."

# Create the applications directory
mkdir -p "$HOME/.local/share/applications"

# Copy the desktop file
if [[ -f "$SCRIPT_DIR/desktop/meta-studio.desktop" ]]; then
  cp "$SCRIPT_DIR/desktop/meta-studio.desktop" "$HOME/.local/share/applications/"
  echo "✓ Acceso directo copiado a ~/.local/share/applications/"
else
  echo "ERROR: desktop/meta-studio.desktop no encontrado en el repo."
  exit 1
fi

# Update desktop database if available
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database "$HOME/.local/share/applications/" || true
    echo "✓ Base de datos de aplicaciones actualizada."
fi

echo -e "\n¡Instalación completa! Busca 'Meta-Ad Studio (Dev Env)' en tu menú de aplicaciones."
