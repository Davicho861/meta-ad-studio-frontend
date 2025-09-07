resource "google_container_cluster" "autopilot_cluster" {
  name     = var.cluster_name
  location = var.location

  # Enable Autopilot mode (provider expects attribute)
  enable_autopilot = true

  networking_mode = "VPC_NATIVE"

  # Enable Workload Identity
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # basic addons and logging/monitoring enabled
  logging_service    = "logging.googleapis.com/kubernetes"
  monitoring_service = "monitoring.googleapis.com/kubernetes"

  # Note: Autopilot manages node pools; do not set remove_default_node_pool or initial_node_count here
}

