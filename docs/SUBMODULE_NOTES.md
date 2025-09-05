Nota sobre el frontend (ahora submódulo)

El directorio `frontend` fue convertido a un submódulo Git.

Para clonar el repositorio con el submódulo:

- Clonar incluyendo submódulos:
  git clone --recurse-submodules <repo-url>
- Si ya clonaste sin submódulos:
  git submodule update --init --recursive
- Para traer cambios del submódulo:
  cd frontend && git fetch origin && git pull

Evita editar directamente el submódulo desde el repo padre. Haz cambios dentro de `frontend/`, crea commits allí y empuja al remoto del submódulo.
