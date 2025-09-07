# ROADMAP_AURA — Proyecto Aura

Resumen y roadmap completo para implementar el visualizador 3D integrado con el generador 2D.

## Fase I — Planificación y Diseño (1 semana)

- Definición del flujo de usuario principal (User Journey): Selección de escena → Ideación y creación → Resultados 2D → Transición → Inmersión 3D.
- Diseños UI/UX: "Creation Hub" y "Visualization Stage" con transiciones animadas.
- Arquitectura técnica: React + TypeScript + Three.js con @react-three/fiber y @react-three/drei. Componentes: `VisualizationStage` (lazy-loaded), `PromptBarV2`, `GenerationGrid`, `ResultCardV2`.

## Fase II — Desarrollo e Implementación (3 sprints de 1 semana)

Sprint 1 — Construcción del Escenario 3D Interactivo
- Crear `VisualizationStage` (Canvas, OrbitControls, loader GLTF)
- Integrar react-three-fiber y drei
- Cargar modelo GLB (times-square.glb)
- Controles de cámara y detección `main_billboard`

Sprint 2 — Perfeccionamiento del Generador 2D y Conexión a la API
- Hacer funcional PromptBarV2 (aspect ratio, estilo)
- Conectar a la API de generación (Replicate o servicio interno)
- Manejar estados y errores
- Añadir botón "Visualizar en Escenario 3D" en `ResultCardV2`

Sprint 3 — La Fusión — Integración 2D y 3D
- Transición animada CreationHub → VisualizationStage
- Pasar imageUrl y aplicar como textura dinámica a `main_billboard`
- Añadir animaciones y controles de pulido

## Fase III — Pruebas (continuo)

- Pruebas unitarias, de integración y E2E (Cypress)
- Pruebas de rendimiento: FPS y tiempos de carga de modelos
- Observabilidad: métricas modelLoadTime, textureApplyTime

## Fase IV — Despliegue (continuo)

- Usar Docker y CI/CD (cloudbuild / GitHub Actions)
- Pipeline: lint -> build -> unit tests -> e2e -> staging -> prod

## Backlog inicial (Sprint 1)

1. Crear `VisualizationStage.tsx` (skeleton)
2. Añadir placeholder GLB en `public/models/placeholder-scene.glb`
3. Modificar `ResultCardV2.tsx` para exponer botón de Visualización
4. Configurar scripts de build y validar compilación

## Entregables finales

- `VisualizationStage` skeleton y documentación de integración
- ROADMAP_AURA.md (este documento)
- Backlog y tickets para Sprints 1–3
- Pruebas de humo y scripts de despliegue

## Notas técnicas

- Contrato del componente `VisualizationStage`:
  - Props: `sceneId: string`, `imageUrl?: string`, `onClose?: () => void`, `env?: 'day'|'night'`
- Recomendaciones: servir modelos GLB optimizados y usar CDN para imágenes generadas.

---
Documento generado automáticamente por el plan de ejecución del Proyecto Aura.
