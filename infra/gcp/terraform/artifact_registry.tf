resource "google_artifact_registry_repository" "docker_repo" {
  provider = google
  project  = var.project_id
  location = var.location
  repository_id = var.artifact_registry_name

  format = "DOCKER"
  description = "Docker images for Meta-Ad-Studio"
}

output "artifact_registry_repo" {
  value = google_artifact_registry_repository.docker_repo.id
}
