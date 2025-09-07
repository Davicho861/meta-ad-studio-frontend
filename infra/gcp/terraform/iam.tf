resource "google_service_account" "workload_identity_sa" {
  account_id   = var.service_account_name
  display_name = "Workload Identity service account for Meta-Ad-Studio"
  project      = var.project_id
}

# Grant minimal roles to the service account. Adjust as needed.
resource "google_project_iam_member" "sa_artifact_registry_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.workload_identity_sa.email}"
}

resource "google_project_iam_member" "sa_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.workload_identity_sa.email}"
}

resource "google_project_iam_member" "sa_cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.workload_identity_sa.email}"
}

output "workload_identity_sa_email" {
  value = google_service_account.workload_identity_sa.email
}
