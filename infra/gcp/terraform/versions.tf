terraform {
  required_version = ">= 1.3.0"

  required_providers {
    google = {
  source  = "hashicorp/google"
  # Pin provider to 4.x to keep compatibility with resources and blocks used in this repo
  # (some 5.x provider changes break older resource schema such as certain secretmanager blocks)
  version = ">= 4.0.0, < 5.0.0"
    }
  }
}
