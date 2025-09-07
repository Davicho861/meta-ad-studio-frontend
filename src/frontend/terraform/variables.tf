variable "project_id" {
  description = "GCP project id"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "db_password" {
  description = "Initial DB password (recommended to set via terraform.tfvars or Secret Manager)"
  type        = string
  default     = "REPLACE_ME"
}

variable "backend_image" {
  description = "Artifact Registry image path for backend (will be built by Cloud Build)"
  type        = string
  default     = ""
}

variable "frontend_image" {
  description = "Artifact Registry image path for frontend"
  type        = string
  default     = ""
}
