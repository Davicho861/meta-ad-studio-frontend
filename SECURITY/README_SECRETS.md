# Gestión de secretos (resumen rápido)

Este documento explica cómo manejar secretos de forma segura para el entorno de desarrollo y CI.

1) No commitear secretos en el repositorio.

2) Local (desarrollo):
   - Crear un archivo `.env` en la raíz con las variables necesarias (ejemplo en `.env.example`).
   - Ejemplo mínimo (.env):
     POSTGRES_USER=devuser
     POSTGRES_PASSWORD=<<your_local_password>>
     DATABASE_URL=postgresql://devuser:<<your_local_password>>@localhost:5433/meta_ad_studio?schema=public

3) CI / Staging / Production (recomendado):
   - Usar Google Secret Manager y configurar CI para inyectar secretos.
   - Ejemplo en Cloud Build: acceder a secret con `secretEnv` o usar `gcloud secrets versions access`.

4) Terraform:
   - No usar `default` para variables sensibles. Proveer `-var-file` o usar integration con Secret Manager (como implementado en `terraform/main.tf`).

5) Detección automática:
   - Añadir un pre-commit hook que detecte strings como `POSTGRES_PASSWORD` o patrones de claves privadas.

6) Rotación:
   - Documentar y rotar credenciales periódicamente. Evitar usar credenciales por defecto en infra pública.

7) Contacto:
   - Para emergencias de seguridad: equipo-secops@example.com
