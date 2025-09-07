# Framework de Ciberseguridad Cuántica para la Plataforma VR/AR

**Fecha:** 2025-08-31

## 1. Resumen Ejecutivo

Este documento establece un framework de ciberseguridad cuántica para proteger los datos de los usuarios y las transacciones blockchain en la plataforma VR/AR. Ante la creciente amenaza de la computación cuántica para la criptografía clásica (RSA, ECC), este framework adopta un enfoque proactivo basado en criptografía post-cuántica (PQC), simulaciones de ataques y mitigaciones automáticas para garantizar la resiliencia a largo plazo de la plataforma.

## 2. Principios Fundamentales

1.  **Resiliencia Cuántica por Defecto:** Toda la nueva infraestructura y los datos en reposo y en tránsito deben estar protegidos con algoritmos resistentes a ataques cuánticos.
2.  **Agilidad Criptográfica:** La arquitectura debe permitir la actualización y el reemplazo de algoritmos criptográficos con un impacto mínimo en el sistema, para adaptarse a futuros avances.
3.  **Defensa en Profundidad:** La seguridad no dependerá de una sola capa. Se combinarán PQC, monitoreo de red y políticas de acceso robustas.
4.  **Verificación Continua:** La postura de seguridad se validará continuamente a través de simulaciones de ataques y auditorías.

## 3. Algoritmos Post-Cuánticos (PQC)

Basado en las recomendaciones del NIST y la configuración existente (`crypto/pq-algos.yaml`), el framework estandariza el uso de los siguientes algoritmos, con un enfoque principal en la **Criptografía Basada en Retículos (Lattice-based cryptography)** por su eficiencia y seguridad.

-   **Intercambio de Claves (Key Encapsulation Mechanism - KEM):**
    *   **Primario:** `CRYSTALS-Kyber`. Utilizado para establecer sesiones seguras en todas las comunicaciones (TLS 1.3, VPNs, etc.).
    *   **Secundarios:** `NTRU`, `SABER`. Mantenidos como opciones de respaldo para agilidad criptográfica.

-   **Firmas Digitales:**
    *   **Primario:** `CRYSTALS-Dilithium`. Utilizado para verificar la autenticidad e integridad de las transacciones blockchain, el código de software y las comunicaciones de la API.
    *   **Secundarios:** `Falcon`. Mantenido como respaldo.

-   **Política de Implementación:**
    *   Se prohíbe el uso de criptografía clásica (RSA, ECC, DSA) para nuevas aplicaciones.
    *   Los sistemas heredados deben ser migrados a PQC antes de finales de 2025.

## 4. Simulación de Ataques y Medidas de Mitigación

La validación de la resiliencia se realizará mediante simulaciones periódicas y automatizadas, definidas en `metaverse/vr-sim.yaml`.

### Escenario de Simulación: `quantum-attack-scenario-001`

-   **Objetivo:** Simular un ataque a gran escala donde un adversario con una computadora cuántica intenta romper las claves de sesión y las firmas de transacciones.
-   **Vectores de Ataque Simulados:**
    1.  **Ataque de Cosecha (Harvest Now, Decrypt Later):** El simulador capturará tráfico de red cifrado.
    2.  **Ataque de Suplantación:** El simulador intentará firmar una transacción blockchain fraudulenta con una firma clásica (RSA) para verificar que la red la rechace.
    3.  **Ataque de Algoritmo de Shor:** Se simulará un intento de romper claves de sesión que (hipotéticamente) no hubieran sido actualizadas a Kyber.
-   **Criterios de Éxito:**
    *   El tráfico cifrado con Kyber permanece indescifrable.
    *   Las transacciones firmadas con Dilithium son validadas correctamente.
    *   Las firmas y claves heredadas son rechazadas por el sistema.

### Mitigación Automática para Transacciones Blockchain

Para proteger el alto volumen de transacciones en la plataforma, especialmente en el marketplace de NFTs, se implementarán las siguientes medidas:

1.  **Rotación de Claves Híbrida:** Las wallets de los usuarios utilizarán un esquema híbrido. La clave principal será PQC (Dilithium), pero se mantendrá una clave clásica (ECDSA) como respaldo para la compatibilidad con metaversos externos. Sin embargo, todas las transacciones internas de la plataforma **deben** estar firmadas con Dilithium.
2.  **Monitoreo de Anomalías en la Red:** Un sistema de monitoreo (basado en Prometheus y Grafana) analizará el mempool de la blockchain en busca de patrones anómalos, como un aumento repentino de transacciones fallidas o intentos de usar firmas no válidas.
3.  **Circuit Breaker Automatizado:** Si el sistema de monitoreo detecta un ataque activo (e.g., >1% de firmas inválidas en un bloque), un "circuit breaker" se activará automáticamente:
    *   Pausará temporalmente el smart contract del marketplace para evitar el robo de activos.
    *   Aumentará los requisitos de confirmación de bloque para las transacciones.
    *   Enviará una alerta de alta prioridad al equipo de seguridad.
4.  **Edge Computing para Validación:** Las validaciones de firmas PQC se descargarán a nodos de edge computing cercanos a los usuarios para reducir la latencia y la carga en los servidores centrales, garantizando un rendimiento óptimo incluso con criptografía más intensiva.

## 5. Roadmap de Implementación

-   **Q4 2025:** Completar la migración de todos los sistemas heredados a PQC. Realizar la primera simulación de ataque cuántico a escala completa.
-   **Q1 2026:** Implementar y probar el sistema de "circuit breaker" automatizado en la testnet.
-   **Q2 2026:** Desplegar el framework completo en producción y comenzar las auditorías de seguridad trimestrales.
