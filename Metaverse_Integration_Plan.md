# Plan de Integración Técnica con Metaversos Externos

**Fecha:** 2025-08-31

## 1. Resumen Ejecutivo

Este documento detalla el plan técnico para integrar la aplicación "Semillas de Cambio" con metaversos establecidos como Decentraland y The Sandbox. El objetivo es permitir la interoperabilidad de activos (NFTs), la identidad del usuario y las experiencias sociales entre plataformas, creando un ecosistema de realidad mixta más conectado y valioso para el usuario final.

## 2. Arquitectura de Integración Propuesta

La integración se basará en una arquitectura de microservicios y APIs federadas, donde un nuevo **"Servicio de Interoperabilidad"** actuará como puente entre la aplicación "Semillas de Cambio" y los metaversos externos.

### Componentes Clave:

1.  **API Gateway Extendido:** Se añadirán nuevas rutas al API Gateway existente para gestionar las comunicaciones con metaversos externos.
2.  **Servicio de Interoperabilidad:** Un nuevo microservicio responsable de:
    *   Traducir formatos de datos entre plataformas.
    *   Gestionar la sincronización de estado de avatares y activos.
    *   Autenticar y autorizar el acceso a través de puentes blockchain.
3.  **Puente Blockchain:** Un conjunto de smart contracts para facilitar la transferencia segura de NFTs (ERC-721) entre nuestra solución Layer 2 y las blockchains de Decentraland (Ethereum) y The Sandbox (Polygon).

## 3. Extensiones a la API (openapi.yaml v2.0)

Se propone una nueva sección `Interoperability` en la API para gestionar estas conexiones.

```yaml
# Propuesta de nuevos endpoints para openapi.yaml

paths:
  /interoperability/assets/transfer:
    post:
      tags:
        - Interoperability
      summary: Iniciar transferencia de un asset NFT a un metaverso externo
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AssetTransferRequest'
      responses:
        '202' # Accepted
          description: Transferencia iniciada. El usuario debe confirmar en su wallet.
  
  /interoperability/avatars/sync:
    post:
      tags:
        - Interoperability
      summary: Sincronizar el estado del avatar con un metaverso externo
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AvatarSyncRequest'
      responses:
        '200':
          description: Estado del avatar sincronizado.

components:
  schemas:
    AssetTransferRequest:
      type: object
      properties:
        assetId:
          type: string
          description: "ID del NFT a transferir."
        sourcePlatform:
          type: string
          enum: [semillas_de_cambio]
        destinationPlatform:
          type: string
          enum: [decentraland, the_sandbox]
        destinationWallet:
          type: string
          description: "Dirección de la wallet del usuario en la plataforma de destino."

    AvatarSyncRequest:
      type: object
      properties:
        avatarId:
          type: string
        targetPlatform:
          type: string
          enum: [decentraland, the_sandbox]
        syncData:
          type: object
          properties:
            position:
              type: object # x, y, z coordinates
            appearance:
              type: object # Wearables, skins
```

## 4. Protocolos de Interoperabilidad Blockchain

-   **Estándar de Activos:** Se utilizará el estándar **ERC-721** para todos los NFTs, garantizando la compatibilidad nativa con los marketplaces de Decentraland y The Sandbox. Para activos más complejos o semi-fungibles, se explorará el **ERC-1155**.
-   **Identidad Descentralizada (DID):** Se fomentará el uso de DIDs para que los usuarios puedan gestionar su identidad a través de las plataformas sin depender de un proveedor central. Se explorará la integración con soluciones como **Ethereum Name Service (ENS)**.
-   **Puente de Activos (Asset Bridge):** Se desarrollará un puente "lock-and-mint" (bloquear y acuñar). Cuando un usuario quiere mover un NFT de "Semillas de Cambio" a Decentraland:
    1.  El NFT original es bloqueado en un smart contract en nuestra cadena (Layer 2).
    2.  Se emite una prueba criptográfica de este bloqueo.
    3.  Un smart contract en la cadena de destino (Ethereum) verifica la prueba y acuña un NFT "envuelto" (wrapped) equivalente en Decentraland.
    4.  El proceso inverso se sigue para traer el activo de vuelta.

## 5. Plan de Pruebas de Compatibilidad Multi-Plataforma

1.  **Entorno de Staging/Testnet:** Se desplegará una versión completa de la arquitectura en una testnet de Ethereum (e.g., Sepolia) para realizar pruebas sin costo real.
2.  **Pruebas Unitarias de Smart Contracts:** Auditoría y pruebas exhaustivas de los contratos del puente para evitar vulnerabilidades de seguridad.
3.  **Pruebas de Integración de API:** Simulación de llamadas a las APIs de Decentraland y The Sandbox para asegurar que las solicitudes de sincronización y transferencia se procesan correctamente. Se usarán herramientas como Postman y scripts automatizados.
4.  **Pruebas End-to-End (E2E):** Un equipo de QA realizará transferencias completas de activos y sincronizaciones de avatares entre las plataformas en el entorno de testnet, validando la experiencia del usuario de principio a fin.
5.  **Pruebas de Carga y Estrés:** Simular miles de transferencias concurrentes para asegurar que el puente y el Servicio de Interoperabilidad pueden manejar la carga esperada post-escalado en 2025.

## 6. Beneficios para el Usuario

-   **Propiedad Real de Activos:** Los usuarios pueden llevar sus NFTs (árboles únicos, equipamiento) a otros metaversos, mostrarlos y comerciar con ellos en mercados más grandes, aumentando su valor percibido.
-   **Identidad Unificada:** Los usuarios pueden mantener una identidad y reputación consistentes a través de diferentes mundos virtuales.
-   **Experiencias Conectadas:** Un usuario podría organizar un evento en su parcela de Decentraland para mostrar el ecosistema que ha cultivado en "Semillas de Cambio", creando un puente entre experiencias.
-   **Mayor Utilidad:** Los activos adquiridos en un mundo virtual ganan utilidad en otros, incentivando la inversión y la participación a largo plazo.
