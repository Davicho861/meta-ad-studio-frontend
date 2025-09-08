Título: chore(ui): accessibility & interaction audit fixes — PromptBar / ResultCard / GenerationGrid

Resumen
Implementa mejoras de accesibilidad, gestión de foco y reducción de motion en componentes clave (PromptBar, GenerationGrid, ResultCard). Añade helpers `VisuallyHidden` y `ActionIcon` y documenta la auditoría en `docs/ui-audit.md`.

Extracto de `docs/ui-audit.md` (contexto)

# Auditoría UI — Meta Ad Studio (Midjourney-style)

Fecha: 2025-09-08

Resumen ejecutiva
- Objetivo: clonar la experiencia e interfaz tipo Midjourney (visual, interacción y micro-animaciones) dentro de `meta-ad-studio`.
- Estado: auditoría realizada, tokens extraídos y ajustes de accesibilidad y foco aplicados a componentes clave. Este documento resume hallazgos, decisiones y el roadmap de implementación.

Hallazgos por componente (resumen)
- `PromptBar` / `PromptBarV2`:
  - Falta de labels y status accesible para lectores de pantalla — corregido: añadidos `label` oculto, `aria-label` y `role=status` con `aria-live`.
  - Botón de generar ahora expone `aria-pressed` y soporte `motion-reduce` para spinner.

- `GenerationGrid`:
  - Grid responsive con animación escalonada y placeholders accesibles: wrappers con `tabIndex=0` y `aria-live='polite'` para cambios de estado.

- `ResultCard` / `ResultCardV2`:
  - Overlays con acciones rápidas en hover; no accesibles por teclado originalmente — corregido: `tabIndex=0`, `focus-within` estilos, icon buttons convertidos a `ActionIcon` con `aria-label`.
  - Animaciones y transformaciones ahora respetan `prefers-reduced-motion`.

Cambios de código aplicados (archivos modificados/añadidos)
- Modificados:
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/PromptBar.tsx`
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/PromptBarV2.tsx`
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/GenerationGrid.tsx`
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/ResultCard.tsx`
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/ResultCardV2.tsx`
- Añadidos:
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/ui/VisuallyHidden.tsx`
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/ui/ActionIcon.tsx`

Cómo aplicar estos cambios (dos opciones seguras)
1) Usando el bundle (recomendado si tienes acceso al repo remoto):
   - Copiar `/tmp/meta-verse-visualizer-chore-ui-accessibility-audit.bundle` al host con el repo remoto.
   - En el clone remoto:

     git fetch /ruta/al/bundle +refs/heads/*:refs/remotes/temp/*
     git checkout -b chore/ui-accessibility-audit temp/chore/ui-accessibility-audit
     git push origin chore/ui-accessibility-audit

2) Usando el patch:
   - En el clone remoto:

     git am /ruta/al/patch/meta-verse-visualizer-chore-ui-accessibility-audit.patch
     git push origin HEAD:chore/ui-accessibility-audit

PR Body sugerido
- Título: chore(ui): accessibility & interaction audit fixes — PromptBar / ResultCard / GenerationGrid
- Descripción: Implementa mejoras de accesibilidad y experiencia, añade helpers, y documenta la auditoría. Ver `docs/ui-audit.md` para contexto y pruebas.
- Checklist para revisores:
  - Revisar keyboard navigation y focus states
  - Validar `aria-live` y anuncios para screenreaders
  - Comprobar reduced-motion behavior
  - Ejecutar linter y tests

Notas
- No realicé cambios en el repo padre. Creé un repo Git independiente local en `src/frontend/packages/meta-verse-visualizer-main` y generé los artefactos en `/tmp`.
- Si prefieres que intente reparar el submódulo para push directo desde este host, confirma y procederé (recomendación: hacer backup y coordinar porque toca `.git/modules`).

Next: Validación final (linter/tests) — en progreso.
