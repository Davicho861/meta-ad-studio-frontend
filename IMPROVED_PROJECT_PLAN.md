# Plan de Proyecto Mejorado: Meta Studio Ad Studio App SPA

## 1. Resumen Ejecutivo

Este documento detalla el plan de proyecto para la implementación de las mejoras identificadas en `FINAL_REPORT.md` y estructuradas en `PLAN_DE_ACCION_Y_MEJORAS.md`. El objetivo es ejecutar un conjunto de acciones correctivas y de optimización de forma iterativa, segura y medible, asegurando la estabilidad y escalabilidad del sistema.

## 2. Cronograma General y Fases

| Fase                                      | Responsable Principal | Timeline Estimado |
| :---------------------------------------- | :-------------------- | :---------------- |
| **1. Planificación y Diseño**             | Project Manager       | Semanas 1-2       |
| **2. Desarrollo e Implementación**        | Tech Lead             | Semanas 2-4       |
| **3. Manejo de Incidentes y Resiliencia** | DevOps Team           | Semanas 4-6       |
| **4. Despliegue Local Optimizado**        | DevOps Team           | Semanas 6-8       |
| **5. Pruebas y Calidad**                  | QA Lead               | Semanas 8-10      |
| **6. Monitoreo y Mejoras Futuras**        | SRE Team              | Continuo          |

---

## 3. Detalle por Fases

### Fase 1: Planificación y Diseño (Semanas 1-2)

**Objetivo:** Establecer una base sólida para el proyecto, actualizando la planificación, refinando el diseño de la API y optimizando la configuración de la interfaz de usuario.

| Acción                                     | Hitos Clave                                                              | Responsable       | Estado      |
| :----------------------------------------- | :----------------------------------------------------------------------- | :---------------- | :---------- |
| **1.1. Actualizar Plan de Proyecto**       | - Plan de proyecto aprobado por stakeholders.<br>- Hitos y timelines definidos. | Project Manager   | [ ] Pendiente |
| **1.2. Refinar Diseño de API (`openapi.yaml`)** | - Especificación OpenAPI validada sin errores.<br>- Documentación de endpoints completa. | Backend Team      | [ ] Pendiente |
| **1.3. Optimizar UI (`tailwind.config.ts`)** | - Conflictos de alias de importación resueltos.<br>- Configuración de rutas validada. | Frontend Team     | [ ] Pendiente |

**Métricas de Éxito:**
- Cero errores de validación en `openapi.yaml`.
- 100% de reducción de errores de build relacionados con alias de importación.

### Fase 2: Desarrollo e Implementación (Semanas 2-4)

**Objetivo:** Abordar la deuda técnica, mejorar la calidad del código y optimizar el proceso de construcción.

| Acción                                       | Hitos Clave                                                                 | Responsable   | Estado      |
| :------------------------------------------- | :-------------------------------------------------------------------------- | :------------ | :---------- |
| **2.1. Resolver Dependencias (`package.json`)** | - `npm audit` sin vulnerabilidades críticas.<br>- `package-lock.json` actualizado y consistente. | Tech Lead     | [ ] Pendiente |
| **2.2. Integrar Auditorías de Código**       | - `eslint.config.js` configurado y aplicado.<br>- Pipeline de CI incluye paso de linting. | Backend/Frontend Teams | [ ] Pendiente |
| **2.3. Optimizar Builds Locales**            | - Script de build local (`scripts/run-dev.sh`) mejorado.<br>- Tiempo de build reducido. | DevOps Team   | [ ] Pendiente |

**Métricas de Éxito:**
- Reducción del 100% de vulnerabilidades críticas.
- Tiempo de build local reducido en un 30%.

### Fase 3: Manejo de Incidentes y Resiliencia (Semanas 4-6)

**Objetivo:** Aumentar la resiliencia del sistema mediante la implementación de planes de diagnóstico y chequeos automáticos.

| Acción                                            | Hitos Clave                                                                    | Responsable   | Estado      |
| :------------------------------------------------ | :----------------------------------------------------------------------------- | :------------ | :---------- |
| **3.1. Implementar Planes de Resiliencia**        | - Procedimientos de `RESOLUTION_AND_RESILIENCE_PLAN.md` integrados en runbooks. | SRE Team      | [ ] Pendiente |
| **3.2. Automatizar Chequeos (Cuotas/AppArmor)**   | - Script `scripts/check_system_health.sh` creado y funcional.<br>- Alertas configuradas. | DevOps Team   | [ ] Pendiente |
| **3.3. Actualizar `GLOBAL_INCIDENT_POST_MORTEM.md`** | - Plantilla de post-mortem creada.<br>- Análisis de incidentes previos documentado. | SRE Team      | [ ] Pendiente |

**Métricas de Éxito:**
- MTTR (Tiempo Medio de Recuperación) reducido en un 25%.
- Cero incidentes causados por agotamiento de cuotas o mala configuración de AppArmor.

### Fase 4: Despliegue Local Optimizado (Semanas 6-8)

**Objetivo:** Agilizar y robustecer el proceso de despliegue en entornos locales.

| Acción                                           | Hitos Clave                                                                    | Responsable   | Estado      |
| :----------------------------------------------- | :----------------------------------------------------------------------------- | :------------ | :---------- |
| **4.1. Optimizar `deploy_local.sh`**             | - El script permite builds desde fuente local.<br>- Proceso de despliegue documentado. | DevOps Team   | [ ] Pendiente |
| **4.2. Integrar Dashboard "Mission Control"**    | - `index.html` muestra métricas básicas de estado.<br>- Conexión con logs de la aplicación. | Frontend Team | [ ] Pendiente |
| **4.3. Crear Guía de Despliegue Docker**         | - Documento `docs/DOCKER_DEPLOYMENT.md` creado.<br>- `docker-compose.yml` verificado. | DevOps Team   | [ ] Pendiente |
| **4.4. Mejorar `pre-deployment-check.sh`**       | - Script incluye validación de variables de entorno y conectividad.            | DevOps Team   | [ ] Pendiente |

**Métricas de Éxito:**
- Tiempo de despliegue local reducido en un 40%.
- 90% de reducción de fallos de despliegue debido a errores de configuración.

### Fase 5: Pruebas y Calidad (Semanas 8-10)

**Objetivo:** Elevar la calidad del software a través de una estrategia de pruebas robusta y automatizada.

| Acción                                       | Hitos Clave                                                                    | Responsable | Estado      |
| :------------------------------------------- | :----------------------------------------------------------------------------- | :---------- | :---------- |
| **5.1. Corregir Configuraciones de Pruebas** | - `cypress.config.cjs` y `jest.config.js` corregidos.<br>- Todas las suites de pruebas ejecutan sin errores. | QA Team     | [ ] Pendiente |
| **5.2. Aumentar Cobertura de Pruebas**       | - Reporte de cobertura generado.<br>- Nuevas pruebas unitarias y de integración implementadas. | Backend/Frontend Teams | [ ] Pendiente |
| **5.3. Integrar CI/CD Local**                | - Pipeline local en `ci-cd/` ejecuta pruebas en cada commit.<br>- Notificaciones de fallo configuradas. | DevOps Team | [ ] Pendiente |
| **5.4. Incorporar Pruebas de Seguridad**     | - Herramienta SAST (ej. Trivy) integrada en el pipeline.<br>- Escaneo de vulnerabilidades automatizado. | Security Team | [ ] Pendiente |

**Métricas de Éxito:**
- Cobertura de código superior al 80%.
- Cero vulnerabilidades críticas detectadas por el pipeline de CI/CD.

### Fase 6: Monitoreo y Mejoras Futuras (Continuo)

**Objetivo:** Garantizar la observabilidad del sistema y planificar su evolución a largo plazo.

| Acción                                       | Hitos Clave                                                                    | Responsable | Estado      |
| :------------------------------------------- | :----------------------------------------------------------------------------- | :---------- | :---------- |
| **6.1. Extender Dashboards de Monitoreo**    | - Métricas de rendimiento (CPU, memoria, latencia) visibles en "Mission Control". | SRE Team    | [ ] Pendiente |
| **6.2. Desarrollar Plan de Migración a Cloud** | - Documento de estrategia de migración creado.<br>- Análisis de costos y beneficios completado. | SRE/DevOps Team | [ ] Pendiente |
| **6.3. Establecer Proceso de Best Practices**| - Política de revisión de código por pares definida.<br>- Proceso de actualización de dependencias programado. | Tech Lead   | [ ] Pendiente |

**Métricas de Éxito:**
- Disponibilidad del sistema > 99.9%.
- Tiempo de respuesta de la API < 200ms.
