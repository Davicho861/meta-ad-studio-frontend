#!/bin/bash
rm -f "/home/davicho/.local/share/applications/meta-ad-studio.desktop"
rm -f "/home/davicho/.local/bin/launch-meta-ad-studio.sh"
update-desktop-database "/home/davicho/.local/share/applications" 2>/dev/null || true
echo "Acceso directo desinstalado correctamente."
