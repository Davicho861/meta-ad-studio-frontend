output "cluster_name" {
  description = "GKE cluster name"
  value       = google_container_cluster.autopilot_cluster.name
}

output "artifact_registry" {
  description = "Artifact Registry repository id"
  value       = google_artifact_registry_repository.docker_repo.id
}

output "db_connection_name" {
  description = "Cloud SQL instance connection name"
  value       = google_sql_database_instance.postgres_instance.connection_name
}

output "workload_identity_sa" {
  value = google_service_account.workload_identity_sa.email
}
