#!/bin/bash

# Script para integrar Gemini CLI en VS Code en Debian 12
# Autor: Grok (basado en instrucciones previas)
# Fecha: 2025-09-02
# Este script hace lo siguiente:
# 1. Verifica e instala Node.js 20 si no está.
# 2. Instala Gemini CLI globalmente.
# 3. Configura la API Key de Gemini (debes proporcionar la tuya).
# 4. Instala Visual Studio Code si no está instalado.
# 5. Configura el proyecto en VS Code con tasks para Gemini CLI.
# 6. Abre el proyecto en VS Code y ejecuta un task inicial para verificar.
# Uso: chmod +x Integracion_Gemini_CLI.sh && ./Integracion_Gemini_CLI.sh TU_API_KEY

# Verificar si se pasó la API Key como argumento
if [ -z "$1" ]; then
  echo "Error: Debes proporcionar tu GEMINI_API_KEY como argumento."
  echo "Ejemplo: ./Integracion_Gemini_CLI.sh AIzaSyCS1KAMp8727uOmuG7qOnUnFu4CC0USPME"
  exit 1
fi
GEMINI_API_KEY="$1"

# Directorio del proyecto
PROJECT_DIR="$HOME/Documentos/Meta Studio Ad Studio App SPA"

# Paso 1: Instalar Node.js 20 si no está
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

# Paso 2: Instalar Gemini CLI globalmente
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

# Paso 4: Instalar Visual Studio Code si no está
if ! command -v code &> /dev/null; then
  echo "Instalando VS Code..."
  sudo apt update
  sudo apt install -y software-properties-common apt-transport-https wget
  wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
  sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
  sudo apt update
  sudo apt install -y code
  if [ $? -ne 0 ]; then
    echo "Error instalando VS Code. Descárgalo manualmente desde https://code.visualstudio.com/"
    exit 1
  fi
fi
echo "VS Code instalado."

# Paso 5: Configurar el proyecto en VS Code
cd "$PROJECT_DIR" || { echo "Error: Directorio del proyecto no encontrado."; exit 1; }

# Crear carpeta .vscode si no existe
mkdir -p .vscode

# Crear tasks.json para integrar Gemini CLI
cat > .vscode/tasks.json << EOL
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Gemini: Modo Interactivo",
      "type": "shell",
      "command": "gemini",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Gemini: Analizar Código",
      "type": "shell",
      "command": "gemini -p 'Analiza el codebase y sugiere mejoras para escalabilidad y seguridad'",
      "group": "test",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Gemini: Resumir Cambios Git",
      "type": "shell",
      "command": "gemini -p 'Resume los cambios recientes basados en git log y sugiere optimizaciones'",
      "group": "test",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Gemini: Mejorar Archivo Específico",
      "type": "shell",
      "command": "gemini -p 'Mejora este archivo: \${input:filePath}'",
      "group": "test",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "filePath",
      "type": "promptString",
      "description": "Ruta del archivo a mejorar (ej: src/main.js)"
    }
  ]
}
EOL
echo "tasks.json creado para Gemini CLI."

# Crear settings.json para entorno (opcional, para terminal integrado)
cat > .vscode/settings.json << EOL
{
  "terminal.integrated.env.linux": {
    "GEMINI_API_KEY": "$GEMINI_API_KEY"
  },
  "editor.formatOnSave": true,
  "files.autoSave": "afterDelay"
}
EOL
echo "settings.json creado."

# Instalar extensiones recomendadas en VS Code (via comando)
echo "Instalando extensiones útiles para VS Code..."
code --install-extension ms-vscode.vscode-typescript-tslint-plugin  # Para TypeScript/JS
code --install-extension ms-azuretools.vscode-docker  # Para Docker
code --install-extension ms-kubernetes-tools.vscode-kubernetes-tools  # Para Kubernetes
code --install-extension googlecloudtools.cloudcode  # Para GCP y AI (incluye soporte Vertex AI/Gemini)
code --install-extension ritwickdey.LiveServer  # Para SPA testing
code --install-extension esbenp.prettier-vscode  # Para formatting
echo "Extensiones instaladas. Reinicia VS Code si es necesario."

# Paso 6: Abrir el proyecto en VS Code y ejecutar un task de verificación
echo "Abriendo proyecto en VS Code..."
code .

# Esperar un poco para que VS Code se abra
sleep 5

# Ejecutar un task inicial (necesita intervención manual, pero puedes correrlo con Ctrl+Shift+P > Tasks: Run Task)
echo "Para ejecutar tasks: En VS Code, presiona Ctrl+Shift+P, busca 'Tasks: Run Task' y selecciona uno de Gemini."
echo "Por ejemplo, 'Gemini: Modo Interactivo' para abrir la CLI en el terminal integrado."
echo "¡Integración completa! Ahora puedes mejorar tu sistema de forma ágil desde VS Code."

# Fin del script