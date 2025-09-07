# TROUBLESHOOTING — Meta-Ad-Studio Dev Environment

Este documento recoge problemas detectados durante el despliegue y las soluciones aplicadas por el "Guardián".

## 1) Nombres de proyecto de Docker Compose y tags inválidos
- Problema: El nombre del directorio del repo tenía caracteres que producían un tag inválido como `meta-ad-studio-_frontend` al construir imágenes.
- Solución: Normalizar `COMPOSE_PROJECT_NAME` en `scripts/start-dev-fullstack.sh` y en `guardian-script.sh` para producir un nombre seguro (minúsculas y `_` como separador). Esto previene tags inválidos.

## 2) Error de build del frontend relacionado con Storybook
- Problema: Durante la construcción la presencia de archivos `.stories.*` causaba errores de tipos porque las dependencias dev de storybook no estaban instaladas en la imagen de producción.
- Soluciones aplicadas:
  - Para builds de imagen de producción se eliminaron temporalmente los archivos `.stories.*` dentro del Dockerfile durante la etapa de build.
  - Para desarrollo, se creó `frontend/Dockerfile.dev` que instala `devDependencies` y ofrece un entorno consistente para Vite.

## 3) Error de tipos de `@types/bcrypt`
- Problema: `@types/bcrypt@^5.0.3` no estaba disponible en el registro, lo que hacía fallar `npm install` dentro del contenedor.
- Solución: Añadir una declaración ambient permanente `backend/bcrypt.d.ts` con `declare module 'bcrypt';` para evitar errores de TypeScript. Alternativamente, considerar migrar a `bcryptjs` o fijar versiones válidas en package.json.

## 4) Conflictos de puertos (host)
- Problema: El host ya tenía servicios escuchando en puertos estándar (5432, 6379...), lo que impedía que Docker compose enlazara esos puertos.
- Solución aplicada: Durante el despliegue automático se detectan puertos en uso y el Guardian detiene el despliegue hasta que se resuelvan. Como remedio temporal, se remapearon los puertos en `docker-compose.dev.yml` a 5433 (db) y 6380 (redis) para permitir despliegues locales sin afectar servicios del host.
- Recomendación: Liberar/stop services del host o consolidar puertos en la documentación del proyecto.

## 5) Recomendaciones generales
- Mantener un `package-lock.json` sincronizado en cada paquete para garantizar builds reproducibles.
- Usar Node 20+ en imágenes de desarrollo cuando se utilicen dependencias que requieren versiones recientes de Node (e.g., Vite v7).
- Añadir un pequeño test de smoke en CI que arranque `docker-compose.dev.yml` y verifique healthchecks.

