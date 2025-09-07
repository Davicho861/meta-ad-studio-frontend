resource "google_logging_metric" "backend_5xx_ratio" {
  name   = "backend_5xx_count"
  project = var.project_id
  description = "Count of 5xx responses in backend logs"
  filter = "resource.type=\"k8s_container\" AND resource.labels.namespace_name=\"meta-ad-studio\" AND jsonPayload.status >= 500 AND jsonPayload.status < 600"
  metric_descriptor {
    metric_kind = "DELTA"
    value_type  = "INT64"
  }
}

# Alert policy example: trigger if 5xx count exceeds threshold within 5 minutes
resource "google_monitoring_alert_policy" "backend_5xx_alert" {
  display_name = "Backend 5xx error rate"
  combiner = "OR"

  notification_channels = []

  documentation {
    content = "Alert when backend 5xx errors surge. Tune threshold and address root cause."
  }

  conditions {
    display_name = "Backend 5xx spike"
    condition_threshold {
      filter = "metric.type=\"logging.googleapis.com/user/backend_5xx_count\" resource.type=\"k8s_container\""
      comparison = "COMPARISON_GT"
      threshold_value = 10
      duration = "300s"
      trigger {
        count = 1
      }
    }
  }
}
