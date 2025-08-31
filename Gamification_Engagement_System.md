# Sistema de Gamificación para Engagement en la App VR/AR

**Fecha:** 2025-08-31

## 1. Resumen Ejecutivo

Este documento diseña un sistema de gamificación integral para la experiencia "Semillas de Cambio", con el objetivo de aumentar el engagement, la retención y la interacción social. El sistema se basa en tres pilares: un sistema de **Badges (Insignias)** por logros, **Leaderboards (Clasificaciones)** competitivas y colaborativas, y **Recompensas en forma de NFTs**. El sistema utilizará la infraestructura de datos existente (BigQuery) y modelos de IA (Vertex AI) para ofrecer una experiencia personalizada y dinámicamente ajustada.

## 2. Componentes del Sistema de Gamificación

---

### **a. Sistema de Badges (Insignias)**

Las insignias son logros visuales que los usuarios desbloquean al completar hitos específicos. Se dividen en categorías para motivar diferentes estilos de juego.

-   **Categorías de Insignias:**
    1.  **Guardián Novato:** Otorgadas por completar las tareas del tutorial (limpiar, plantar el primer árbol).
    2.  **Maestro Colaborador:** Por realizar acciones conjuntas (e.g., "Levantamiento Pesado" por mover 10 objetos con otro usuario; "Sincronía Perfecta" por completar el puzzle del riego en menos de 5 minutos).
    3.  **Ecologista Dedicado:** Por la constancia y el cuidado a largo plazo (e.g., "Pulmón Verde" por plantar 100 árboles; "Guardián Constante" por iniciar sesión 7 días seguidos).
    4.  **Explorador Social:** Por interactuar con la comunidad (e.g., "Bien Conectado" por añadir 10 amigos; "Guía Comunitario" por ayudar a un nuevo usuario a completar una tarea).

-   **Implementación Técnica:**
    *   Un servicio de logros registrará el progreso del usuario.
    *   Los eventos de juego (e.g., `arbol_plantado`, `tarea_colaborativa_completada`) se enviarán a un topic de Pub/Sub y se agregarán en BigQuery.
    *   Cuando un usuario cumple los criterios para una insignia, el servicio le otorga el logro, que se muestra en su perfil.

---

### **b. Sistema de Leaderboards (Clasificaciones)**

Las clasificaciones fomentan la competencia amistosa y la colaboración.

-   **Tipos de Leaderboards:**
    1.  **Leaderboard Individual Semanal:**
        *   **Métrica:** "Puntos de Sostenibilidad" (obtenidos por plantar, reciclar, etc.).
        *   **Recompensa:** Los 10 mejores usuarios de la semana reciben un NFT cosmético de edición limitada (e.g., un skin de herramienta brillante).
    2.  **Leaderboard Regional (LATAM vs. África):**
        *   **Métrica:** Total de árboles plantados por todos los usuarios de cada región.
        *   **Recompensa:** La región ganadora del mes desbloquea un evento comunitario exclusivo (e.g., la aparición de un animal mítico regional en todos los ecosistemas de esa región por una semana).
    3.  **Leaderboard de Amigos:**
        *   Clasificación privada que solo muestra las puntuaciones de los amigos del usuario, para fomentar la competencia en grupos pequeños.

-   **Implementación Técnica:**
    *   Las puntuaciones se calcularán y actualizarán en tiempo real usando BigQuery.
    *   Las leaderboards se mostrarán en una sección dedicada de la interfaz de la aplicación.

---

### **c. Recompensas NFTs**

Los NFTs se utilizan como recompensas significativas y verificables por logros excepcionales, integrándose con el `NFT_Monetization_Model.md`.

-   **Tipos de Recompensas NFT:**
    *   **Cosméticos:** Skins para herramientas y avatares (recompensa de leaderboards).
    *   **Animales Míticos:** Otorgados al alcanzar el nivel más alto de sostenibilidad en un ecosistema (logro de prestigio).
    *   **Trofeos Conmemorativos:** NFTs únicos por participar en eventos especiales de la comunidad.

-   **Implementación Técnica:**
    *   El servicio de logros activará una Cloud Function que llamará al smart contract en la blockchain (Polygon) para acuñar (mint) el NFT directamente en la wallet del usuario. Esto automatiza la entrega de recompensas.

## 3. Personalización con BigQuery y Vertex AI

El sistema de gamificación no será estático. Se adaptará a cada usuario para maximizar el engagement.

-   **Análisis de Datos con BigQuery:**
    *   Se crearán dashboards en Looker Studio (conectado a BigQuery) para analizar qué insignias y leaderboards son más efectivas para retener a diferentes segmentos de usuarios (e.g., jugadores casuales vs. competitivos).
    *   Se analizará el "camino del jugador" para identificar puntos donde los usuarios pierden interés.

-   **Ajustes Dinámicos con Vertex AI:**
    1.  **Sistema de Desafíos Personalizados:**
        *   El modelo de Vertex AI (ampliando el `vertex_ai_training_plan.md` para incluir datos de comportamiento del jugador) predecirá qué tipo de desafío es más probable que un usuario acepte a continuación.
        *   **Ejemplo:** Si un usuario ha mostrado un comportamiento altamente social, el sistema le ofrecerá un desafío personalizado como: "Invita a un amigo y completen el puzzle del riego juntos para ganar el doble de puntos de colaboración".
    2.  **Predicción de Abandono (Churn Prediction):**
        *   El modelo identificará a los usuarios con alto riesgo de abandonar la aplicación.
        *   El sistema de gamificación responderá proactivamente, ofreciendo a estos usuarios una recompensa especial o un desafío fácil y gratificante para re-engancharlos.
    3.  **Equilibrio de la Economía de Recompensas:**
        *   Vertex AI analizará la tasa a la que se otorgan las recompensas NFT para predecir la inflación y la escasez.
        *   El sistema podrá ajustar dinámicamente la dificultad para obtener ciertas recompensas, manteniendo así su valor y prestigio a largo plazo.
