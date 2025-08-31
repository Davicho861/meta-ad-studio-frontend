# GCP E2E Environment Deployment

This document outlines the steps to deploy the "Meta Studio Ad Studio App" to a fully functional End-to-End (E2E) testing environment on Google Cloud Platform (GCP).

## Prerequisites

1.  **GCP Account:** You need a GCP account with billing enabled.
2.  **gcloud CLI:** The Google Cloud CLI must be installed and configured.
3.  **Terraform:** Terraform must be installed.
4.  **GitHub Repository:** A GitHub repository containing the application source code.
5.  **Service Account:** A GCP service account with the following roles:
    *   `roles/editor`
    *   `roles/iam.serviceAccountUser`
    *   `roles/cloudbuild.builds.editor`
    *   `roles/container.admin`
    *   `roles/cloudsql.admin`
    *   `roles/secretmanager.admin`
    *   `roles/artifactregistry.admin`

## Deployment Steps

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```

2.  **Update `deploy_e2e_gcp.sh`:**
    *   Set the `GCP_PROJECT_ID` variable to your GCP project ID.
    *   Update the `--repo-name` and `--repo-owner` flags in the `gcloud beta builds triggers create github` command to match your GitHub repository.

3.  **Run the deployment script:**
    ```bash
    chmod +x deploy_e2e_gcp.sh
    ./deploy_e2e_gcp.sh
    ```

The script will:
1.  Provision the necessary infrastructure using Terraform.
2.  Create a Cloud Build trigger to automate the CI/CD pipeline.
3.  Run a health check to verify the deployment.
4.  Run a basic load test.
