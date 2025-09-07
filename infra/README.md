Meta-Ad-Studio - Infra Setup & Deploy

Resumen
Este documento resume los pasos para provisionar infraestructura en GCP y desplegar la aplicación Meta-Ad-Studio en GKE.

1) Preparar variables
- Crear `infra/gcp/terraform/terraform.tfvars` o `terraform.tfvars` con:
  project_id = "your-gcp-project"
  region = "us-central1"
  location = "us-central1"
  cluster_name = "meta-ad-studio-cluster"
  artifact_registry_name = "meta-ad-studio-repo"

2) Inicializar y aplicar Terraform (infra/gcp/terraform)
```bash
cd infra/gcp/terraform
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars"
```

Lo que creará (resumen):
- GKE Autopilot cluster con Workload Identity habilitado
- Cloud SQL (Postgres) instancia regional con backups
- Artifact Registry (repositorio DOCKER)
- Service Account para Workload Identity
- Secret Manager entry (ejemplo)
- Log-based metric y alert policy (ejemplo)

3) Configurar GitHub Secrets
- `GCP_SA_KEY` -> JSON de la Service Account con permisos para crear resources y desplegar (contenido del key)
- `GCP_PROJECT_ID` -> tu project id
- `GCP_REGION` -> ejemplo: us-central1
- `GKE_CLUSTER_NAME` -> nombre del cluster creado por Terraform (output)
- `GCP_ZONE` -> zona del cluster si aplica
- `ARTIFACT_REGISTRY_REPO` -> nombre del repo en Artifact Registry

4) CI/CD
- PR checks: `.github/workflows/ci.yml` ejecuta tests y build.
- Deploy: `.github/workflows/deploy.yml` build/push imágenes a Artifact Registry y despliega a GKE.

5) Despliegue K8s manual (post Terraform)
- Obtener credenciales del cluster y aplicar manifests:
```bash
gcloud container clusters get-credentials <cluster-name> --zone <zone> --project <project>
kubectl apply -k infra/k8s/base
```

6) Notas de seguridad y secretos en runtime
- Usa Secret Manager para DB passwords y keys. Monta secretos como variables de entorno usando CSI driver o inyecta valores en las variables de entorno desde init containers.
- No subas secretos a Git.

Checklist final antes de cortar a producción
- [ ] Terraform applied without errors
- [ ] Secrets configured in GitHub Actions
- [ ] Artifact Registry images pushed successfully
- [ ] K8s manifests applied and pods READY
- [ ] Monitoring alerts configured and tested
- [ ] TLS certificate provisioned (GKE managed certificate or external)
