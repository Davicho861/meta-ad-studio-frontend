variable "gcp_project_id" {
  description = "The GCP project ID."
  type        = string
}

variable "gcp_region" {
  description = "The GCP region for deployments."
  type        = string
  default     = "us-central1"
}

variable "gcp_zone" {
  description = "The GCP zone for deployments."
  type        = string
  default     = "us-central1-a"
}

variable "artifact_registry_repo_name" {
  description = "Name of the Artifact Registry repository."
  type        = string
  default     = "meta-studio-app-repo"
}

variable "db_instance_name" {
  description = "Name of the Cloud SQL instance."
  type        = string
  default     = "meta-studio-db-instance"
}

variable "db_database_name" {
  description = "Name of the database within the Cloud SQL instance."
  type        = string
  default     = "meta-studio-database"
}

variable "db_user_name" {
  description = "User name for the Cloud SQL database."
  type        = string
  default     = "meta-studio-user"
}

variable "db_password" {
  description = "Password for the Cloud SQL database user."
  type        = string
  sensitive   = true
}

variable "gcs_bucket_name" {
  description = "Name of the Google Cloud Storage bucket for generated videos."
  type        = string
  default     = "meta-studio-generated-videos"
}

variable "replicate_api_secret_name" {
  description = "Name of the Google Secret Manager secret for Replicate API key."
  type        = string
  default     = "replicate-api-key"
}