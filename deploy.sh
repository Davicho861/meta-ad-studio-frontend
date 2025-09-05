#!/usr/bin/env bash
# deploy.sh - Script interactivo para desplegar Meta Ad Studio en Google Cloud
set -euo pipefail

echo
echo "======================================"
echo "  Meta Ad Studio — Despliegue Rápido"
echo "======================================"
echo

read -p "ID de tu proyecto de Google Cloud (PROJECT_ID): " PROJECT_ID
read -p "Región de GCP para desplegar (por ejemplo: us-central1): " GCP_REGION
read -p "Introduce tu API key de Gemini (se guardará en Secret Manager): " GEMINI_KEY
read -s -p "Contraseña para la base de datos (se guardará en Secret Manager): " DB_PASSWORD
echo
read -p "¿Deseas continuar y aplicar cambios en tu proyecto ${PROJECT_ID}? [y/N]: " CONFIRM
if [[ "${CONFIRM,,}" != "y" ]]; then
  echo "Abortando. No se realizaron cambios."
  exit 1
fi

echo "Configurando gcloud para el proyecto ${PROJECT_ID}..."
gcloud config set project "${PROJECT_ID}"

echo "Habilitando APIs necesarias..."
gcloud services enable run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com cloudbuild.googleapis.com compute.googleapis.com --project "${PROJECT_ID}"

echo "Creando secretos en Secret Manager..."
printf "%s" "${GEMINI_KEY}" | gcloud secrets create gemini-api-key --data-file=- --project "${PROJECT_ID}" || \
  (echo "El secreto 'gemini-api-key' ya existe. Actualizando versión..." && printf "%s" "${GEMINI_KEY}" | gcloud secrets versions add gemini-api-key --data-file=- --project "${PROJECT_ID}")

printf "%s" "${DB_PASSWORD}" | gcloud secrets create meta-db-password --data-file=- --project "${PROJECT_ID}" || \
  (echo "El secreto 'meta-db-password' ya existe. Actualizando versión..." && printf "%s" "${DB_PASSWORD}" | gcloud secrets versions add meta-db-password --data-file=- --project "${PROJECT_ID}")

echo "Iniciando Terraform (si hay un directorio terraform en el repo)..."
if [ -d "terraform" ]; then
  pushd terraform > /dev/null
  terraform init
  echo "Aplicando Terraform (auto-approve)..."
  terraform apply -auto-approve -var="project_id=${PROJECT_ID}" -var="region=${GCP_REGION}"
  echo "Exportando outputs de Terraform..."
  terraform output || true
  popd > /dev/null
else
  echo "No se encontró el directorio 'terraform'. Salteando paso de Terraform."
fi

echo "Subiendo el código y disparando Cloud Build..."
gcloud builds submit --config cloudbuild.yaml --project "${PROJECT_ID}"

echo
echo "=========================="
echo "Despliegue completado (parcial)"
echo "Revisa los outputs de Terraform y Cloud Build para las URLs finales."
echo "Si Terraform mostró outputs, se listaron arriba."
echo "¡Felicidades! Meta Ad Studio debería estar desplegado en tu proyecto."
echo "=========================="

echo "Sugerencia: Ejecuta 'gcloud run services list --platform managed --project ${PROJECT_ID}' para ver servicios desplegados."

exit 0
