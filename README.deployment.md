# Documentación de despliegue (avanzado)

Este archivo contiene la documentación técnica detallada para desplegar Meta Ad Studio manualmente o para depuración.

Contenido resumido:

- Requisitos: gcloud CLI, Terraform, cuenta con facturación habilitada.
- Comandos comunes de gcloud:

  - Configurar proyecto:
    gcloud config set project PROJECT_ID

  - Habilitar APIs necesarias:
    gcloud services enable run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com cloudbuild.googleapis.com compute.googleapis.com --project PROJECT_ID

  - Crear/actualizar secretos:
    printf "%s" "VALUE" | gcloud secrets create SECRET_NAME --data-file=- --project PROJECT_ID
    printf "%s" "VALUE" | gcloud secrets versions add SECRET_NAME --data-file=- --project PROJECT_ID

- Terraform (en directorio `terraform`):

  terraform init
  terraform plan -var="project_id=PROJECT_ID" -var="region=REGION"
  terraform apply -var="project_id=PROJECT_ID" -var="region=REGION"

- Cloud Build:

  gcloud builds submit --config cloudbuild.yaml --project PROJECT_ID

Depuración y notas:

- Si el directorio `terraform` no existe, el script `deploy.sh` saltará esa fase. Puedes ejecutar Terraform manualmente desde `terraform/`.
- Asegúrate de que tu cuenta tenga permisos suficientes (Owner o Editor y poder crear servicios, proyectos, secret manager y SQL).
- Recomendación de seguridad: Usa una cuenta de servicio con permisos limitados para producción y rota las claves regularmente.

Si necesitas personalizar variables de Terraform, edita `terraform/terraform.tfvars` o pásalas en la línea de comandos.
