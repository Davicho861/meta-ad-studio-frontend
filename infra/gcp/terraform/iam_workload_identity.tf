variable "k8s_namespace" {
  description = "Kubernetes namespace where workloads run"
  type        = string
  default     = "default"
}

variable "k8s_service_account" {
  description = "Kubernetes service account name to bind with Workload Identity"
  type        = string
  default     = "meta-ad-studio-sa"
}

# Allow the Kubernetes service account to impersonate the GCP service account via Workload Identity
resource "google_service_account_iam_binding" "workload_identity_user" {
  service_account_id = google_service_account.workload_identity_sa.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "serviceAccount:${var.project_id}.svc.id.goog[${var.k8s_namespace}/${var.k8s_service_account}]"
  ]
}
