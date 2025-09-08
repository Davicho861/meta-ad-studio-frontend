# Auditoría UI — Meta Ad Studio (Midjourney-style)

Fecha: 2025-09-08

Resumen ejecutiva
- Objetivo: clonar la experiencia e interfaz tipo Midjourney (visual, interacción y micro-animaciones) dentro de `meta-ad-studio`.
- Estado: auditoría realizada, tokens extraídos y ajustes de accesibilidad y foco aplicados a componentes clave. Este documento resume hallazgos, decisiones y el roadmap de implementación.

1) Inventario de tokens (extracto)
- Variables CSS (HSL) principales (archivo): `src/frontend/packages/meta-verse-visualizer-main/src/index.css`
  - --background: 220 15% 8%
  - --foreground: 210 40% 98%
  - --surface: 220 15% 12%
  - --surface-elevated: 220 15% 16%
  - --primary / --primary-foreground
  - --secondary / --secondary-foreground
  - --muted / --muted-foreground
  - --accent / --accent-foreground
  - --executive-blue: 200 100% 50% (neón, #00AFFF)
  - --radius: 0.75rem
  - Gradientes: --gradient-primary, --gradient-gold, --gradient-surface, --gradient-hover
  - Sombras: --shadow-premium, --shadow-card, --shadow-glow

- Token mapping en `tailwind.config.ts` (paquete `meta-verse-visualizer-main`): colores semánticos (background, surface, card, sidebar, executive-blue) y alias útiles (`surface-dark`, `primary-text`, `secondary-text`, `accent-blue`, `accent-purple`).

2) Hallazgos por componente (resumen)
- `PromptBar` / `PromptBarV2`:
  - Buen uso de tokens (`bg-surface-dark`, `text-primary-text`, `focus:ring-accent-blue`).
  - Falta de labels y status accesible para lectores de pantalla — corregido: añadidos `label` oculto, `aria-label` y `role=status` con `aria-live`.
  - Botón de generar ahora expone `aria-pressed` y soporte `motion-reduce` para spinner.

- `GenerationGrid`:
  - Grid responsive con animación escalonada (`animate-fade-in-up`).
  - Placeholders accesibles: wrappers con `tabIndex=0` y `aria-live='polite'` para cambios de estado.

- `ResultCard` / `ResultCardV2`:
  - Overlays con acciones rápidas en hover; no accesibles por teclado originalmente — corregido: `tabIndex=0`, `focus-within` estilos, icon buttons convertidos a `ActionIcon` con `aria-label`.
  - Animaciones y transformaciones ahora respetan `prefers-reduced-motion` via utilidades Tailwind (`motion-reduce:`).

3) Cambios de código aplicados (archivos modificados/añadidos)
- Modificados:
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/PromptBar.tsx` — labels/ARIA/status
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/PromptBarV2.tsx` — labels/ARIA
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/GenerationGrid.tsx` — focus/aria-live wrappers
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/ResultCard.tsx` — tabIndex, ActionIcon
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/ResultCardV2.tsx` — reescritura válida + accesibilidad + job polling handling
- Añadidos:
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/ui/VisuallyHidden.tsx`
  - `src/frontend/packages/meta-verse-visualizer-main/src/components/ui/ActionIcon.tsx`

4) Roadmap de implementación (prioridades y tareas)

Fase A — Tokens & Base (Prioridad Alta, 1-2 días):
- Acción A1: Consolidar tokens semánticos en un único archivo de diseño (ya existe `index.css` y `tailwind.config.ts`). Verificar uso consistente y documentar tokens faltantes.
- Acción A2: Añadir tests de snapshots visuales básicos para `ResultCard` y `PromptBar` (Vitest + @testing-library/react + jest-image-snapshot opcional).

Fase B — Componente Core (Prioridad Alta, 2-4 días):
- Acción B1: Estandarizar `ResultCard`/`ResultCardV2` en un único componente base con variantes (loading/thumbnail/hover-actions).
- Acción B2: Hacer que todas las acciones de tarjetas estén disponibles por teclado y desde menús contextuales (role/menu/aria-haspopup cuando aplique).

Fase C — Interacciones & Micro-animaciones (Prioridad Media, 2-3 días):
- Acción C1: Implementar glow y efectos de neón para hover usando `--shadow-glow` y `dimensional-pulse`; parametrizar intensidad por token.
- Acción C2: Respetar `prefers-reduced-motion` en todas las animaciones; añadir control global en settings.

Fase D — QA visual y Pixel-compare (Prioridad Media, 2-4 días):
- Acción D1: Crear colección de capturas de referencia de la UI objetivo (Midjourney) y generar tests de comparación visual (tooling: Percy / Playwright + image comparison / Chromatic).

Fase E — Pulido y Release (Prioridad Baja, 1-2 días):
- Acción E1: Documentación final, checklist de accesibilidad y PRs de hardening (husky/linting) si hace falta.

5) Tareas de desarrollo (lista accionable — ready to pick)
- T1: Consolidar tokens y agregar `README` de tokens (archivo: `src/frontend/packages/meta-verse-visualizer-main/src/index.css`) — Criterio: listado de tokens con hex/HSL y ejemplos de uso.
- T2: Refactor `ResultCard` en componente base + variantes — Criterio: Un solo componente exportado, tests unitarios que cubren loading/complete/hover states.
- T3: Añadir pruebas accesibilidad automatizadas (axe-core/ jest-axe) en componentes críticos — Criterio: no bloquear PR si axe detecta >0 violations en componentes corregidos.
- T4: Integrar comparador visual (Playwright snapshot) y añadir job en CI para visual diffs — Criterio: pipelines con job opcional `visual-regression`.

6) Checklist de QA antes de merge
- Run lint: `pnpm -w -s --filter ./src/frontend/packages/meta-verse-visualizer-main lint`
- Run tests: `pnpm -w -s --filter ./src/frontend/packages/meta-verse-visualizer-main test`
- Manual smoke: navegar a la página Overview/Explore, verificar foco en tarjetas y comportamiento keyboard.

7) Notas y recomendaciones
- Se aplicaron cambios de bajo riesgo directo en componentes presentados. Recomiendo abrir PRs pequeños (máx 1-2 componentes por PR) para revisión y QA.
- Para lograr una réplica *pixel-perfect* habrá trabajo adicional de CSS/gradientes y tests visuales automatizados — estimación 2-3 semanas para paridad completa dependiendo del nivel de detalle.

---
Generado automáticamente por la auditoría en repo local. Si quieres que cree los PRs y ejecute los checks (lint/tests/build) dentro de este entorno, indícalo y los ejecutaré. 
