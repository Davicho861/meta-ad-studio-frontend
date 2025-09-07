# Terraform configuration for the EU-West region

provider "google" {
  project = "your-project-id"
  region  = "europe-west1"
}

resource "google_container_cluster" "primary" {
  name     = "gke-eu-west"
  location = "europe-west1-b"

  initial_node_count = 3

  node_config {
    machine_type = "n1-standard-2"
  }
}

resource "google_sql_database_instance" "main" {
  name             = "ad-studio-db-eu"
  database_version = "POSTGRES_13"
  region           = "europe-west1"

  settings {
    tier = "db-n1-standard-1"
  }
}

resource "google_redis_instance" "cache" {
  name           = "ad-studio-cache-eu"
  tier           = "BASIC"
  memory_size_gb = 1
  region         = "europe-west1"
}
