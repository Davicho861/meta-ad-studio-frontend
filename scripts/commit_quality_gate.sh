#!/usr/bin/env bash
set -euo pipefail

# Script de ayuda para commitear y pushear los cambios de Quality Gate
# Uso: ./scripts/commit_quality_gate.sh

ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

# Verificar que estamos dentro de un repositorio git
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: Este directorio no parece ser un repositorio git. Ejecuta este script desde la copia local del repo con .git inicializado." >&2
  exit 2
fi

BRANCH=chore/ui-accessibility-audit

# Comprobar estado limpio
if [ -n "$(git status --porcelain)" ]; then
  echo "Hay cambios no commiteados en el working tree. Por favor stash/commit/clean antes de ejecutar este script." >&2
  git status --porcelain
  exit 3
fi

# Crear branch si no existe
if git show-ref --verify --quiet refs/heads/$BRANCH; then
  echo "Branch $BRANCH ya existe localmente. Haré checkout a él.";
  git checkout $BRANCH
else
  git checkout -b $BRANCH
fi

# Añadir archivos concretos (seguro)
git add .github/workflows/quality-gate.yml tests/e2e docs/reports/MIDJOURNEY_FIDELITY_AUDIT.md README.dev.md tests/e2e/package.json tests/e2e/cypress.config.cjs tests/e2e/tests/cypress/support/e2e.js tests/e2e/cypress/e2e/metaverse-ui.cy.js

# Generar commit
git commit -m "chore(ci): add quality-gate workflow (axe, cypress e2e, build) and midjourney fidelity audit"

# Push al remoto
git push --set-upstream origin $BRANCH

echo "Push completado en branch $BRANCH. Abre un Pull Request en GitHub para iniciar las checks de CI."
