terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

locals {
  repo_name = "meta-ad-studio-repo"
  backend_service = "meta-ad-studio-backend"
  frontend_service = "meta-ad-studio-frontend"
}

# Artifact Registry
resource "google_artifact_registry_repository" "repo" {
  provider = google
  location = var.region
  repository_id = local.repo_name
  description = "Docker repo for Meta Ad Studio"
  format = "DOCKER"
}

# Secret Manager secrets placeholders
resource "google_secret_manager_secret" "database_url" {
  secret_id = "DATABASE_URL"
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "database_url_version" {
  secret      = google_secret_manager_secret.database_url.id
  secret_data = "postgresql://postgres:${var.db_password}@<CLOUDSQL_IP_OR_CONNECTION_NAME>:5432/metaad"
}

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "JWT_SECRET"
  replication { automatic = true }
}

resource "google_secret_manager_secret_version" "jwt_secret_version" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = "REPLACE_WITH_STRONG_RANDOM"
}

resource "google_secret_manager_secret" "gemini_api_key" {
  secret_id = "GEMINI_API_KEY"
  replication { automatic = true }
}

resource "google_secret_manager_secret_version" "gemini_api_key_version" {
  secret      = google_secret_manager_secret.gemini_api_key.id
  secret_data = "REPLACE_WITH_KEY"
}

# Service account for Cloud Run to access Cloud SQL and Secret Manager
resource "google_service_account" "runner_sa" {
  account_id   = "meta-ad-studio-runner-sa"
  display_name = "Service account for Cloud Run services"
}

resource "google_project_iam_binding" "sa_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  members = ["serviceAccount:${google_service_account.runner_sa.email}"]
}

resource "google_project_iam_binding" "sa_cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  members = ["serviceAccount:${google_service_account.runner_sa.email}"]
}

# Cloud SQL (Postgres)
resource "google_sql_database_instance" "postgres" {
  name             = "meta-ad-studio-db"
  database_version = "POSTGRES_14"
  region           = var.region

  settings {
    tier = "db-f1-micro"
    backup_configuration { enabled = true }
  }

  deletion_protection = false
}

resource "google_sql_user" "default" {
  name     = "postgres"
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}

resource "google_sql_database" "metaad" {
  name     = "metaad"
  instance = google_sql_database_instance.postgres.name
}

# Cloud Run services for backend and frontend
resource "google_cloud_run_service" "backend" {
  name     = local.backend_service
  location = var.region

  template {
    spec {
      service_account_name = google_service_account.runner_sa.email
      containers {
        image = var.backend_image
        env {
          name  = "DATABASE_URL"
          value_from {
            secret_key_ref {
              secret = google_secret_manager_secret.database_url.secret_id
              version = "latest"
            }
          }
        }
      }
    }
  }

  traffics {
    percent = 100
    latest_revision = true
  }

  autogenerate_revision_name = true
}

resource "google_cloud_run_service_iam_member" "backend_invoker" {
  service = google_cloud_run_service.backend.name
  location = google_cloud_run_service.backend.location
  role = "roles/run.invoker"
  member = "allUsers" # You may restrict this in production
}

resource "google_cloud_run_service" "frontend" {
  name     = local.frontend_service
  location = var.region

  template {
    spec {
      containers {
        image = var.frontend_image
      }
    }
  }

  traffics {
    percent = 100
    latest_revision = true
  }

  autogenerate_revision_name = true
}

resource "google_cloud_run_service_iam_member" "frontend_invoker" {
  service = google_cloud_run_service.frontend.name
  location = google_cloud_run_service.frontend.location
  role = "roles/run.invoker"
  member = "allUsers"
}
