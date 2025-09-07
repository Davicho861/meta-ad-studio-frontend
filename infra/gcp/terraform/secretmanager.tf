resource "google_secret_manager_secret" "db_password" {
  project   = var.project_id
  secret_id = "meta-ad-studio-db-password"

  replication {
  automatic = true
  }
}

# Grant the workload identity service account access to read the secret
resource "google_secret_manager_secret_iam_member" "db_password_access" {
  secret_id = google_secret_manager_secret.db_password.id
  project   = var.project_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.workload_identity_sa.email}"
}

# IMPORTANT: Do NOT create secret versions containing plaintext secrets in the repository.
# Terraform can create the secret (the container for versions), but adding secret data (versions)
# should be done outside of IaC using gcloud, the GCP console, or a CI job that reads encrypted
# values from the CI secret store and uses `gcloud secrets versions add`.
# Example (manual or CI):
# gcloud secrets create meta-ad-studio-db-password --project=${PROJECT_ID} --replication-policy="automatic"
# gcloud secrets versions add meta-ad-studio-db-password --data-file=<(echo -n "${DB_PASSWORD}")

