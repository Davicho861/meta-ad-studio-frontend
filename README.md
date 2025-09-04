# Meta Studio Ad Studio — Instalación y Uso (Debian 12)

Este documento explica cómo instalar y ejecutar la aplicación empaquetada para Debian 12.

## Requisitos Previos

- Debian 12 (amd64)
- Node.js v20.x (solo necesario si quieres compilar desde código fuente)
- npm (si compilas desde el código fuente)
- Un terminal con privilegios sudo para instalar el paquete .deb

## Configuración Inicial (Obtener token de Replicate)

1. Visita https://replicate.com y crea una cuenta o inicia sesión.
2. Ve a tu panel de usuario (Account → API tokens) y crea un nuevo token.
3. Crea un archivo `.env` en la raíz del proyecto (solo necesario si ejecutas desde fuente). Ejemplo:

REPLICATE_API_TOKEN=your_replicate_api_token_here

Nota: Si instalas con el .deb y usas la aplicación normal de escritorio, puedes exportar esta variable en tu entorno de usuario antes de lanzar la aplicación, o configurar un archivo en `~/.profile` o `~/.bashrc` como:

export REPLICATE_API_TOKEN="your_replicate_api_token_here"

Luego reinicia la sesión o ejecuta `source ~/.profile`.

## Instalación del paquete (.deb) en Debian 12

Se ha generado el instalador .deb en este proyecto. La ruta exacta y verificada es:

`/home/davicho/Documentos/Meta Studio Ad Studio App SPA/dist/vite_react_shadcn_ts_0.0.0_amd64.deb`

Para instalarlo en una máquina Debian 12, copia el archivo `.deb` al sistema de destino y ejecuta:

sudo dpkg -i /ruta/al/vite_react_shadcn_ts_0.0.0_amd64.deb

Si dpkg reporta dependencias faltantes, resuélvelas con:

sudo apt-get install -f

```markdown
# Meta Studio Ad Studio — Instalación y Uso (Debian 12)

🚀 Entorno de Desarrollo Rápido (Docker)

Esta arquitectura está diseñada para ser autocontenida: el docker-compose levanta la API, la base de datos y el frontend para que cualquier desarrollador pueda quedar operativo con un solo comando.

Comandos esenciales:

- Levantar todo y validar por primera vez:

	chmod +x scripts/reset-and-run.sh && ./scripts/reset-and-run.sh

- Uso diario (levantar en segundo plano):

	docker-compose up -d

- Detener los servicios:

	docker-compose down

Notas:

- El script `scripts/reset-and-run.sh` ejecuta limpieza, reconstrucción, aplica migraciones vía Prisma y corre tests básicos.
- Ajusta la variable `<PUERTO_FRONTEND>` en el script o en tu entorno para reflejar el puerto real del frontend.
- Las credenciales y secretos (por ejemplo, claves para proveedores de IA) deben definirse en tu entorno o en un archivo `.env` cargado por `docker-compose`.

Más documentación y guías están disponibles en `docs/` y en los `README.md` de cada paquete.

#

El resto del documento explica cómo instalar y ejecutar la aplicación empaquetada para Debian 12.

## Requisitos Previos

- Debian 12 (amd64)
- Node.js v20.x (solo necesario si quieres compilar desde código fuente)
- npm (si compilas desde el código fuente)
- Un terminal con privilegios sudo para instalar el paquete .deb

## Configuración Inicial (Obtener token de Replicate)

1. Visita https://replicate.com y crea una cuenta o inicia sesión.
2. Ve a tu panel de usuario (Account → API tokens) y crea un nuevo token.
3. Crea un archivo `.env` en la raíz del proyecto (solo necesario si ejecutas desde fuente). Ejemplo:

REPLICATE_API_TOKEN=your_replicate_api_token_here

Nota: Si instalas con el .deb y usas la aplicación normal de escritorio, puedes exportar esta variable en tu entorno de usuario antes de lanzar la aplicación, o configurar un archivo en `~/.profile` o `~/.bashrc` como:

export REPLICATE_API_TOKEN="your_replicate_api_token_here"

Luego reinicia la sesión o ejecuta `source ~/.profile`.

## Instalación del paquete (.deb) en Debian 12

Se ha generado el instalador .deb en este proyecto. La ruta exacta y verificada es:

`/home/davicho/Documentos/Meta Studio Ad Studio App SPA/dist/vite_react_shadcn_ts_0.0.0_amd64.deb`

Para instalarlo en una máquina Debian 12, copia el archivo `.deb` al sistema de destino y ejecuta:

sudo dpkg -i /ruta/al/vite_react_shadcn_ts_0.0.0_amd64.deb

Si dpkg reporta dependencias faltantes, resuélvelas con:

sudo apt-get install -f

## Ejecutar la aplicación

Una vez instalado, la aplicación aparece en el menú de aplicaciones con el nombre "Meta Studio Ad Studio". Abre el lanzador de aplicaciones y busca "Meta Studio Ad Studio"; haz clic en el icono para lanzarla.

Si prefieres lanzarla desde terminal (para ver logs), ejecuta:

/opt/vite_react_shadcn_ts/vite_react_shadcn_ts

(La ruta del ejecutable puede variar; si el comando anterior no existe, busca el archivo ejecutable bajo `/opt` o usa `ps`/`journalctl` para identificar la entrada.)

## Notas de Seguridad y Privacidad

- El token de Replicate debe mantenerse privado. No lo incluyas en repositorios públicos.
- La aplicación almacena historial de generaciones en `~/.meta-ad-studio/history.json`.

## Reparación y Depuración Rápida

- Para reinstalar tras una actualización: repite `sudo dpkg -i` con el nuevo .deb y luego `sudo apt-get install -f` si es necesario.
- Logs de sistema: `journalctl --user -u vite_react_shadcn_ts` o revisa `~/.config` para directorios relacionados.

## Contacto

Para más ayuda, revisa la documentación del proyecto o abre un issue en el repositorio.

```
