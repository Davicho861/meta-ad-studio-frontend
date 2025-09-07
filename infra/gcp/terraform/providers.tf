variable "project_id" {
  description = "GCP project id"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "location" {
  description = "GCP location (region or multiregion) used by some services"
  type        = string
  default     = "us-central1"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Optional: remote state backend using GCS. Uncomment and configure when ready.
# terraform {
#   backend "gcs" {
#     bucket = "<your-terraform-state-bucket>"
#     prefix = "meta-ad-studio/terraform/state"
#   }
# }
