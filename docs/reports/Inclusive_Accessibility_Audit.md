# Auditoría Simulada de Accesibilidad Inclusiva: "Semillas de Cambio"

**Fecha de Auditoría:** 2025-08-31

## 1. Resumen Ejecutivo

Esta auditoría evalúa la accesibilidad de la experiencia VR/AR/MR "Semillas de Cambio" contra los principios de las Pautas de Accesibilidad para el Contenido Web (WCAG), adaptados a un entorno inmersivo. El objetivo es identificar barreras para usuarios con discapacidades y proponer mejoras concretas. Si bien la experiencia es visualmente rica, se han identificado áreas críticas de mejora en los ámbitos visual, auditivo y motor. La implementación de las recomendaciones no solo ampliará la base de usuarios potenciales, sino que también posicionará a la plataforma como líder en diseño inclusivo en el metaverso.

## 2. Alcance de la Auditoría

-   **Aplicación:** "Semillas de Cambio" (según `VR_AR_Sustainability_Experience_Script.md`).
-   **Plataformas:** VR (Headsets genéricos), AR (Dispositivos móviles), MR (HoloLens/Magic Leap).
-   **Estándar de Referencia:** Principios de WCAG 2.1 (Perceptible, Operable, Comprensible, Robusto).

## 3. Evaluación de Accesibilidad por Principio WCAG

---

### **Principio 1: Perceptible**
*La información y los componentes de la interfaz de usuario deben ser presentables a los usuarios de formas que puedan percibir.*

| Criterio | Hallazgo | Recomendación | Prioridad |
| :--- | :--- | :--- | :--- |
| **Alternativas Textuales** | La guía "GAIA" y las instrucciones de las tareas se presentan principalmente de forma visual y auditiva. No existen alternativas para usuarios sordociegos. | Implementar una API de texto a Braille para pantallas de Braille conectadas. Toda la narración de GAIA debe tener una transcripción de texto disponible en la interfaz. | Alta |
| **Contraste de Color** | La interfaz holográfica (e.g., "Tareas de Restauración") puede tener bajo contraste contra ciertos fondos del mundo real en modo AR/MR. | Ofrecer modos de alto contraste para la interfaz (e.g., texto negro sobre fondo blanco sólido, o viceversa). Permitir al usuario ajustar el tamaño y color del texto. | Alta |
| **Subtítulos** | El diálogo de GAIA no tiene subtítulos sincronizados por defecto. | Habilitar subtítulos para todo el contenido hablado, permitiendo al usuario personalizar su tamaño y apariencia. | Media |

---

### **Principio 2: Operable**
*Los componentes de la interfaz de usuario y la navegación deben ser operables.*

| Criterio | Hallazgo | Recomendación | Prioridad |
| :--- | :--- | :--- | :--- |
| **Accesibilidad por Teclado (Adaptado)** | Las interacciones requieren gestos de mano precisos (tocar, agarrar). Esto excluye a usuarios con discapacidades motoras finas. | Implementar múltiples modos de control: <br>1. **Control por Voz:** Permitir comandos como "agarrar basura" o "plantar semilla". <br>2. **Seguimiento Ocular (Eye-tracking):** Permitir seleccionar objetos fijando la mirada y confirmar con un parpadeo o un botón. <br>3. **Control de un solo botón/interruptor.** | Alta |
| **Límites de Tiempo** | El puzzle colaborativo del sistema de riego podría ser estresante si tuviera un límite de tiempo implícito o explícito. | Asegurarse de que ninguna tarea crítica para la progresión tenga un límite de tiempo. Ofrecer un modo "relajado" sin presiones. | Media |
| **Navegación** | El movimiento en el espacio VR (teletransporte o movimiento libre) puede causar mareos (cinetosis) y ser difícil para algunos usuarios. | Ofrecer múltiples modos de locomoción, incluyendo teletransporte, movimiento en punto fijo y la opción de ajustar la velocidad del movimiento. | Alta |

---

### **Principio 3: Comprensible**
*La información y el manejo de la interfaz de usuario deben ser comprensibles.*

| Criterio | Hallazgo | Recomendación | Prioridad |
| :--- | :--- | :--- | :--- |
| **Legibilidad** | El lenguaje utilizado por GAIA es amigable, pero podría ser complejo para usuarios con discapacidades cognitivas o barreras de idioma. | Implementar un modo de "Lenguaje Sencillo" que simplifique las instrucciones. Ofrecer localización de texto y voz en múltiples idiomas. | Media |
| **Predecible** | Las interfaces y las mecánicas de juego son nuevas para muchos usuarios. La falta de consistencia puede generar confusión. | Mantener la consistencia en los controles y la ubicación de la interfaz a lo largo de toda la experiencia. Ofrecer un tutorial interactivo y opcional que se pueda revisitar en cualquier momento. | Media |

---

## 4. Propuesta Clave: Soporte para Lectores de Pantalla en MR

Para usuarios con baja visión o ciegos, la experiencia en MR puede ser totalmente inaccesible. Se propone una funcionalidad innovadora de "Lector de Entorno y de Interfaz".

-   **Cómo Funcionaría:**
    1.  El usuario activa el modo de accesibilidad.
    2.  El sistema utiliza el mapeo espacial del dispositivo de MR para identificar superficies y objetos del mundo real ("Estás frente a una mesa").
    3.  Al mirar un elemento holográfico de la interfaz, un lector de pantalla integrado lee su contenido en voz alta ("Botón: Tareas de Restauración. Toca para abrir").
    4.  El usuario puede usar comandos de voz ("Leer opciones") o gestos simples para navegar por la interfaz.
-   **Impacto:** Esto transformaría la aplicación de ser una barrera a ser una herramienta que enriquece la percepción del entorno para un usuario ciego, permitiéndole participar plenamente en la experiencia.

## 5. KPIs y Plan de Implementación para Certificación ISO

### Tabla de KPIs de Accesibilidad

| KPI | Métrica | Objetivo (Q4 2026) |
| :--- | :--- | :--- |
| **Cobertura de WCAG** | Porcentaje de criterios de Nivel AA cumplidos. | 95% |
| **Tasa de Éxito de Tareas** | Tasa de finalización de tareas clave por usuarios con discapacidades (en pruebas de usabilidad). | >90% |
| **Reducción de Errores** | Disminución de errores de interacción para usuarios que utilizan modos de control alternativos. | 30% |
| **Satisfacción del Usuario** | Puntuación de satisfacción (CSAT) de usuarios con discapacidades. | >4.5/5 |

### Plan para Certificación ISO (ISO/IEC 40500:2012 - Equivalente a WCAG 2.0)

-   **Fase 1 (Q1 2026): Implementación de Mejoras de Alta Prioridad.**
    *   Asignar un equipo de desarrollo dedicado a implementar todas las recomendaciones de "Prioridad Alta" de esta auditoría.
    *   Integrar pruebas de accesibilidad automatizadas en el pipeline de CI/CD.
-   **Fase 2 (Q2 2026): Pruebas con Usuarios y Refinamiento.**
    *   Realizar rondas de pruebas de usabilidad formales con personas con diversas discapacidades.
    *   Iterar sobre las soluciones basadas en el feedback recibido.
-   **Fase 3 (Q3 2026): Auditoría Externa y Documentación.**
    *   Contratar a una firma de consultoría de accesibilidad externa para realizar una auditoría formal y validar el cumplimiento.
    *   Preparar toda la documentación requerida para la certificación.
-   **Fase 4 (Q4 2026): Solicitud de Certificación.**
    *   Presentar la solicitud de certificación ISO.
