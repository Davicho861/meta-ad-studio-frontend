# Simulación de Economía Virtual con Hyperledger y Chaos Mesh

**Fecha:** 2025-08-31

## 1. Resumen Ejecutivo

Este documento detalla el plan para simular y analizar la economía virtual de la plataforma "Semillas de Cambio". La simulación utilizará un ledger de Hyperledger Fabric para modelar las transacciones de más de un millón de usuarios y la herramienta Chaos Mesh para inyectar fallos controlados, simulando escenarios de crisis. El objetivo es evaluar la resiliencia de la economía, identificar posibles desequilibrios (como la inflación) y desarrollar estrategias de monetización sostenibles a largo plazo.

## 2. Modelo Económico y Mejoras al Chaincode

El actual `chaincode.go` es un simple key-value store. Para soportar una economía, debe ser extendido para gestionar un token fungible (FT) y los NFTs existentes.

### a. Modelo de Activos:
1.  **Token Fungible - "Semilla" (SEED):**
    *   **Propósito:** La moneda principal de la economía. Los usuarios la ganan completando tareas y la gastan en el marketplace.
    *   **Estándar:** Inspirado en ERC-20, adaptado para Hyperledger Fabric.
2.  **Tokens No Fungibles (NFTs):**
    *   **Propósito:** Activos únicos (plantas raras, equipamiento) como se define en `NFT_Monetization_Model.md`.
    *   **Estándar:** Inspirado en ERC-721.

### b. Propuesta de Chaincode Extendido (`economy_chaincode.go`):
Se desarrollará un nuevo chaincode con las siguientes funciones:

-   `mint(recipient string, amount int)`: Crea nuevas SEEDs. Solo puede ser llamado por una identidad de administrador (e.g., para recompensas de tareas).
-   `balanceOf(owner string) int`: Devuelve el saldo de SEEDs de un usuario.
-   `transfer(sender string, recipient string, amount int)`: Transfiere SEEDs entre usuarios.
-   `purchaseNFT(buyer string, nftId string)`: Una función que orquesta la transferencia de SEEDs del comprador al vendedor y la transferencia del NFT del vendedor al comprador.

## 3. Arquitectura de la Simulación

1.  **Red Hyperledger Fabric:** Se desplegará una red Fabric en un clúster de Kubernetes, compuesta por 2 organizaciones, 4 peers y 1 orderer.
2.  **Generador de Transacciones:** Un servicio escrito en Go o Node.js que simulará el comportamiento de 1 millón de usuarios. Este servicio leerá perfiles de usuario predefinidos (e.g., "ahorrador", "gastador", "comerciante") y generará un flujo constante de transacciones (`transfer`, `purchaseNFT`) a la red Fabric.
3.  **Integración con Chaos Mesh:** Chaos Mesh se instalará en el mismo clúster de Kubernetes para inyectar fallos en los componentes de la red Fabric.
4.  **Dashboard de Monitoreo:** Un dashboard en Grafana mostrará en tiempo real las métricas clave de la economía (volumen de transacciones, masa monetaria total, precio promedio de los NFTs) extraídas de la base de datos de estado de Hyperledger.

## 4. Escenarios de Crisis con Chaos Mesh

Se ejecutarán los siguientes experimentos de caos para probar la resiliencia de la economía:

| Experimento de Caos | Componente Afectado | Objetivo de la Prueba | Métrica a Observar |
| :--- | :--- | :--- | :--- |
| **Latencia de Red** | Peers de Hyperledger | Simular una degradación de la red entre nodos. | ¿Aumenta la tasa de timeouts en las transacciones? ¿Se forman cuellos de botella en el procesamiento de bloques? |
| **Fallo de Pod (Pod Failure)** | Nodo Orderer | Simular un fallo del componente central de ordenamiento de transacciones. | ¿La red detiene el procesamiento de transacciones? ¿Cuánto tiempo tarda el sistema en recuperarse si hay un orderer de respaldo? |
| **Pérdida de Paquetes** | Todos los componentes | Simular condiciones de red poco fiables, comunes en mercados emergentes. | ¿Aumentan los errores de validación de transacciones? ¿Se corrompe el estado del ledger? |
| **Estrés de CPU** | Peers de Hyperledger | Simular un pico de carga que consume todos los recursos de CPU de los peers. | ¿Disminuye drásticamente el throughput (transacciones por segundo)? ¿Se vuelve la economía inutilizable bajo carga pesada? |

## 5. Estructura del Informe de Simulación

Tras ejecutar la simulación durante un período de 24 horas, se generará un informe con las siguientes secciones:

### a. Tabla de Flujos Monetarios

| Flujo | Volumen de Transacciones | Valor Total (SEEDs) | Origen/Destino Principal |
| :--- | :--- | :--- | :--- |
| **Recompensas por Tareas** | 10,000,000 | 5,000,000 | Sistema -> Usuarios |
| **Comercio P2P de NFTs** | 500,000 | 2,500,000 | Usuarios -> Usuarios |
| **Compra de NFTs Primarios** | 100,000 | 1,000,000 | Usuarios -> Sistema |
| **Comisiones del Marketplace** | 500,000 | 125,000 | Usuarios -> Tesorería |

### b. Análisis de Inflación Virtual

-   **Masa Monetaria (M1):** Total de SEEDs en circulación.
-   **Índice de Precios de NFT (IPN):** Precio promedio de una cesta de NFTs estándar.
-   **Tasa de Inflación:** `(IPN_final - IPN_inicial) / IPN_inicial * 100`.
-   **Análisis:** Se evaluará si la tasa de `minting` de nuevas SEEDs es superior a la capacidad de la economía para absorberlas, lo que podría devaluar la moneda.

### c. Estrategias de Equilibrio y Monetización Sostenible

1.  **Sumideros de Moneda (Money Sinks):**
    *   **Recomendación:** Introducir mecánicas que retiren SEEDs de circulación de forma permanente. Ejemplos: "sacrificar" SEEDs para acelerar el crecimiento de un árbol o comprar objetos cosméticos no transferibles.
    *   **Impacto Esperado:** Contrarrestar la inflación causada por la emisión de recompensas.
2.  **Impuestos Dinámicos:**
    *   **Recomendación:** Implementar una comisión variable en el marketplace. Si la inflación supera un umbral (e.g., 5% semanal), la comisión podría aumentar del 5% al 7%, y el extra se "quema" (retira de circulación).
    *   **Impacto Esperado:** Un mecanismo de auto-regulación para la economía.
3.  **Control de la Emisión:**
    *   **Recomendación:** Vincular la cantidad de SEEDs emitidos como recompensa al número de usuarios activos, en lugar de una tasa fija. A más usuarios, más emisión, manteniendo el poder adquisitivo per cápita.
    *   **Impacto Esperado:** Crecimiento económico sostenible y escalable.
