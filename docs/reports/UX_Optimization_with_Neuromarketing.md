# Optimización de UX con Neuromarketing

**Fecha:** 2025-08-31

## 1. Resumen Ejecutivo

Este documento presenta una estrategia para optimizar la Experiencia de Usuario (UX) de la plataforma "Semillas de Cambio" aplicando técnicas de neuromarketing. Mediante el análisis de datos biométricos simulados (eye-tracking y EEG), se busca obtener una comprensión más profunda de las respuestas cognitivas y emocionales de los usuarios. Los insights extraídos se utilizarán para realizar ajustes de UX personalizados que aumenten el engagement y la retención. Adicionalmente, se proponen optimizaciones técnicas en la infraestructura de edge computing para reducir la latencia, un factor crítico para mantener un estado de inmersión sin fricciones.

## 2. Metodología de Análisis Neuromarketing

Se simulará la recolección de datos biométricos durante las pruebas de usabilidad (descritas en el `MR_Expansion_Roadmap.md`) para no depender de hardware especializado en la fase inicial.

-   **Datos a Simular:**
    1.  **Mapas de Calor de Eye-Tracking (Seguimiento Ocular):** Simularán hacia dónde miran los usuarios en la interfaz y en el entorno virtual. Esto ayuda a identificar qué elementos captan la atención y cuáles son ignorados.
    2.  **Datos de EEG (Electroencefalografía):** Simularán la carga cognitiva y el estado emocional (e.g., frustración, alegría, concentración) del usuario durante tareas específicas.

-   **Plataforma de Análisis:**
    *   Los datos simulados (en formato JSON o CSV) se ingestarán en **BigQuery**.
    *   Se crearán modelos en **Vertex AI** para correlacionar eventos del juego (e.g., `puzzle_iniciado`, `recompensa_recibida`) con las respuestas neurométricas simuladas.

## 3. Insights y Ajustes de UX Personalizados

Basado en el análisis de los datos simulados, se pueden proponer los siguientes ajustes:

| Insight Simulado (Ejemplo) | Hipótesis de Neuromarketing | Ajuste de UX Propuesto |
| :--- | :--- | :--- |
| **Eye-Tracking:** Los usuarios ignoran consistentemente el botón de "Tareas" en la esquina superior derecha después de la introducción. | **Ceguera a los Banners:** El cerebro aprende a ignorar elementos que percibe como no esenciales o publicitarios. La posición es poco natural. | **Ajuste A/B:** <br> **A)** Mover la lista de tareas a un objeto diegético (integrado en el mundo), como una tableta de piedra que emerge del suelo. <br> **B)** Hacer que la guía GAIA señale proactivamente la lista de tareas cuando detecta que un usuario está inactivo por más de 60 segundos. |
| **EEG:** Se detecta un pico de carga cognitiva y frustración durante el puzzle de conexión de tuberías del sistema de riego. | **Paradoja de la Elección:** Demasiadas opciones o pasos sin una guía clara abruman al usuario, generando una respuesta emocional negativa. | **Simplificación Progresiva:** <br> 1. La primera vez que el usuario enfrenta el puzzle, las piezas correctas brillan sutilmente. <br> 2. Si el modelo de Vertex AI predice que el usuario es un "solucionador de puzzles" (basado en su comportamiento previo), este sistema de pistas se desactiva para ofrecer un mayor desafío. |
| **Eye-Tracking y EEG:** Se observa un pico de atención y emoción positiva cuando los pequeños animales virtuales aparecen por primera vez. | **Recompensa Inesperada (Variable Reward):** El cerebro responde con fuerza a recompensas placenteras e impredecibles, liberando dopamina. | **Aumento de la Variabilidad:** <br> - Introducir una mayor variedad de animales que puedan aparecer. <br> - Hacer que la aparición de un animal "raro" sea un evento poco común y aleatorio, no siempre ligado a la finalización de una tarea, para mantener el interés. |

## 4. Recomendaciones para Reducir Latencia en Edge Computing

La latencia es el enemigo de la inmersión. Una alta latencia rompe la sensación de presencia y puede causar mareos, generando una fuerte respuesta negativa. Basado en el `edge/vr-config.yaml`, se proponen las siguientes optimizaciones:

1.  **Compresión de Assets Adaptativa:**
    *   **Problema:** Enviar assets 3D de alta resolución a dispositivos en redes de baja calidad (comunes en mercados emergentes) aumenta la latencia.
    *   **Recomendación:** Utilizar un servicio en el nodo de edge que detecte el ancho de banda del usuario y comprima los assets en tiempo real a un nivel adecuado (e.g., usando texturas de menor resolución o mallas de polígonos simplificadas). Esto reduce el tiempo de carga inicial.

2.  **Caché Predictiva (Ampliando `prefetch`):**
    *   **Problema:** El `prefetch` actual es estático.
    *   **Recomendación:** Usar un modelo de Vertex AI en el edge para predecir los próximos movimientos del usuario dentro de la experiencia. Si el usuario está en la Escena 2 (Limpieza), el sistema puede empezar a precargar en el caché del edge los assets de la Escena 3 (Reforestación) antes de que el usuario los solicite explícitamente.

3.  **Optimización de Renderizado en GPU del Edge:**
    *   **Problema:** El renderizado del lado del cliente en dispositivos de gama baja puede ser un cuello de botella.
    *   **Recomendación:** Para la experiencia en AR móvil, explorar el **renderizado en la nube (Cloud Rendering)** desde los nodos de edge con GPUs NVIDIA Tesla T4. El dispositivo del usuario solo haría streaming de un feed de video, reduciendo drásticamente la carga computacional local. Esto es ideal para mercados emergentes donde los móviles de gama alta no son comunes.

4.  **Ajuste Dinámico del `ttl` del Caché:**
    *   **Problema:** El `ttl` (Time-To-Live) del caché es fijo (1 hora).
    *   **Recomendación:** Hacer que el `ttl` sea dinámico. Para assets que cambian con frecuencia (e.g., datos de la leaderboard), el `ttl` debería ser corto (5 minutos). Para assets estáticos (e.g., el modelo 3D de una pala), puede ser mucho más largo (24 horas), mejorando la tasa de aciertos del caché.

## 5. Impacto en la Retención en Mercados Emergentes

La combinación de una UX emocionalmente resonante (gracias a los insights del neuromarketing) y una experiencia técnicamente fluida (gracias a la optimización de la latencia) es clave para la retención. En mercados emergentes, donde los usuarios pueden ser más sensibles a los costos de datos y tener hardware menos potente, una aplicación que sea a la vez atractiva y de alto rendimiento se convertirá en una opción preferida, impulsando la retención a largo plazo y el crecimiento orgánico.
