#!/usr/bin/env bash
set -euo pipefail

# deploy-local.sh
# Despliegue local robusto y seguro para Meta-Ad-Studio-

readonly SCRIPT_NAME="deploy-local.sh"

#########################
# Colores
#########################
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

info() { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
err() { echo -e "${RED}[ERROR]${NC} $*"; }

#########################
# Helpers
#########################
die() {
  err "$*"
  exit 1
}

run_cmd() {
  info "+ $*"
  "$@"
}

confirm() {
  local prompt="$1"
  read -r -p "$prompt [y/N]: " resp
  case "$resp" in
    [yY]) return 0 ;;
    *) return 1 ;;
  esac
}

#########################
# Pre-flight checks
#########################
check_dependencies() {
  info "Verificando dependencias..."
  local missing=()
  for cmd in gcloud terraform jq; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
      missing+=("$cmd")
    fi
  done

  if [ ${#missing[@]} -ne 0 ]; then
    err "Faltan herramientas: ${missing[*]}"
    for m in "${missing[@]}"; do
      case "$m" in
        terraform)
          echo "  - terraform no encontrado. Instálalo: https://www.terraform.io/downloads" ;;
        gcloud)
          echo "  - gcloud no encontrado. Instálalo: https://cloud.google.com/sdk/docs/install" ;;
        jq)
          echo "  - jq no encontrado. Instálalo (ej: apt install jq o brew install jq)" ;;
        *) echo "  - $m" ;;
      esac
    done
    die "Instala las dependencias y vuelve a ejecutar." 
  fi
  success "Dependencias OK"
}

check_gcloud_auth() {
  info "Comprobando autenticación en gcloud..."
  if ! gcloud auth print-access-token >/dev/null 2>&1; then
    die "No estás autenticado en gcloud. Ejecuta: gcloud auth login"
  fi
  success "Autenticación gcloud detectada"
}

check_gcloud_project() {
  info "Verificando proyecto GCP activo..."
  local project
  project=$(gcloud config get-value project 2>/dev/null || true)
  if [ -z "${project}" ] || [ "${project}" = "unset" ]; then
    die "No hay proyecto GCP configurado. Configúralo con: gcloud config set project [PROJECT_ID]"
  fi
  success "Proyecto activo: ${project}"
}

#########################
# Entrada de usuario
#########################
get_user_input() {
  info "Recopilando información del despliegue..."

  read -r -p "Región (por defecto us-central1): " REGION
  REGION=${REGION:-us-central1}

  read -r -p "Cluster/entorno (ej: dev, staging, prod) [dev]: " ENVIRONMENT
  ENVIRONMENT=${ENVIRONMENT:-dev}

  read -r -p "ID del proyecto GCP (dejar vacío para usar la configuración actual): " USER_PROJECT
  if [ -n "${USER_PROJECT}" ]; then
    PROJECT_ID="${USER_PROJECT}"
  else
    PROJECT_ID=$(gcloud config get-value project)
  fi

  # Secretos sensibles
  echo "Se solicitarán secretos de forma segura (no se mostrarán)."
  read -r -s -p "API Key de Gemini (si aplica, dejar vacío para saltar): " GEMINI_API_KEY
  echo
  read -r -s -p "Contraseña de la base de datos (si aplica, dejar vacío para saltar): " DB_PASSWORD
  echo

  # Resumen
  echo
  info "Resumen del despliegue por confirmar"
  echo "  Proyecto: ${PROJECT_ID}"
  echo "  Región: ${REGION}"
  echo "  Entorno: ${ENVIRONMENT}"
  if [ -n "${GEMINI_API_KEY}" ]; then
    echo "  Gemini API Key: (proporcionada)";
  else
    echo "  Gemini API Key: (no proporcionada)";
  fi
  if [ -n "${DB_PASSWORD}" ]; then
    echo "  DB Password: (proporcionada)";
  else
    echo "  DB Password: (no proporcionada)";
  fi

  if ! confirm "¿Estás seguro de que deseas continuar?"; then
    die "Cancelado por el usuario."
  fi
}

#########################
# Secret Manager helpers
#########################
secret_exists() {
  local name="$1"
  if gcloud secrets describe "$name" --project="$PROJECT_ID" >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

create_or_update_secret() {
  local name="$1"
  local value="$2"
  if secret_exists "$name"; then
    warn "El secreto '$name' ya existe. Se creará una nueva versión." 
    if confirm "¿Deseas crear una nueva versión de '$name'?"; then
      echo -n "$value" | gcloud secrets versions add "$name" --data-file=- --project="$PROJECT_ID"
      success "Nueva versión añadida a '$name'"
    else
      warn "Omitiendo la actualización de '$name'"
    fi
  else
    echo -n "$value" | gcloud secrets create "$name" --data-file=- --replication-policy="automatic" --project="$PROJECT_ID"
    success "Se creó el secreto '$name'"
  fi
}

#########################
# Deploy (placeholder seguro)
#########################
deploy_infrastructure() {
  info "Iniciando despliegue de infraestructura (modo seguro)..."

  if [ -d "terraform" ] || [ -f "terraform.tfstate" ]; then
    info "Directorio Terraform detectado. Ejecutando plan y apply interactivo."
    pushd terraform >/dev/null
    run_cmd terraform init -input=false
    run_cmd terraform plan -out=plan.tfplan -input=false -var="project_id=${PROJECT_ID}" -var="region=${REGION}" -var="environment=${ENVIRONMENT}"
    warn "Se ha creado un plan de terraform. Revisa antes de aplicar."
    if confirm "¿Aplicar plan de terraform ahora?"; then
      run_cmd terraform apply -input=false plan.tfplan
      success "Terraform apply completado"
    else
      warn "Saltando terraform apply. Puedes aplicar manualmente 'terraform apply plan.tfplan' más tarde." 
    fi
    popd >/dev/null
  else
    warn "No se encontró configuración de Terraform. Saltando etapa de infraestructura." 
  fi
}

post_deploy() {
  info "Extrayendo outputs finales..."
  if [ -d "terraform" ]; then
    pushd terraform >/dev/null
    if terraform output -json >/dev/null 2>&1; then
      terraform output -json | jq '. | to_entries[] | "- "+.key+": "+(.value|tostring)'
    else
      warn "No hay outputs disponibles o terraform no se ha aplicado." 
    fi
    popd >/dev/null
  fi
  success "Despliegue (flujo local) finalizado. Revisa los mensajes anteriores para URLs y credenciales." 
}

#########################
# Flags y entrada
#########################
DRY_RUN=false
while [ "$#" -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    -h|--help)
      cat <<EOF
Uso: ${SCRIPT_NAME} [--dry-run] [-h|--help]

Opciones:
  --dry-run    Realiza comprobaciones y muestra lo que pasaría sin hacer cambios.
  -h, --help   Muestra esta ayuda.
EOF
      exit 0 ;;
    *)
      err "Argumento desconocido: $1"
      exit 2 ;;
  esac
done

main() {
  check_dependencies
  check_gcloud_auth
  check_gcloud_project
  get_user_input

  if [ "${DRY_RUN}" = true ]; then
    info "Modo dry-run activado: no se crearán secretos ni se aplicará Terraform." 
    success "Dry-run finalizado correctamente."
    exit 0
  fi

  # Manejo de secretos idempotente
  if [ -n "${GEMINI_API_KEY}" ]; then
    create_or_update_secret "gemini_api_key_${ENVIRONMENT}" "${GEMINI_API_KEY}"
  fi
  if [ -n "${DB_PASSWORD}" ]; then
    create_or_update_secret "db_password_${ENVIRONMENT}" "${DB_PASSWORD}"
  fi

  deploy_infrastructure
  post_deploy
}

main
