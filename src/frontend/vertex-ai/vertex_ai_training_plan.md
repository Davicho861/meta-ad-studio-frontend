# Vertex AI Model Training Plan: Proactive Scaling & Bottleneck Prediction

**Date:** 2025-08-31

## 1. Objective

The primary objective of this initiative is to develop and deploy a machine learning model using Vertex AI to proactively predict resource bottlenecks and provide intelligent, automated scaling recommendations for the 'Meta Studio Ad Studio App SPA'. This will enable us to move from a reactive to a predictive operational model, improving performance, reducing costs, and enhancing resilience.

## 2. Data Sources

The model will be trained on a rich dataset of time-series metrics collected from our production environment. The primary data source will be Prometheus, and the key metrics will include:

*   **Resource Utilization:**
    *   `container_cpu_usage_seconds_total`
    *   `container_memory_working_set_bytes`
*   **Application Performance:**
    *   `http_request_duration_seconds_bucket` (for latency)
    *   `http_requests_total` (for request rate and error codes)
*   **Business Metrics:**
    *   `user_sessions_total`
    *   `conversion_total`

This data will be exported from Prometheus and stored in a BigQuery dataset for training.

## 3. Methodology

The model development and deployment will follow a structured, multi-stage process:

1.  **Data Collection & Preprocessing:**
    *   A data pipeline will be established to export historical Prometheus data to BigQuery.
    *   The data will be cleaned, normalized, and enriched with contextual information (e.g., deployment annotations, regional identifiers).

2.  **Model Selection & Training:**
    *   We will leverage **Vertex AI AutoML for Time-Series Forecasting** to accelerate the model development process. This will allow us to train a high-quality forecasting model with minimal manual intervention.
    *   The model will be trained to predict future values for key metrics (e.g., CPU utilization, latency) based on historical patterns and seasonality.

3.  **Evaluation:**
    *   The model's performance will be evaluated using standard forecasting metrics, such as Mean Absolute Percentage Error (MAPE) and Root Mean Squared Error (RMSE).
    *   Back-testing will be performed on historical data to assess the model's ability to predict past incidents and resource bottlenecks.

4.  **Integration & Deployment:**
    *   The trained model will be deployed to a Vertex AI Endpoint for real-time predictions.
    *   A cloud function will be developed to query the endpoint at regular intervals and translate the predictions into actionable scaling recommendations (e.g., "Increase HPA maxReplicas by 20% for the next hour").
    *   These recommendations will be pushed to a dedicated Slack channel for review by the SRE team, with the long-term goal of automating the scaling actions.

## 4. Success Metrics

The success of this initiative will be measured by the following KPIs:

*   **Reduction in Resource Over-provisioning:** A target reduction of 15% in cloud spend on compute resources.
*   **Decrease in Latency Spikes:** A 25% reduction in the frequency of P99 latency spikes.
*   **Improved Prediction Accuracy:** The model should achieve a MAPE of less than 10% for key metrics.
*   **Automation Rate:** The percentage of scaling actions that are automatically executed based on the model's recommendations (target of 50% within 6 months).
