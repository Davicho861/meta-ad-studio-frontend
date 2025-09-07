# Meta-Ad-Studio — Guía de Despliegue

Documento consolidado con instrucciones para desplegar Meta-Ad-Studio en Debian 12 por dos métodos: contenerizado (Docker) y nativo (sin Docker).

---

## Resumen rápido

- Modo recomendado: Docker (rápido, consistente, aislado).
- Modo nativo: para entornos donde no se desea usar Docker o para compilar la app de escritorio (Tauri).

---

## Modo 1 — Despliegue con Docker (recomendado)

### Archivos de script

Contenido de `start-docker.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check docker
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker no está instalado. Instala Docker y vuelve a intentarlo."
  exit 1
fi

# Check docker daemon
if ! docker info >/dev/null 2>&1; then
  echo "Error: El servicio Docker no está en ejecución o no tienes permisos para acceder a él."
  echo "Intenta: sudo systemctl start docker"
  exit 1
fi

# Check docker-compose (v2) or docker compose
if command -v docker-compose >/dev/null 2>&1; then
  DC_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
  DC_CMD="docker compose"
else
  echo "Error: docker-compose no está disponible (ni 'docker-compose' ni 'docker compose')."
  exit 1
fi

# Ensure .env exists
if [ ! -f "${ROOT_DIR}/.env" ]; then
  if [ -f "${ROOT_DIR}/.env.example" ]; then
    cp "${ROOT_DIR}/.env.example" "${ROOT_DIR}/.env"
    echo "Se ha copiado .env.example -> .env. Revisa ${ROOT_DIR}/.env y ajusta las variables antes de continuar si es necesario."
  else
    echo "Aviso: No se encontró .env ni .env.example en ${ROOT_DIR}. Continúo, pero asegúrate de configurar las variables de entorno."
  fi
fi

echo "Construyendo y levantando contenedores (en background)..."
# Build and start
${DC_CMD} up --build -d --remove-orphans

echo
echo "Estado de los contenedores:"
${DC_CMD} ps

echo
echo "Despliegue completado."
echo "Accede a la aplicación en: http://localhost (o el puerto configurado en tu docker-compose.yml)"

```

Contenido de `stop-docker.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check for docker/compose
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker no está instalado."
  exit 1
fi

if command -v docker-compose >/dev/null 2>&1; then
  DC_CMD="docker-compose"
else
  DC_CMD="docker compose"
fi

echo "Deteniendo y eliminando contenedores, redes y volúmenes asociados..."
# -v elimina volúmenes asociados. Útil para limpiar datos en dev; en prod usar con cuidado.
${DC_CMD} down -v --remove-orphans

echo "Contenedores detenidos. Los volúmenes se han eliminado (-v). Si quieres conservar datos, ejecuta sin -v."
```

### Uso rápido

Dar permiso de ejecución a los scripts:

```bash
chmod +x start-docker.sh stop-docker.sh
```

Iniciar contenedores:

```bash
./start-docker.sh
```

Parar y limpiar contenedores/volúmenes:

```bash
./stop-docker.sh
```

Nota: Revisa `docker-compose.yml` para confirmar puertos expuestos y rutas de volúmenes.

---

## Flujo de Desarrollo Full-Stack (Recomendado para desarrollo local)

Este repositorio ahora incluye un entorno de desarrollo full-stack orquestado con Docker Compose.
Con un solo comando levantarás frontend (con hot-reload), backend, base de datos Postgres y Redis.

Archivos clave:
- `docker-compose.dev.yml` — define servicios: `frontend`, `backend`, `db` (postgres) y `redis`.
- `.env.development` — variables de entorno para desarrollo local (no usar en producción).
- `scripts/start-dev-fullstack.sh` — levanta toda la pila en modo desarrollo.
- `scripts/stop-dev-fullstack.sh` — detiene toda la pila.

Cómo funciona (resumen):
- El `frontend` monta el código local y ejecuta Vite en modo dev (`npm run dev -- --host`) para hot-reload.
- El `backend` corre en su propio contenedor y se comunica con Postgres y Redis.
- Los servicios comparten la misma red de Docker; dentro de esa red cada servicio puede resolverse por su nombre.

Variables de entorno entre servicios:
- El `frontend` recibe `VITE_API_BASE_URL=http:./src/backend:8000`. Dentro de Docker, `http:./src/backend:8000` resuelve al contenedor `backend` gracias al DNS interno de Docker Compose.
- Desde el host, el `backend` también está mapeado a `http://localhost:8000` por conveniencia.

Ejemplo: consumir la variable en Vite (frontend JavaScript):

```js
// fetch usando la variable definida en .env.development
const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
fetch(`${apiBase}/api/health`).then(res => res.json()).then(console.log)
```

Por qué `http:./src/backend:8000` funciona dentro de Docker y `http://localhost:8000` no:
- Dentro de la red de Docker, cada servicio tiene un nombre DNS (el servicio `backend`) que resuelve a la IP del contenedor. Por eso `http:./src/backend:8000` apunta correctamente desde el contenedor `frontend` al contenedor `backend`.
- `http://localhost:8000` desde el contenedor se refiere al propio contenedor (no al host), por eso NO se debe usar para comunicación entre servicios.

Comandos rápidos:

```bash
# Hacer ejecutables los scripts (una sola vez)
chmod +x scripts/start-dev-fullstack.sh scripts/stop-dev-fullstack.sh

# Levantar la pila full-stack (dev)
./scripts/start-dev-fullstack.sh

# Seguir logs (opcional)
docker-compose -f docker-compose.dev.yml logs -f frontend backend

# Parar y eliminar la pila
./scripts/stop-dev-fullstack.sh
```

Notas:
- Mantén `.env.development` fuera del control de versiones si contiene datos sensibles. El archivo creado contiene valores por defecto seguros para desarrollo local.
- Si Vite no hace HMR correctamente, asegúrate de que el script `dev` en `frontend/package.json` acepte `--host` (ya se añade en `docker-compose.dev.yml`).


## Modo 2 — Despliegue Nativo en Debian 12 (sin Docker)

Resumen: instalar dependencias del sistema, Node.js con nvm, Rust (rustup), PostgreSQL y Redis; crear la base de datos y usuario; configurar `.env`; ejecutar backend, frontend y compilar/ejecutar Tauri.

### A) Instalar prerrequisitos del sistema (una sola línea)

```bash
sudo apt-get update && sudo apt-get install -y build-essential curl git \
  libwebkit2gtk-4.0-dev libssl-dev libgtk-3-dev libayatana-appindicator3-dev \
  librsvg2-dev ca-certificates gnupg lsb-release postgresql postgresql-contrib \
  redis-server pkg-config libdbus-1-dev libwebkit2gtk-4.0-dev
```

Nota: `libwebkit2gtk-4.0-dev` y demás son necesarias para compilar y ejecutar aplicaciones Tauri que usan WebKitGTK.

### B) Node.js (nvm)

```bash
# Instalar nvm
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash

# Cargar nvm en la sesión actual
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instalar la última LTS
nvm install --lts
nvm use --lts
node -v
npm -v
```

### C) Rust (rustup)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
export PATH="$HOME/.cargo/bin:$PATH"
rustup default stable
rustc --version
cargo --version
```

Opcional:

```bash
cargo install tauri-cli --locked
```

### D) PostgreSQL y Redis — iniciar y habilitar

```bash
sudo systemctl enable --now postgresql
sudo systemctl enable --now redis-server
sudo systemctl status postgresql --no-pager
sudo systemctl status redis-server --no-pager
```

### E) Crear usuario y base de datos PostgreSQL

```bash
sudo -u postgres psql <<'SQL'
CREATE USER meta_user WITH PASSWORD 'meta_password';
CREATE DATABASE meta_ad_studio_db OWNER meta_user;
GRANT ALL PRIVILEGES ON DATABASE meta_ad_studio_db TO meta_user;
\q
SQL
```

Importante: reemplaza `meta_password` por una contraseña segura.

### F) Clonar el repositorio y preparar `.env`

```bash
git clone https://github.com/Davicho861/Meta-Ad-Studio-.git ~/Davicho861/Meta-Ad-Studio-
cd ~/Davicho861/Meta-Ad-Studio-

if [ -f .env.example ]; then
  cp .env.example .env
  echo "Se copió .env.example -> .env, revisa y ajusta variables."
else
  cat > .env <<'EOF'
DATABASE_URL=postgresql://meta_user:meta_password@localhost:5432/meta_ad_studio_db
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3000
# Añade otras variables requeridas por tu proyecto...
EOF
  echo "Se creó .env básico. Edita .env con variables reales."
fi
```

### G) Ejecutar Backend

```bash
cd ~/Davicho861/Meta-Ad-Studio./src/backend || cd ~/Davicho861/Meta-Ad-Studio-
npm install
# Ejecutar migraciones si aplica (ej. Prisma)
npx prisma migrate deploy || true
# Iniciar
npm run dev
```

Nota: Ajusta comandos según el gestor de paquetes (pnpm/yarn) y herramientas ORM.

### H) Ejecutar Frontend

```bash
cd ~/Davicho861/Meta-Ad-Studio./src/frontend || cd ~/Davicho861/Meta-Ad-Studio-
npm install
npm run dev
```

### I) App de Escritorio (Tauri)

Modo desarrollo:

```bash
cd ~/Davicho861/Meta-Ad-Studio-
npm install
npm run tauri dev
```

Modo producción (paquete .deb):

```bash
npm run tauri build
# Resultado típico: src-tauri/target/release/bundle/deb/
```

### J) Notas finales y seguridad

- No comites archivos `.env` ni secrets al repositorio.
- Para no usar sudo con Docker: `sudo usermod -aG docker $USER` y reinicia sesión.
- No uses `docker compose down -v` en producción si no quieres perder datos.
- Revisa `docker-compose.yml` y `package.json` para ajustes de puertos y scripts.

---

## Estado y pasos siguientes

- Los scripts `start-docker.sh` y `stop-docker.sh` se han añadido en la raíz del repo.
- Para hacerlos ejecutables:

```bash
chmod +x start-docker.sh stop-docker.sh
```

- Si quieres, puedo crear un commit con estos archivos o generar un PR; ahora no se realizó commit por petición.

---

Fin de la guía.
# Documentación de despliegue (avanzado)

Este archivo contiene la documentación técnica detallada para desplegar Meta Ad Studio manualmente o para depuración.

Contenido resumido:

- Requisitos: gcloud CLI, Terraform, cuenta con facturación habilitada.
- Comandos comunes de gcloud:

  - Configurar proyecto:
    gcloud config set project PROJECT_ID

  - Habilitar APIs necesarias:
    gcloud services enable run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com cloudbuild.googleapis.com compute.googleapis.com --project PROJECT_ID

  - Crear/actualizar secretos:
    printf "%s" "VALUE" | gcloud secrets create SECRET_NAME --data-file=- --project PROJECT_ID
    printf "%s" "VALUE" | gcloud secrets versions add SECRET_NAME --data-file=- --project PROJECT_ID

- Terraform (en directorio `terraform`):

  terraform init
  terraform plan -var="project_id=PROJECT_ID" -var="region=REGION"
  terraform apply -var="project_id=PROJECT_ID" -var="region=REGION"

- Cloud Build:

  gcloud builds submit --config cloudbuild.yaml --project PROJECT_ID

Depuración y notas:

- Si el directorio `terraform` no existe, el script `deploy.sh` saltará esa fase. Puedes ejecutar Terraform manualmente desde `terraform/`.
- Asegúrate de que tu cuenta tenga permisos suficientes (Owner o Editor y poder crear servicios, proyectos, secret manager y SQL).
- Recomendación de seguridad: Usa una cuenta de servicio con permisos limitados para producción y rota las claves regularmente.

Si necesitas personalizar variables de Terraform, edita `terraform/terraform.tfvars` o pásalas en la línea de comandos.
