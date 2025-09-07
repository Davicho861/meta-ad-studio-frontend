Observabilidad y Seguridad - Meta-Ad-Studio (GCP)

Secret Manager
- Evita almacenar secretos en Terraform en texto plano.
- Usa `google_secret_manager_secret` y crea versiones fuera del repo (o en CI vía `gcloud secrets versions add`).
- Da acceso mínimo: la Service Account de Workload Identity necesita `roles/secretmanager.secretAccessor`.

Logging & Monitoring
- Hemos creado una métrica basada en logs `backend_5xx_count` que cuenta 5xx en el namespace `meta-ad-studio`.
- La alerta (`backend_5xx_alert`) es un ejemplo que dispara si hay más de 10 errores 5xx en 5 minutos. Ajusta `threshold_value` y `duration` según carga real.

Alerting channels
- Terraform crea la política; añade canales de notificación desde la consola o mediante `google_monitoring_notification_channel` en Terraform.

Next Steps
- Integrar PagerDuty / Slack como canales de notificación.
- Filtrar logs en el backend para asegurar que `jsonPayload.status` esté presente; adaptar el `filter` al formato real de logs (Stackdriver/structured logs).
