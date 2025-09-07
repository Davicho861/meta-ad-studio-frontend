variable "cluster_name" {
  description = "GKE cluster name"
  type        = string
  default     = "meta-ad-studio-cluster"
}

variable "db_instance_name" {
  description = "Cloud SQL instance name"
  type        = string
  default     = "meta-ad-studio-db"
}

variable "db_tier" {
  description = "Cloud SQL machine type"
  type        = string
  default     = "db-f1-micro"
}

variable "artifact_registry_name" {
  description = "Artifact Registry repo name"
  type        = string
  default     = "meta-ad-studio-repo"
}

variable "service_account_name" {
  description = "Service account name for workloads"
  type        = string
  default     = "meta-ad-studio-wi-sa"
}
