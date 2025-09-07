# Project Structure

This document provides a detailed overview of the project's directory structure and the purpose of each directory.

-   **`ci-cd/`**: This directory contains all the configuration files for our continuous integration and deployment pipelines. This includes files for services like GitHub Actions, CircleCI, or in this case, Google Cloud Build.
    -   `cloudbuild.yaml`: The main configuration file for our CI/CD pipeline.
    -   `cloudbuild.placeholder.yaml`: A placeholder file for future CI/CD configurations.

-   **`config/`**: This directory contains all the project-wide configuration files for tools like Vite, Jest, and TypeScript.
    -   `jest/`: Configuration files for the Jest testing framework.
    -   `tsconfig/`: Configuration files for the TypeScript compiler.
    -   `components.json`: Configuration for UI components.
    -   `eslint.config.js`: Configuration for the ESLint linter.
    -   `postcss.config.js`: Configuration for the PostCSS preprocessor.
    -   `vite.config.ts`: Configuration for the Vite development server.

-   **`docs/`**: This directory contains all the project documentation, including this `README.md` file.
    -   `analysis/`: In-depth analysis reports of the project.
    -   `plans/`: Project planning and strategy documents.
    -   `*.md`: Other general documentation files.

-   **`infra/`**: This directory contains all the infrastructure-as-code files, including Docker and Terraform configurations.
    -   `docker/`: Docker-related files, such as `Dockerfile` and `docker-compose.yml`.
    -   `main.tf`, `variables.tf`, `*.tfstate`: Terraform files for managing our cloud infrastructure.
    -   `service-account-key.json`: **WARNING:** This file contains sensitive credentials and should not be committed to the repository. It is used by Terraform to authenticate with the cloud provider.

-   **`packages/`**: This directory contains all the sub-projects and modules, such as the main application and the server.
    -   `agile_deployment/`: A module for agile deployment processes.
    -   `Meta Ad Studio-sdlc-nexus-main/`: The main application module.
    -   `meta-studio-flow-main/`: A module for managing the application's flow.
    -   `meta-verse-visualizer-main/`: A module for visualizing the metaverse.

-   **`scripts/`**: This directory contains all the shell scripts for various tasks, such as running the development server and deploying the application.
    -   `agile-deploy.sh`: A script for agile deployment.
    -   `check-recursion.sh`: A script for checking recursion.
    -   `entrypoint.sh`: The entrypoint script for the Docker container.
    -   `run-dev.sh`: A script for running the development server.

-   **`src/`**: This directory contains all the source code for the main application.
    -   `assets/`: Static assets, such as images and fonts.
    -   `components/`: Reusable UI components.
    -   `hooks/`: Custom React hooks.
    -   `lib/`: Utility functions and libraries.
    -   `pages/`: Application pages.
    -   `App.tsx`: The main application component.
    -   `main.tsx`: The entry point of the application.

-   **`tests/`**: This directory contains all the E2E and performance tests.
    -   `cypress/`: E2E tests written with Cypress.
    -   `artillery-script.yml`: A script for performance testing with Artillery.
