#!/bin/bash
echo "🛡️ Agente Guardián: Iniciando construcción de verificación..."
BUILD_LOG="build_log.txt"

# Intento 1 de construcción
cd packages/meta-verse-visualizer-main && npm run build 2> $BUILD_LOG

# Verificar si la construcción falló
if [ $? -ne 0 ]; then
    echo "🚨 ¡Construcción fallida! Analizando logs en busca de dependencias faltantes..."

    # Extraer el nombre del paquete faltante usando grep y sed
    MISSING_PACKAGE=$(grep -oP 'Failed to resolve import "\K[^"]+' $BUILD_LOG)

    if [ -n "$MISSING_PACKAGE" ]; then
        echo "📦 Dependencia faltante detectada: $MISSING_PACKAGE"
        echo "🔧 Intentando instalarla automáticamente..."

        npm install "$MISSING_PACKAGE"

        echo "🔄 Reintentando la construcción después de la instalación..."
        npm run build

        if [ $? -eq 0 ]; then
            echo "✅ ¡Éxito! La construcción se completó después de instalar la dependencia."
            echo "❗ RECUERDA: Haz 'commit' de los archivos package.json y package-lock.json actualizados."
            exit 0
        else
            echo "❌ Fallo crítico. La autoinstalación no resolvió el problema."
            exit 1
        fi
    else
        echo "❌ Fallo crítico. No se pudo identificar una dependencia faltante."
        exit 1
    fi
else
    echo "✅ Construcción exitosa en el primer intento."
    exit 0
fi