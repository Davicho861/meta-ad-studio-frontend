Secret Manager (instrucciones)

El archivo `secretmanager.tf` contiene la definición del contenedor de secreto (sin versiones con datos). Se ha actualizado para ser compatible con el provider `google` 4.x.

Para reactivar:
1. Revisa la versión del provider en `versions.tf` y comprueba la documentación de `google_secret_manager_secret` para la sintaxis correcta.
2. Renombra el archivo:
   ```bash
   mv secretmanager.tf.disabled secretmanager.tf
   ```
3. Añade datos (versiones) al secreto fuera de Terraform. Ejemplos:

- Manual (local):
   ```bash
   gcloud secrets create meta-ad-studio-db-password --project=${PROJECT_ID} --replication-policy="automatic"
   gcloud secrets versions add meta-ad-studio-db-password --data-file=<(echo -n "${DB_PASSWORD}")
   ```

- En CI (GitHub Actions) — flujo seguro:
- En CI (GitHub Actions) — flujo seguro:

  1. Añade el valor del secreto como un Secret protegido en GitHub (ej: DB_PASSWORD).
  2. Configura los siguientes GitHub repository secrets (ejemplos de nombres):
     - `GCP_PROJECT_ID` — tu ID de proyecto GCP.
     - `GCP_SA_EMAIL` — email de la service account objetivo (si usas OIDC/Workload Identity, este es el SA a impersonar).
     - `GCP_WORKLOAD_POOL` — nombre del workload identity pool (ej: my-pool).
     - `GCP_WORKLOAD_POOL_PROVIDER` — nombre del provider dentro del pool.
     - `GCP_WORKLOAD_IDENTITY_PROVIDER_PROJECT` — proyecto donde está el pool (a veces es el mismo `GCP_PROJECT_ID`).
     - `DB_PASSWORD` (u otro nombre) — el valor del secreto que quieras añadir como versión.

  3. Usa el workflow provisto `.github/workflows/secretmanager-add.yml` (Dispatch manual). El workflow autenticará con GCP y añadirá una versión leyendo el valor del Secret de GitHub.

  Ejemplo de ejecución manual: en GitHub Actions > Workflows > "Add SecretManager Version (manual)" > Run workflow. Introduce `secret_name` y `secret_value_secret_name` (ej: `DB_PASSWORD`).

4. Ejecuta:
   ```bash
   terraform init
   terraform plan -var-file="terraform.tfvars"
   ```

Recomendación: mantener la gestión de datos secretos fuera de IaC; usa Secret Manager para almacenar valores y concede acceso a la cuenta de Workload Identity. Evita almacenar `secret_data` en los archivos TF o en repositorios.
