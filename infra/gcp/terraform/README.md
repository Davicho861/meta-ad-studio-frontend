Terraform GCP - Meta-Ad-Studio

Pre-requisitos
- Tener gcloud instalado y autenticado: `gcloud auth login` y `gcloud auth application-default login`
- Tener el proyecto GCP creado y el usuario con permisos para crear recursos.
- (Opcional) Crear bucket GCS para estado remoto y copiar `backend.tf.example` -> `backend.tf`.

Variables recomendadas
- Crear un archivo `terraform.tfvars` con al menos:
  project_id = "my-gcp-project"
  region = "us-central1"
  location = "us-central1"

Comandos rápidos
```bash
cd infra/gcp/terraform
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars"
```

Notas de seguridad
- No incluir secretos en `terraform.tfvars` en Git. Use Secret Manager y/o variables de entorno en CI.
- Para Cloud SQL password y otros secretos, use `google_secret_manager_secret` y recupérelos en runtime.

Workload Identity
- Una vez aplicado, anote el output `workload_identity_sa` y cree un ServiceAccount en Kubernetes con el mismo nombre
  (o use `kubectl annotate serviceaccount <name> iam.gke.io/gcp-service-account=<SA_EMAIL>`).
