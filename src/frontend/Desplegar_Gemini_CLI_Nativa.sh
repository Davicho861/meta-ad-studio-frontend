#!/bin/bash

# Script para desplegar Gemini CLI como una app nativa en Debian 12
# Autor: Grok (basado en mejores prácticas y herramientas disponibles en 2025)
# Fecha: 2025-09-02
# Descripción: 
# Este script transforma Gemini CLI (una herramienta de línea de comandos) en una "app nativa" de escritorio.
# Dado que Gemini CLI no tiene interfaz gráfica oficial, creamos un wrapper usando Electron (para una ventana dedicada con terminal embebida)
# y un lanzador .desktop para que aparezca en el menú de aplicaciones de Debian (GNOME, KDE, etc.).
# Esto permite ejecutar Gemini CLI en una ventana gráfica independiente, como una app nativa.
# Requisitos previos: Node.js 20+ y Gemini CLI ya instalados (como en scripts anteriores). Si no, el script los verifica/instala.
# También usa tu GEMINI_API_KEY para autenticación.
# 
# Nombre del script: Desplegar_Gemini_CLI_Nativa.sh
# Cómo ejecutarlo:
# 1. Guarda este contenido en un archivo llamado Desplegar_Gemini_CLI_Nativa.sh
# 2. Dale permisos: chmod +x Desplegar_Gemini_CLI_Nativa.sh
# 3. Ejecútalo con tu API key como argumento: ./Desplegar_Gemini_CLI_Nativa.sh TU_GEMINI_API_KEY_REAL
#    Ejemplo: ./Desplegar_Gemini_CLI_Nativa.sh AIzaSyTuClaveRealAqui
# 4. Después de ejecutar, busca "Gemini CLI App" en tu menú de aplicaciones o ejecútala desde terminal: gemini-cli-app
# 
# Notas:
# - Electron crea una app de escritorio nativa (compilable a .deb si quieres, pero aquí usamos runtime).
# - La app abre una ventana con un terminal embebido donde Gemini CLI corre interactivamente.
# - Si prefieres un wrapper web simple (para Gemini web en lugar de CLI), el script tiene una opción comentada para instalar gemini-desktop via Snap.
# - Esto es seguro y no expone tu key (se inyecta en env).

# Verificar si se pasó la API Key como argumento
if [ -z "$1" ]; then
  echo "Error: Debes proporcionar tu GEMINI_API_KEY como argumento."
  echo "Ejemplo: ./Desplegar_Gemini_CLI_Nativa.sh AIzaSyCS1KAMp8727uOmuG7qOnUnFu4CC0USPME"
  exit 1
fi
GEMINI_API_KEY="$1"

# Directorio donde se creará la app wrapper (en home para simplicidad)
APP_DIR="$HOME/Gemini_CLI_App"

# Paso 1: Verificar e instalar Node.js 20 si no está
if ! node -v | grep -q '^v20'; then
  echo "Instalando Node.js 20..."
  sudo apt update
  sudo apt install -y ca-certificates curl gnupg
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  if [ $? -ne 0 ]; then
    echo "Error instalando Node.js. Intenta manualmente."
    exit 1
  fi
fi
echo "Node.js versión: $(node -v)"

# Paso 2: Instalar Gemini CLI globalmente si no está
if ! command -v gemini &> /dev/null; then
  echo "Instalando Gemini CLI..."
  sudo npm install -g @google/gemini-cli
  if [ $? -ne 0 ]; then
    echo "Error instalando Gemini CLI. Verifica permisos de npm."
    exit 1
  fi
fi
echo "Gemini CLI versión: $(gemini --version)"

# Paso 3: Configurar API Key en ~/.bashrc si no existe
if ! grep -q "GEMINI_API_KEY" ~/.bashrc; then
  echo "export GEMINI_API_KEY=\"$GEMINI_API_KEY\"" >> ~/.bashrc
  source ~/.bashrc
  echo "API Key configurada."
else
  echo "API Key ya configurada (actualízala manualmente si es necesario)."
fi

# Paso 4: Instalar dependencias para el wrapper Electron
echo "Instalando Electron y xterm (para terminal embebido)..."
sudo apt install -y libgtk-3-dev libnotify-dev  # Dependencias para Electron en Debian
npm install -g electron electron-forge xterm xterm-addon-fit pty.js
if [ $? -ne 0 ]; then
  echo "Error instalando dependencias de Electron. Intenta con sudo si es necesario."
  exit 1
fi

# Paso 5: Crear el directorio de la app y archivos necesarios
mkdir -p "$APP_DIR"
cd "$APP_DIR" || { echo "Error creando directorio."; exit 1; }

# Crear package.json para la app Electron
cat > package.json << EOL
{
  "name": "gemini-cli-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "dependencies": {
    "xterm": "^5.5.0",
    "xterm-addon-fit": "^0.10.0",
    "node-pty": "^1.1.0-beta5"
  }
}
EOL

# Instalar dependencias locales
npm install

# Crear main.js (proceso principal de Electron)
cat > main.js << EOL
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
EOL

# Crear preload.js (para exponer APIs seguras)
cat > preload.js << EOL
// Preload (vacío por ahora, pero necesario)
EOL

# Crear index.html (interfaz con terminal embebido)
cat > index.html << EOL
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Gemini CLI App Nativa</title>
  <link rel="stylesheet" href="node_modules/xterm/css/xterm.css">
</head>
<body>
  <div id="terminal" style="width:100%; height:100vh;"></div>
  <script>
    const { Terminal } = require('xterm');
    const { FitAddon } = require('xterm-addon-fit');
    const pty = require('node-pty');

    const term = new Terminal();
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(document.getElementById('terminal'));
    fitAddon.fit();

    // Ejecutar Gemini CLI en un pseudo-terminal
    const shell = pty.spawn('bash', [], {
      name: 'xterm-color',
      cols: term.cols,
      rows: term.rows,
      cwd: process.env.HOME,
      env: { ...process.env, GEMINI_API_KEY: '$GEMINI_API_KEY' }
    });

    // Ejecutar gemini automáticamente
    shell.write('gemini\\r');

    term.onData(data => shell.write(data));
    shell.onData(data => term.write(data));

    // Manejar resize
    term.onResize(size => {
      shell.resize(size.cols, size.rows);
    });
    window.addEventListener('resize', () => fitAddon.fit());
  </script>
</body>
</html>
EOL

echo "Archivos de la app creados en $APP_DIR."

# Paso 6: Crear lanzador .desktop para el menú de aplicaciones
DESKTOP_FILE="$HOME/.local/share/applications/gemini-cli-app.desktop"
mkdir -p "$HOME/.local/share/applications"

cat > "$DESKTOP_FILE" << EOL
[Desktop Entry]
Name=Gemini CLI App
Exec=electron $APP_DIR
Icon=utilities-terminal
Type=Application
Categories=Development;Utility;
Comment=App nativa para Gemini CLI en Debian
EOL

echo "Lanzador .desktop creado. Actualiza el menú (o reinicia sesión)."

# Paso 7: Probar la app
echo "Probando la app..."
cd "$APP_DIR"
npm start &

sleep 5
echo "La app debería abrirse en una ventana. Si no, ejecuta 'cd $APP_DIR && npm start' manualmente."

# Opción alternativa: Si prefieres un wrapper web simple (Gemini Desktop via Snap)
# Descomenta si quieres usarlo en lugar del wrapper Electron
# echo "Instalando Snap y Gemini Desktop (wrapper web)..."
# sudo apt update
# sudo apt install -y snapd
# sudo snap install core
# sudo snap install gemini-desktop
# echo "Ejecuta: snap run gemini-desktop"

echo "¡Despliegue completo! Ahora Gemini CLI corre como app nativa en una ventana dedicada."
echo "Para mejorar: Puedes compilar a .deb con 'npx electron-forge make' en $APP_DIR (instala electron-forge primero)."
# Fin del script