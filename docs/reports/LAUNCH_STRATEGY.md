LAUNCH_STRATEGY.md

Resumen
------
Este documento describe la estrategia de lanzamiento y despliegue para la versión v1.1.0 del proyecto "Meta Ad Studio" (Proyecto Conexión: integración RunwayML para generación de video). Se asume despliegue en Google Cloud Platform (GCP) usando Cloud Build + Artifact Registry y Cloud Run (o GKE) para ejecución.

Fase 0: Comandos Git (tagging y limpieza)
----------------------------------------
- Crear un tag anotado en el commit de fusión en `main` (local):

  git tag -a v1.1.0 -m "Release: AI Video Generation with RunwayML integration"

- Empujar el tag al remoto:

  git push origin v1.1.0

- Eliminar la rama remota feature/worker-provider-integration (después de mergear):

  git push origin --delete feature/worker-provider-integration

Fase 1: Construcción y etiquetado de imágenes de producción
-----------------------------------------------------------
Objetivo: Al detectar un tag `v*.*.*` (por ejemplo `v1.1.0`) el CI debe:
1. Construir imágenes Docker para los servicios relevantes (ej. api-server, meta-verse-visualizer-main).
2. Etiquetar las imágenes con el número de versión (ej. gcr.io/PROJECT_ID/api-server:v1.1.0).
3. Subir las imágenes a Artifact Registry / Container Registry.

Sugerencia de modificaciones para `ci-cd/cloudbuild.yaml`:
- Añadir una trigger que dispare en push de tags `v*.*.*`.
- Incluir sustituciones: _VERSION = $TAG_NAME
- Steps (resumen):
  - 'gcr.io/cloud-builders/docker' build -t ${_REGISTRY}/api-server:${_VERSION} -f packages/api-server/server/Dockerfile .
  - 'gcr.io/cloud-builders/docker' push ${_REGISTRY}/api-server:${_VERSION}
  - Repetir para meta-verse-visualizer-main y otros servicios.

Estructura de nombre de imagen recomendada:
- ${REGISTRY_HOST}/${GCP_PROJECT}/api-server:${VERSION}
- ${REGISTRY_HOST}/${GCP_PROJECT}/meta-verse-visualizer-main:${VERSION}

Fase 2: Manejo de secretos en producción
----------------------------------------
Recomendación:
- Usar Google Secret Manager para almacenar DATABASE_URL, RUNWAYML_API_KEY, REDIS_URL y otros secretos.
- Conceder acceso al servicio de Cloud Build y a las identidades de servicio de Cloud Run/GKE mediante IAM roles `Secret Manager Secret Accessor`.
- No almacenar secretos en variables de sustitución del build ni en código.

Cómo inyectar secretos en Cloud Run:
- Durante el despliegue via `gcloud run deploy`, usar `--set-secrets` o configurar en la consola las variables de entorno vinculadas a secretos.

Fase 3: Arquitectura de Infraestructura en GCP
---------------------------------------------
Recomendación flexible según nivel de control deseado:
- Opción serverless (preferida para menor Ops):
  - Cloud Run para `api-server` y `meta-verse-visualizer-main` (servicio por imagen). Auto-scalado y facturación por uso.
  - Cloud SQL (Postgres) para la base de datos.
  - Memorystore (Redis) para la cola/caché (o seguir con Cloud Memorystore Redis + BullMQ en Cloud Run con instancia VPC).
  - Artifact Registry para almacenar imágenes Docker.
  - Secret Manager para secretos.
  - Opcional: Cloud Scheduler + Pub/Sub para jobs programados.

- Opción Kubernetes (para control + workloads pesados):
  - GKE Autopilot o Standard con manifiestos en `k8s/`.
  - Cloud SQL + Private IP + VPC peering.
  - Memorystore para Redis.
  - Horizontal Pod Autoscaler y readiness/liveness probes.

Fase 4: Pipeline de despliegue por tags en `cloudbuild.yaml` (steps detallados)
------------------------------------------------------------------------------
Precondiciones: Cloud Build tiene permisos para crear/actualizar Cloud Run services o aplicar manifiestos a GKE. Artifact Registry configurado.

1) Setup: substitutions
- _VERSION: corresponds to tag name (e.g. v1.1.0)
- _REGISTRY: e.g. us-central1-docker.pkg.dev
- _PROJECT_ID: GCP_PROJECT

2) Steps (orden recomendado):
- step: name: 'gcr.io/cloud-builders/npm'
  args: ['ci']
  id: 'Install dependencies'

- step: name: 'gcr.io/cloud-builders/npm'
  args: ['run', 'test']
  id: 'Run tests'

- step: Build images (parallelizable)
  - build api-server
  - build meta-verse-visualizer-main

- step: name: 'gcr.io/cloud-builders/docker'
  args: ['push', '${_REGISTRY}/${_PROJECT_ID}/api-server:${_VERSION}']

- step: Vulnerability scan (optional): run Trivy on the built images and fail build on critical vulns.

- step: Deploy
  - For Cloud Run: use 'gcr.io/cloud-builders/gcloud' with `run deploy` per service and `--image` set to the pushed image and `--region` and `--platform=managed`. Inject secrets via references to Secret Manager.
  - For GKE: use `kubectl apply -f k8s/` after configuring context to the target cluster (gcloud container clusters get-credentials ...).

Fase 5: Estrategia de Rollback
-----------------------------
- Mantener versiones previas etiquetadas en Artifact Registry.
- Si el despliegue falla o los errores son críticos, redeploy del tag anterior estable:
  - Para Cloud Run: gcloud run deploy <service> --image ${_REGISTRY}/${_PROJECT_ID}/api-server:<previous-tag>
  - Para GKE: actualizar deployment a la imagen anterior y aplicar.
- Mantener health checks y feature flags para desactivar la funcionalidad de video si fuera necesario (toggle en DB o config remotely managed).

Fase 6: Monitoreo y Observabilidad
---------------------------------
- Integrar Logging con Cloud Logging (Stackdriver) y métricas en Cloud Monitoring.
- Configurar alertas: error rate > X, latency > Y, job failure rate for video-generation > Z.
- Añadir tracing (Cloud Trace/OpenTelemetry) para seguir el flujo de solicitudes y jobs asíncronos.

Fase 7: Checklist de producción
-------------------------------
- [ ] Ejecutar pruebas E2E completas en staging con RunwayML sandbox creds.
- [ ] Verificar migraciones de DB y backups de Cloud SQL.
- [ ] Verificar límites y cuotas de RunwayML y costes estimados.
- [ ] Revisar permisos de IAM para servicios y Secret Manager.
- [ ] Programar una ventana de despliegue y plan de rollback.

Anexos: Comandos útiles
----------------------
- Crear tag:
  git tag -a v1.1.0 -m "Release: AI Video Generation with RunwayML integration"
- Push tag:
  git push origin v1.1.0
- Delete remote branch:
  git push origin --delete feature/worker-provider-integration
- Trigger manual Cloud Build (opcional):
  gcloud builds submit --config=ci-cd/cloudbuild.yaml --substitutions=_VERSION=v1.1.0,_PROJECT_ID=your-project-id,_REGISTRY=us-central1-docker.pkg.dev .


Fin del documento
