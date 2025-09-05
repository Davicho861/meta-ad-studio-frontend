# Operaciones: entornos segregados dev / prod

Resumen rápido:

- Levantar desarrollo (hot-reload):
  - docker-compose -f docker-compose.dev.yml up -d --build
  - UI dev: http://localhost:5173

- Levantar producción (build estático + nginx):
  - docker-compose -f docker-compose.prod.yml up -d --build
  - UI prod: http://localhost:8080

Comprobaciones rápidas:

- Ver estado: docker compose -f docker-compose.dev.yml ps
- Ver logs: docker compose -f docker-compose.dev.yml logs -f frontend

Notas:

- Asegúrate de exportar las variables de entorno sensibles (POSTGRES_PASSWORD, DATABASE_URL) fuera del repositorio.
- Ejecuta npm ci en `./frontend` localmente para actualizar package-lock.json si lo deseas antes de build.

Orquestador interactivo (guardian -> orchestrator)
-----------------------------------------------

Se ha evolucionado el script `guardian-script.sh` a un Orquestador de Entorno Interactivo. Ahora el acceso directo del escritorio que lanza este script actúa como un "Panel de Control" para el entorno `meta_ad_studio`.

Comportamiento principal:

- Si no hay contenedores en ejecución: el orquestador realiza un `git pull`, `git submodule update --init --recursive` (no fallará si no hay submódulos) y ejecuta `docker-compose -f docker-compose.dev.yml up -d --build`.
- Si los contenedores ya están en ejecución: el orquestador muestra un menú interactivo en la terminal con opciones para ver logs en tiempo real, reiniciar servicios o detenerlos (down). Esto evita que el script se cierre ante conflictos y te da control directo.

Uso desde el icono de escritorio:

El archivo `.desktop` configurado para lanzar el script en una terminal seguirá funcionando como antes. Al hacer clic en el icono, se abrirá una terminal que ejecutará `guardian-script.sh` y, si detecta servicios en ejecución, mostrará el menú interactivo.

Comandos útiles del orquestador:

```
docker-compose -p meta_ad_studio -f docker-compose.dev.yml ps
docker-compose -p meta_ad_studio -f docker-compose.dev.yml logs -f
docker-compose -p meta_ad_studio -f docker-compose.dev.yml restart
docker-compose -p meta_ad_studio -f docker-compose.dev.yml down
```

Notas de seguridad:

- El orquestador no modifica archivos .desktop ni cambia políticas del sistema. Asegúrate de que el acceso directo lance el script en una terminal para poder interactuar con el menú.
