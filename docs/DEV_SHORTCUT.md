Meta-Ad Studio — Acceso directo de desarrollo (Dev)

Resumen
-------
Este documento explica el acceso directo "Meta-Ad Studio (Dev)" instalado por `setup_dev_shortcut.sh`.

Qué hace al hacer clic
----------------------
1. Ejecuta `docker compose` para construir y levantar la pila (servicios: postgres, redis, api, frontend, etc.).
2. Abre una terminal que, si es necesario, ejecutará el comando para iniciar Vite en modo desarrollo (Hot Reload) dentro del directorio:

   ~/Davicho861/Meta-Ad-Studio-/src/frontend/meta-verse-visualizer-main

   Comando que ejecutará la terminal (si todo está correcto):

   npm install --silent && npm run dev -- --host

3. Intenta abrir en el navegador la primera URL disponible entre:
   - http://localhost:5173
   - http://localhost:5174
   - http://localhost:8082

Comportamiento seguro y razones
------------------------------
- Por seguridad y fiabilidad, la solución abre una terminal gráfica para ejecutar Vite en modo dev en el host. Muchos procesos Node/Vite requieren un TTY interactivo y la instalación de dependencias puede pedir confirmación; por eso preferimos abrir una terminal visible en lugar de ejecutar silenciosamente en background.
- Si tu entorno ya tiene un contenedor `frontend` corriendo en modo dev (detected by docker compose dev), el lanzador usará ese servicio en vez de ejecutar Vite en host.

Fallos comunes y soluciones rápidas
----------------------------------
- Si después de hacer clic el navegador se abre en una versión estática (p.ej. `http://localhost:8082`) y los cambios guardados no aparecen automáticamente:
  1. Busca la terminal que el lanzador abrió.
  2. En esa terminal ejecuta manualmente:

     cd ~/Davicho861/Meta-Ad-Studio-/src/frontend/meta-verse-visualizer-main
     npm install --silent
     npm run dev -- --host

  3. Abre http://localhost:5173 en el navegador (o espera que el lanzador lo abra automáticamente una vez Vite esté listo).

Comandos de verificación
------------------------
- Ver si el lanzador existe:
  ls -l ~/.local/share/applications/meta-ad-studio-dev.desktop

- Ver script de lanzamiento:
  ls -l ~/.local/bin/launch-meta-ad-studio-hot-reload.sh

- Levantar manualmente la pila completa:
  cd ~/Davicho861/Meta-Ad-Studio-
  make dev

Notas futuras / mejoras
-----------------------
- Para una experiencia completamente "un solo clic" sin terminales se puede:
  - Corregir y probar `docker-compose.dev.yml` y el servicio `frontend` para que el contenedor ejecute Vite en modo dev con puerto 5173 expuesto; o
  - Crear un `systemd --user` service que arranque Vite al iniciar sesión (requiere que las dependencias ya estén instaladas y persistencia del servicio).

Si quieres que implemente la opción totalmente automática (sin terminales), dime y lo dejo listo: corregiré el `docker-compose.dev.yml` y probaré el flujo hasta que HMR funcione con un solo clic.
