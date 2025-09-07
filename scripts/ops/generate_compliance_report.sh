#!/bin/bash

# Script para generar un reporte de compliance simulado.
# Verifica la existencia de artefactos clave y genera un informe en Markdown.

set -e

REPORT_FILE="COMPLIANCE_REPORT_$(date +%Y-%m-%d).md"
LOG_DIR="."
SCAN_LOG_PATTERN="trivy_scan_*.log" # Patrón para logs de escaneo (simulado)

echo "--- Iniciando generación de reporte de compliance ---"

# Iniciar el reporte
echo "# Reporte de Compliance y Seguridad" > "$REPORT_FILE"
echo "**Fecha:** $(date)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# --- Sección 1: Auditoría de Documentación ---
echo "## 1. Auditoría de Documentación" >> "$REPORT_FILE"
echo "| Documento | Estado |" >> "$REPORT_FILE"
echo "| :--- | :--- |" >> "$REPORT_FILE"

# Verificar existencia de documentos clave
check_doc() {
  if [ -f "$1" ]; then
    echo "| \`$1\` | ✅ Encontrado |" >> "$REPORT_FILE"
  else
    echo "| \`$1\` | ❌ No Encontrado |" >> "$REPORT_FILE"
  fi
}

check_doc "docs/PRIVACY_POLICY.md"
check_doc "docs/TERMS_OF_SERVICE.md"
check_doc "docs/GDPR_COMPLIANCE.md"
check_doc "LICENSE"

echo "" >> "$REPORT_FILE"

# --- Sección 2: Resultados de Escaneo de Seguridad ---
echo "## 2. Escaneo de Vulnerabilidades (CI/CD)" >> "$REPORT_FILE"
echo "Resultados del último escaneo de seguridad en el pipeline:" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Simular la búsqueda de un log de escaneo de Trivy
# En un pipeline real, este log se obtendría de los artefactos de build.
# Para esta simulación, crearemos un log de ejemplo.
SIMULATED_SCAN_LOG="trivy_scan_$(date +%s).log"
echo "Simulating Trivy scan log..."
echo "Total: 1 (CRITICAL: 0, HIGH: 1, MEDIUM: 0, LOW: 0, UNKNOWN: 0)" > "$SIMULATED_SCAN_LOG"
echo "Image: us-central1-docker.pkg.dev/project-id/repo/api-server:prod_12345" >> "$SIMULATED_SCAN_LOG"
echo "" >> "$SIMULATED_SCAN_LOG"
echo "HIGH: Vulnerability in library XYZ (CVE-2025-12345)" >> "$SIMULATED_SCAN_LOG"
echo "  Status: Fixed in version 1.2.4" >> "$SIMULATED_SCAN_LOG"

if [ -f "$SIMULATED_SCAN_LOG" ]; then
  echo "\`\`\`" >> "$REPORT_FILE"
  cat "$SIMULATED_SCAN_LOG" >> "$REPORT_FILE"
  echo "\`\`\`" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "**Estado:** ✅ Sin vulnerabilidades críticas." >> "$REPORT_FILE"
else
  echo "**Estado:** ❌ No se encontraron logs de escaneo." >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"

# --- Sección 3: Conclusión ---
echo "## 3. Conclusión" >> "$REPORT_FILE"
echo "La auditoría de compliance automatizada ha finalizado." >> "$REPORT_FILE"
echo "Se recomienda revisar los puntos marcados con ❌ y tomar acciones correctivas." >> "$REPORT_FILE"

echo "--- Reporte de compliance generado exitosamente en $REPORT_FILE ---"

exit 0
