resource "google_sql_database_instance" "postgres_instance" {
  name             = var.db_instance_name
  project          = var.project_id
  region           = var.region

  database_version = "POSTGRES_15"

  settings {
    tier = var.db_tier
    availability_type = "REGIONAL" # High availability across zones in region

    backup_configuration {
      enabled = true
      start_time = "03:00"
      location = var.region
    }

    ip_configuration {
      ipv4_enabled = false
      # recommended: use private IP
      private_network = "projects/${var.project_id}/global/networks/default"
    }
  }
}

resource "google_sql_database" "app_db" {
  name     = "meta_ad_studio"
  instance = google_sql_database_instance.postgres_instance.name
  project  = var.project_id
}

output "db_instance_connection_name" {
  value = google_sql_database_instance.postgres_instance.connection_name
}
