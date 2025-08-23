terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
  zone    = var.gcp_zone
}

# VPC Network for Cloud SQL Private IP
resource "google_compute_network" "vpc_network" {
  project                 = var.gcp_project_id
  name                    = "meta-studio-vpc"
  auto_create_subnetworks = true
}

# Google Artifact Registry for Docker images
resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.gcp_region
  repository_id = var.artifact_registry_repo_name
  description   = "Docker repository for Meta Studio Ad Studio App SPA images"
  format        = "DOCKER"
}

# Service Account for Cloud Run services
resource "google_service_account" "cloudrun_service_account" {
  account_id   = "cloudrun-service-account"
  display_name = "Service Account for Cloud Run Services"
  project      = var.gcp_project_id
}

# IAM binding for Cloud Run service account to pull images from Artifact Registry
resource "google_artifact_registry_repository_iam_member" "artifact_reader" {
  repository = google_artifact_registry_repository.docker_repo.id
  location   = var.gcp_region
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.cloudrun_service_account.email}"
}

# Google Secret Manager for Replicate API Key
resource "google_secret_manager_secret" "replicate_api_key_secret" {
  project = var.gcp_project_id
  secret_id = var.replicate_api_secret_name

  replication {
    auto {}
  }
}

# Grant Cloud Run service account access to the Replicate API key secret
resource "google_secret_manager_secret_iam_member" "replicate_api_key_secret_access" {
  project   = var.gcp_project_id
  secret_id = google_secret_manager_secret.replicate_api_key_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloudrun_service_account.email}"
}

# Google Cloud SQL (PostgreSQL) Instance
resource "google_sql_database_instance" "main_db_instance" {
  project          = var.gcp_project_id
  database_version = "POSTGRES_14"
  name             = var.db_instance_name
  region           = var.gcp_region

  settings {
    tier = "db-f1-micro" # Smallest tier for cost-effectiveness
    ip_configuration {
      ipv4_enabled = true
      private_network = google_compute_network.vpc_network.id # Assuming a VPC network exists
    }
    backup_configuration {
      enabled            = true
      binary_log_enabled = true
    }
    database_flags {
      name  = "cloudsql.iam_authentication"
      value = "On"
    }
  }
}

# Google Cloud SQL Database
resource "google_sql_database" "main_database" {
  project  = var.gcp_project_id
  name     = var.db_database_name
  instance = google_sql_database_instance.main_db_instance.name
  charset  = "UTF8"
}

# Google Cloud SQL User
resource "google_sql_user" "main_db_user" {
  project  = var.gcp_project_id
  name     = var.db_user_name
  instance = google_sql_database_instance.main_db_instance.name
  host     = "%" # Allow connections from any host (for Cloud Run)
  password = var.db_password
}

# Google Cloud Storage Bucket for generated videos
resource "google_storage_bucket" "generated_videos_bucket" {
  project       = var.gcp_project_id
  name          = var.gcs_bucket_name
  location      = var.gcp_region
  force_destroy = false # Set to true for easy cleanup during development, but be careful in production
  uniform_bucket_level_access = true
}

# VPC Serverless Connector
resource "google_vpc_access_connector" "serverless_connector" {
  project       = var.gcp_project_id
  name          = "meta-studio-connector"
  region        = var.gcp_region
  network       = google_compute_network.vpc_network.name
  ip_cidr_range = "10.8.0.0/28" # RFC1918 range for the connector
}

# Cloud Run Service for Backend
resource "google_cloud_run_v2_service" "backend_service" {
  name     = "meta-studio-backend"
  location = var.gcp_region
  project  = var.gcp_project_id

  template {
    containers {
      image = "${var.gcp_region}-docker.pkg.dev/${var.gcp_project_id}/${var.artifact_registry_repo_name}/backend:latest"
      ports {
        container_port = 3000 # Assuming backend runs on port 3000
      }
      env {
        name = "REPLICATE_API_TOKEN"
        value_source {
          secret_key_ref {
            secret = google_secret_manager_secret.replicate_api_key_secret.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "DATABASE_URL"
        value = "postgresql://${google_sql_user.main_db_user.name}:${var.db_password}@${google_sql_database_instance.main_db_instance.private_ip_address}/${google_sql_database.main_database.name}?sslmode=disable"
      }
      env {
        name  = "CLOUD_RUN_SERVICE_URL"
        value = self.uri # Pass the service's own URL for the webhook
      }
    }
    service_account = google_service_account.cloudrun_service_account.email
    vpc_access {
      connector = google_vpc_access_connector.serverless_connector.id
      egress    = "ALL_TRAFFIC"
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  # Allow internal access only
  ingress = "INGRESS_TRAFFIC_INTERNAL_ONLY"
}

# Cloud Run Service for Frontend
resource "google_cloud_run_v2_service" "frontend_service" {
  name     = "meta-studio-frontend"
  location = var.gcp_region
  project  = var.gcp_project_id

  template {
    containers {
      image = "${var.gcp_region}-docker.pkg.dev/${var.gcp_project_id}/${var.artifact_registry_repo_name}/frontend:latest"
      ports {
        container_port = 80 # Assuming frontend Nginx runs on port 80
      }
      env {
        name  = "VITE_API_URL" # This should match the environment variable expected by the frontend
        value = google_cloud_run_v2_service.backend_service.uri
      }
      env {
        name = "GCS_BUCKET_NAME"
        value = google_storage_bucket.generated_videos_bucket.name
      }
    }
    service_account = google_service_account.cloudrun_service_account.email
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  # Allow public access
  ingress = "INGRESS_TRAFFIC_ALL"
}

# IAM binding for public access to the frontend service
resource "google_cloud_run_v2_service_iam_member" "frontend_public_access" {
  location = google_cloud_run_v2_service.frontend_service.location
  name     = google_cloud_run_v2_service.frontend_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# IAM binding for frontend service account to invoke the backend service
resource "google_cloud_run_v2_service_iam_member" "backend_invoker" {
  location = google_cloud_run_v2_service.backend_service.location
  name     = google_cloud_run_v2_service.backend_service.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.cloudrun_service_account.email}"
}

output "db_connection_string" {
  value       = "postgresql://${google_sql_user.main_db_user.name}:${var.db_password}@${google_sql_database_instance.main_db_instance.private_ip_address}/${google_sql_database.main_database.name}?sslmode=disable"
  description = "The connection string for the Cloud SQL database."
  sensitive   = true
}

output "gcs_bucket_name" {
  value       = google_storage_bucket.generated_videos_bucket.name
  description = "The name of the Google Cloud Storage bucket."
}

output "frontend_url" {
  value       = google_cloud_run_v2_service.frontend_service.uri
  description = "The URL of the deployed frontend service."
}

output "backend_url" {
  value       = google_cloud_run_v2_service.backend_service.uri
  description = "The URL of the deployed backend service."
}

# Google Cloud Monitoring Dashboard
resource "google_monitoring_dashboard" "main_dashboard" {
  project        = var.gcp_project_id
  dashboard_json = jsonencode({
    "displayName": "Meta Studio Application Dashboard",
    "gridLayout": {
      "columns": "2",
      "widgets": [
        {
          "title": "Frontend Request Count",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "metric.type=\"run.googleapis.com/request_count\" resource.type=\"cloud_run_revision\" resource.labels.service_name=\"${google_cloud_run_v2_service.frontend_service.name}\"",
                  "aggregation": {
                    "perSeriesAligner": "ALIGN_RATE"
                  }
                }
              }
            }],
            "chartOptions": {
              "mode": "COLOR"
            }
          }
        },
        {
          "title": "Backend Request Count",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "metric.type=\"run.googleapis.com/request_count\" resource.type=\"cloud_run_revision\" resource.labels.service_name=\"${google_cloud_run_v2_service.backend_service.name}\"",
                  "aggregation": {
                    "perSeriesAligner": "ALIGN_RATE"
                  }
                }
              }
            }],
            "chartOptions": {
              "mode": "COLOR"
            }
          }
        },
        {
          "title": "Backend 5xx Errors",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "metric.type=\"run.googleapis.com/request_count\" resource.type=\"cloud_run_revision\" resource.labels.service_name=\"${google_cloud_run_v2_service.backend_service.name}\" metric.labels.response_code_class=\"5xx\"",
                  "aggregation": {
                    "perSeriesAligner": "ALIGN_COUNT"
                  }
                }
              }
            }],
            "chartOptions": {
              "mode": "COLOR"
            }
          }
        },
        {
          "title": "Backend Request Latency",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "metric.type=\"run.googleapis.com/request_latencies\" resource.type=\"cloud_run_revision\" resource.labels.service_name=\"${google_cloud_run_v2_service.backend_service.name}\"",
                  "aggregation": {
                    "perSeriesAligner": "ALIGN_PERCENTILE_99"
                  }
                }
              }
            }],
            "chartOptions": {
              "mode": "COLOR"
            }
          }
        }
      ]
    }
  })
}
