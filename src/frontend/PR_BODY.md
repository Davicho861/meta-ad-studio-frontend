PR: UI — Midjourney-Fidelity (feat/midjourney-ui)

Resumen

Esta PR actualiza la UI del frontend para adoptar la especificación "Midjourney-Fidelity" y contiene los siguientes cambios principales:

- ResultCard: refactor para reproducción en hover (muted, loop), overlay con acciones, estados (generating, completed, error).
- ResultsGrid: nuevo componente con layout tipo "masonry" (CSS columns) y stories.
- TopBar: nuevo componente que reemplaza Sidebar + PromptBar en la vista principal (barra de búsqueda y filtros superiores).
- Stories: nuevas historias para ResultCard y ResultsGrid; story con video de prueba.
- Tests: test básico para ResultCard hover (smoke test).
- Actualización del submódulo `frontend` para apuntar a la rama `feat/midjourney-ui`.

Archivos clave

- frontend/src/components/ResultCard.tsx (refactor)
- frontend/src/components/ResultsGrid.tsx (nuevo)
- frontend/src/components/TopBar.tsx (nuevo)
- frontend/src/components/ResultCard.stories.tsx (actualizada)
- frontend/src/components/ResultsGrid.stories.tsx (nuevo)
- frontend/src/components/__tests__/ResultCard.test.tsx (nuevo)
- frontend/DESIGN_SPEC.md (actualizado a v2.0 Midjourney-Fidelity)

Cómo probar localmente

1. Entrar al subdirectorio frontend e instalar dependencias si es necesario:

```bash
cd frontend
npm install
```

2. Ejecutar tests:

```bash
npm test -- --watchAll=false
```

3. Levantar Storybook (recomendado para validar hover/autoplay):

```bash
npm run storybook
```

Notas y consideraciones

- El branch del submódulo `frontend` creado es `feat/midjourney-ui` (ya empujado al remote del submódulo).
- En el repo principal se creó la rama `feat/midjourney-ui-submodule` que actualiza la referencia del submódulo; abrir PR desde esa rama.
- Algunas pruebas visuales requieren Storybook en un navegador real para validar autoplay y overlays.

Checklist

- [ ] Revisar diseño y accesibilidad (contraste, tabbable)
- [ ] Revisar performance de reproducción en hover (lazy load / preloading)
- [ ] Añadir tests visuales en Chromatic o Storybook snapshot si procede
- [ ] PR description y reviewers

