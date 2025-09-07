# API: POST /api/v1/animate-image

Propósito

- Recibir una petición desde el frontend solicitando que una imagen (ya generada) sea convertida en un video animado por un proveedor externo de video generativo.

Endpoint

POST /api/v1/animate-image

Payload (JSON)

{
  "imageUrl": "https://.../image.png", // required
  "prompt": "Describe la animación que quieres aplicar", // optional pero recomendado
  "id": "optional-result-id" // id interno para rastrear
}

Respuesta

- 202 Accepted (cola)
  {
    "jobId": "uuid-...",
    "status": "queued"
  }

- 200 OK (si la API hace la conversión sincrónica)
  {
    "videoUrl": "https://.../video.mp4",
    "thumbnailUrl": "https://.../thumb.jpg",
    "status": "completed"
  }

- 4xx/5xx
  {
    "error": "message"
  }

Polling / Estado

GET /api/v1/animate-image/status/:jobId

Respuesta ejemplo:

{
  "jobId": "uuid-...",
  "status": "processing|completed|failed",
  "progress": 42,
  "videoUrl": "https://.../video.mp4", // available when completed
  "thumbnailUrl": "https://.../thumb.jpg"
}

Notas de implementación

- Recomendado: encolar el trabajo (Redis + Bull/Queue) y usar un worker que llame a la API del proveedor (Runway, Pika Labs, etc.).
- Guardar metadatos en la base de datos (videoUrl, thumbnailUrl, providerJobId, status, timestamps).
- Seguridad: proteger el endpoint con `authMiddleware` y rate-limit por usuario.
- Costos: sanity-check en el backend (por ejemplo, límite diario por usuario) antes de invocar API de terceros.
- Retries: implementar reintentos exponenciales en caso de errores transitorios de la API externa.
