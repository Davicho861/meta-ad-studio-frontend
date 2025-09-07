# Meta Ad Studio

Welcome to Meta Ad Studio, a comprehensive platform for managing and optimizing advertising campaigns.

## Table of Contents

- [Meta Ad Studio](#meta-ad-studio)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)

## Project Overview

Meta Ad Studio is a single-page application (SPA) built with Vite, React, and Tailwind CSS. It provides a suite of tools for creating, managing, and analyzing ad campaigns across multiple platforms. The project is structured as a monorepo, with separate packages for the main application, the server, and various other modules.

## Features

-   **Campaign Management:** Create, edit, and manage ad campaigns.
-   **Ad Creation:** Design and build ads with a rich media editor.
-   **Analytics and Reporting:** Track campaign performance with detailed analytics and reports.
-   **A/B Testing:** Test different ad variations to optimize performance.
-   **Audience Targeting:** Define and target specific audience segments.

## Architecture

The project is organized into the following directories:

-   `ci-cd/`: Configuration files for continuous integration and deployment.
-   `config/`: Project-wide configuration files for tools like Vite, Jest, and TypeScript.
-   `docs/`: Project documentation, including this `README.md` file.
-   `infra/`: Infrastructure-as-code files, including Docker and Terraform configurations.
-   `packages/`: Sub-projects and modules, such as the main application and the server.
-   `scripts/`: Shell scripts for various tasks, such as running the development server and deploying the application.
-   `src/`: Source code for the main application.
-   `tests/`: E2E and performance tests.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   Bun
-   Docker
-   Terraform

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/meta-ad-studio.git
    ```
2.  Install the dependencies:
    ```bash
    bun install
    ```

### Running the Application

To run the application in development mode, use the following command:

```bash
bun dev
```

This will start the development server and open the application in your default browser.

## Testing

The project includes both E2E and unit/integration tests. To run the tests, use the following commands:

-   **E2E Tests:**
    ```bash
    bun test:e2e
    ```
-   **Unit/Integration Tests:**
    ```bash
    bun test:unit
    ```

## Deployment

The application can be deployed to a cloud provider using Docker and Terraform. For detailed instructions, see the deployment guide in the `docs/` directory.

## Contributing

We welcome contributions from the community. To contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with a descriptive message.
4.  Push your changes to your forked repository.
5.  Create a pull request to the main repository.

## License

This project is licensed under the MIT License. See the `LICENSE.md` file for more information.
