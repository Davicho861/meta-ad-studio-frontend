# ROADMAP_CONNECTION.md

Resumen ejecutivo
-----------------
Este documento propone un plan para reemplazar el backend simulado por una implementación de producción para la generación de video basada en proveedores de IA. Incluye una comparativa de proveedores, diseño de arquitectura con cola de trabajos y workers, manejo de secretos y un plan de implementación por fases.

A. Investigación y comparativa de proveedores de IA
-------------------------------------------------
Se evaluaron 3 proveedores relevantes para generación de video: Pika Labs, Runway y Stable Video Diffusion (ecosistema Stability). A continuación una comparación resumida y recomendación.

1) Pika Labs
- Calidad de video: Alta, orientada a generación creativa con buen detalle en escenas cortas.
- Velocidad: Rápida para piezas cortas; latencias típicas en segundos-minutos dependiendo del tamaño.
- Costo: Modelo de precios por clip con niveles; costos moderados-alto para uso a escala.
- Facilidad de integración: API REST relativamente simple; SDKs emergentes.
- Consideraciones: Buena para prototipos y resultados artísticos; verificar límites de resolución y términos de uso.

2) Runway
- Calidad de video: Muy buena — enfoque profesional, herramientas maduras para video generativo.
- Velocidad: Competitiva; ofrece endpoints optimizados y opciones de batch.
- Costo: Alto en comparación, pero ofrece más funciones y niveles empresariales.
- Facilidad de integración: API robusta, webhooks y SDKs oficiales; documentación sólida.
- Consideraciones: Ideal para producción empresarial, SLA y soporte.

3) Stable Video Diffusion (Stability AI + comunidades)
- Calidad de video: Creciente; modelos open-source con alta personalización.
- Velocidad: Variable según infra; en la nube puede ser competitivo si se orquesta correctamente.
- Costo: Potencialmente más barato si se ejecuta en infra propia o marketplaces cloud; uso de instancias GPU incrementa gasto.
- Facilidad de integración: Menor que proveedores SaaS; requiere más ingeniería para infra y ajustes de modelos.
- Consideraciones: Gran control, posibilidad de self-hosting y optimización de costos a largo plazo.

Recomendación
-------------
Para comenzar con una integración rápida, estable y con soporte empresarial, recomiendo Runway por su calidad, APIs maduras, soporte de webhooks y SLA. Si el objetivo principal es control de costos y privacidad, considerar Stable Video Diffusion en fase 2/3 con self-hosting.

B. Diseño de arquitectura backend de producción
------------------------------------------------
Objetivo: Reemplazar el controller simulado por un flujo de trabajo robusto que maneje cargas, retries, telemetría y seguridad.

Componentes propuestos
- API Gateway / Backend HTTP (existing express app)
  - Recibe requests de generación (POST /api/v1/animate-image).
  - Valida payload, autentica al usuario, encola trabajo y responde con jobId inmediatamente.

- Persistencia de estado
  - Base de datos relacional o NoSQL (Postgres preferido) con tabla `jobs`:
    - id (uuid), ownerId, prompt, imageUrl, status (queued|processing|completed|error), providerJobId, resultUrl, thumbnailUrl, attempts, createdAt, updatedAt, metadata(json)

- Job Queue
  - Redis + BullMQ (o Bee-Queue) como sistema de cola persistente y escalable.
  - Jobs encolados con prioridad, TTL y backoff/retries configurados.

- Workers (Proceso separado)
  - Uno o más worker processes (Node.js) que consumen la cola.
  - Worker realiza:
    1. Marcar job como processing (transacción DB).
    2. Llamar a la API del proveedor (Runway) con el payload y subir assets si es necesario.
    3. Si proveedor ofrece Webhooks: registrar providerJobId y esperar notificación (ver abajo). Si no, el worker puede poll o usar SDKs.
    4. Tras completar, persistir videoUrl/thumbnailUrl y cambiar estado a completed.
    5. Emitir notificaciones (websocket / pubsub) a clientes y/o enviar webhook interno.

- Notificación en tiempo real al frontend
  - WebSocket (Socket.IO) o Server-Sent Events para push inmediato.
  - Alternativa: mantener polling en frontend durante transición y WebSocket para mejoras.

- Manejo de Webhooks vs Polling
  - Preferir Webhooks si el proveedor los ofrece: Runway y otros suelen soportarlos.
    - Worker registra providerJobId y una callback URL segura (/api/v1/provider/webhook)
    - El proveedor llamará la URL cuando el asset esté listo; en el handler verificamos la firma, actualizamos DB y encolamos tareas post-proceso (thumbnailing, ingest).
  - Si no hay webhooks, el worker hace polling con backoff y límites de retries, o se delega a un servicio cron que revisa jobs en estado processing.

- Post-procesos
  - Transcodificación (ffmpeg) y optimización, generación de thumbnails, almacenado en Cloud Storage (GCS/S3).
  - Firma corta de URLs o integración con CDN.

- Observabilidad
  - Logs estructurados (pino) y métricas (prom-client). Alertas para fails y latencias.

C. Manejo de secretos y costos
-------------------------------
- Secretos
  - Local dev: variables de entorno (.env), asegurarse de .env.example pero no commitear .env.
  - Containerized: Docker secrets o pass-through env vars en docker-compose.
  - Cloud: usar secret manager del proveedor (GCP Secret Manager, AWS Secrets Manager, Azure Key Vault). Inyectar secretos en runtime en los pods.
  - CI: almacenar secretos en CI/CD secure variables y no exponer en logs.
  - Rotación: plan de rotación periódica y auditoría.

- Costos
  - Medir por job: trackear duration, output size, y llamadas a la API del proveedor.
  - Implementar límites por cliente (quotas, rate-limits) y políticas de coste (e.g., pasar costo a campañas).
  - Hacer estimaciones: iniciar con un plan de prueba del proveedor y simular 1000 jobs/mes para modelar costos.
  - Control de gastos: alertas cuando consumo estimado supere umbrales mensuales.

D. Plan de implementación por fases
------------------------------------
Fase 0 — Preparación (1-2 semanas)
- Definir contrato API entre frontend y backend (payload, job schema, errores).
- Añadir tabla `jobs` y migraciones a la base de datos.
- Configurar Redis y BullMQ en entorno de staging.
- Integrar Secret Manager y configurar variables env para producción.

Fase 1 — Worker + Queue básico (2-3 semanas)
- Implementar endpoint POST /api/v1/animate-image que encole job en Redis y crea la fila en DB; responder jobId.
- Implementar worker simple que consuma la cola, haga una llamada a la API de proveedor (modo sin webhooks) y simule completado.
- Exponer GET /api/v1/animate-image/status/:jobId para consultar estado.
- Integrar tests e2e básicos en staging.

Fase 2 — Integración proveedor y webhooks (2-3 semanas)
- Integrar cliente oficial del proveedor (Runway SDK or REST). Manejar autenticación.
- Implementar webhook handler seguro para recibir notificaciones de job completed.
- Actualizar worker para usar providerJobId y esperar webhook en lugar de polling cuando sea posible.
- Añadir transcodificación y almacenado en el bucket (S3/GCS).

Fase 3 — Escalado, observabilidad y hardening (2-3 semanas)
- Configurar autoscaling para workers basados en cola length.
- Añadir métricas, alertas y tracing (Sentry, Prometheus).
- Implementar retries con backoff, dead-letter queue y reintentos manuales.
- Harden security: rate-limits, input sanitization, secret rotation.

Fase 4 — Optimización y coste (opcional, 2-4 semanas)
- Evaluar self-hosting de modelos (Stable) si los costos/protección de datos lo justifican.
- Implementar caching de resultados si prompts idénticos son solicitados.
- Revisar SLA y optimizar costos (GPU spot instances, batching).

Checklist de QA antes de producción
-----------------------------------
- Tests unitarios y de integración en CI.
- Pruebas de carga: simular picos de jobs y validar cola y workers.
- Verificación de webhooks (firma/verificación) y manejo de replays.
- Backups y plan de recuperación en caso de errores en providers.

Conclusión
----------
La recomendación inicial es integrar con Runway para despliegues rápidos y confiables. La arquitectura propuesta prioriza resiliencia (Redis + BullMQ), separación de responsabilidades (API vs Worker) y la adopción de webhooks cuando estén disponibles para minimizar polling y latencia. El plan por fases permite avanzar desde una implementación que solo sustituye la simulación hasta una solución escalable y optimizada para costos.


Prepared by: Dev Team
Date: 2025-09-04
