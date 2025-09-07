terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.50.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

variable "gcp_project_id" {
  description = "The GCP project ID."
  type        = string
  default     = "your-gcp-project-id" # Placeholder - El agente autónomo reemplazará esto con el valor real si está disponible en el entorno.
}

variable "gcp_region" {
  description = "The GCP region for resources."
  type        = string
  default     = "us-central1"
}

variable "db_password" {
  description = "The password for the Cloud SQL database."
  type        = string
  sensitive   = true
  # No default value: require provisioning via terraform vars or Secret Manager
}

variable "db_user" {
  description = "The username for the Cloud SQL database."
  type        = string
  default     = "ad_studio_user"
}

# --- Redes ---
resource "google_compute_network" "vpc_network" {
  name                    = "staging-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "gke_subnet" {
  name          = "gke-subnet"
  ip_cidr_range = "10.10.10.0/24"
  network       = google_compute_network.vpc_network.id
  region        = var.gcp_region
}

# --- GKE (Google Kubernetes Engine) ---
resource "google_container_cluster" "primary" {
  name     = "e2e-gke-cluster"
  location = var.gcp_region
  deletion_protection = false

  # We will create a separate node pool, so we can remove the default one.
  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.vpc_network.self_link
  subnetwork = google_compute_subnetwork.gke_subnet.self_link

  node_config {
    machine_type = "e2-small"
    disk_size_gb = 20
    disk_type    = "pd-standard"
  }
}

# Separate node pool with autoscaling enabled
resource "google_container_node_pool" "primary_nodes" {
  name       = "e2e-node-pool"
  location   = var.gcp_region
  cluster    = google_container_cluster.primary.name
  node_count = 1

  autoscaling {
    min_node_count = 1
    max_node_count = 1
  }

  node_config {
    disk_size_gb = 20
    disk_type    = "pd-standard"
    machine_type = "e2-small"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
    service_account = google_service_account.gke_nodepool_sa.email
  }
}

# --- Firewall Rules ---
resource "google_compute_firewall" "allow_internal" {
  name    = "e2e-vpc-allow-internal"
  network = google_compute_network.vpc_network.name
  allow {
    protocol = "all"
  }
  source_ranges = ["10.10.10.0/24"] # GKE Subnet Range
}

resource "google_compute_firewall" "allow_health_checks" {
  name    = "e2e-vpc-allow-health-checks"
  network = google_compute_network.vpc_network.name
  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }
  source_ranges = ["130.211.0.0/22", "35.191.0.0/16"] # Google Health Checkers
}

# --- Google Secret Manager ---
resource "google_secret_manager_secret" "db_password_secret" {
  secret_id = "e2e_db_password"
  replication {
    user_managed {
      replicas {
        location = var.gcp_region
      }
    }
  }
}

resource "google_secret_manager_secret_version" "db_password_secret_version" {
  secret      = google_secret_manager_secret.db_password_secret.id
  secret_data = var.db_password
}

# --- Cloud SQL (PostgreSQL) ---
resource "google_sql_database_instance" "postgres" {
  name             = "e2e-postgres-instance"
  database_version = "POSTGRES_14"
  region           = var.gcp_region

  deletion_protection = false
  settings {
    tier              = "db-g1-small"
    availability_type = "REGIONAL" # High Availability
    ip_configuration {
      ipv4_enabled    = true
      private_network = google_compute_network.vpc_network.id
    }
  }
}

resource "google_sql_database" "default" {
  name     = "ad_studio_db"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "default" {
  name     = var.db_user
  instance = google_sql_database_instance.postgres.name
  password = google_secret_manager_secret_version.db_password_secret_version.secret_data
}

# --- Artifact Registry ---
resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.gcp_region
  repository_id = "ad-studio-app-repo"
  format        = "DOCKER"
  description   = "Docker repository for Ad Studio App images."
}

# --- IAM (Cuentas de Servicio y Permisos) ---
# Cuenta de servicio para los nodos de GKE
resource "google_service_account" "gke_nodepool_sa" {
  account_id   = "gke-nodepool-sa"
  display_name = "Service Account for GKE Node Pools"
}

# Permisos mínimos para la cuenta de servicio de los nodos
resource "google_project_iam_member" "gke_nodepool_sa_roles" {
  project = var.gcp_project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.gke_nodepool_sa.email}"
}

resource "google_project_iam_member" "gke_nodepool_sa_logging" {
  project = var.gcp_project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.gke_nodepool_sa.email}"
}

resource "google_project_iam_member" "gke_nodepool_sa_artifact" {
  project = var.gcp_project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.gke_nodepool_sa.email}"
}

# --- Salidas ---
output "gke_cluster_name" {
  value = google_container_cluster.primary.name
}

output "gke_cluster_endpoint" {
  value = google_container_cluster.primary.endpoint
}

output "cloud_sql_instance_name" {
  value = google_sql_database_instance.postgres.name
}

output "artifact_registry_repository_url" {
  value = "${var.gcp_region}-docker.pkg.dev/${var.gcp_project_id}/${google_artifact_registry_repository.docker_repo.repository_id}"
}
