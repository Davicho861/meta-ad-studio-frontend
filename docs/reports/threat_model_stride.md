# Modelo de Amenazas - STRIDE

**Fecha:** 2025-08-29

Este es un modelo de amenazas autogenerado basado en la especificación OpenAPI.

## Endpoint: `POST /auth/login`

**Descripción:** Iniciar sesión de usuario

| Categoría STRIDE | Amenaza Potencial |
| :--- | :--- |
| **S**poofing | Un atacante podría suplantar la identidad de un usuario para realizar esta acción. |
| **T**ampering | Los datos en tránsito podrían ser interceptados y modificados sin una conexión TLS segura. |
| **R**epudiation | Podría faltar un registro de auditoría adecuado para rastrear quién realizó esta operación. |
| **I**nformation Disclosure | Una respuesta de error detallada podría filtrar información sensible del sistema. |
| **D**enial of Service | Múltiples peticiones a este endpoint podrían agotar los recursos del servidor. |
| **E**levation of Privilege | Una vulnerabilidad en la lógica de autorización podría permitir a un usuario sin privilegios ejecutar esta acción. |

## Endpoint: `GET /projects`

**Descripción:** Obtener todos los proyectos

| Categoría STRIDE | Amenaza Potencial |
| :--- | :--- |
| **S**poofing | Un atacante podría suplantar la identidad de un usuario para realizar esta acción. |
| **T**ampering | Los datos en tránsito podrían ser interceptados y modificados sin una conexión TLS segura. |
| **R**epudiation | Podría faltar un registro de auditoría adecuado para rastrear quién realizó esta operación. |
| **I**nformation Disclosure | Una respuesta de error detallada podría filtrar información sensible del sistema. |
| **D**enial of Service | Múltiples peticiones a este endpoint podrían agotar los recursos del servidor. |
| **E**levation of Privilege | Una vulnerabilidad en la lógica de autorización podría permitir a un usuario sin privilegios ejecutar esta acción. |

## Endpoint: `POST /projects`

**Descripción:** Crear un nuevo proyecto

| Categoría STRIDE | Amenaza Potencial |
| :--- | :--- |
| **S**poofing | Un atacante podría suplantar la identidad de un usuario para realizar esta acción. |
| **T**ampering | Los datos en tránsito podrían ser interceptados y modificados sin una conexión TLS segura. |
| **R**epudiation | Podría faltar un registro de auditoría adecuado para rastrear quién realizó esta operación. |
| **I**nformation Disclosure | Una respuesta de error detallada podría filtrar información sensible del sistema. |
| **D**enial of Service | Múltiples peticiones a este endpoint podrían agotar los recursos del servidor. |
| **E**levation of Privilege | Una vulnerabilidad en la lógica de autorización podría permitir a un usuario sin privilegios ejecutar esta acción. |

## Endpoint: `GET /issues`

**Descripción:** Obtener todos los issues

| Categoría STRIDE | Amenaza Potencial |
| :--- | :--- |
| **S**poofing | Un atacante podría suplantar la identidad de un usuario para realizar esta acción. |
| **T**ampering | Los datos en tránsito podrían ser interceptados y modificados sin una conexión TLS segura. |
| **R**epudiation | Podría faltar un registro de auditoría adecuado para rastrear quién realizó esta operación. |
| **I**nformation Disclosure | Una respuesta de error detallada podría filtrar información sensible del sistema. |
| **D**enial of Service | Múltiples peticiones a este endpoint podrían agotar los recursos del servidor. |
| **E**levation of Privilege | Una vulnerabilidad en la lógica de autorización podría permitir a un usuario sin privilegios ejecutar esta acción. |

## Endpoint: `GET /multiverse/photos`

**Descripción:** Obtener datos de fotos del Multiverse

| Categoría STRIDE | Amenaza Potencial |
| :--- | :--- |
| **S**poofing | Un atacante podría suplantar la identidad de un usuario para realizar esta acción. |
| **T**ampering | Los datos en tránsito podrían ser interceptados y modificados sin una conexión TLS segura. |
| **R**epudiation | Podría faltar un registro de auditoría adecuado para rastrear quién realizó esta operación. |
| **I**nformation Disclosure | Una respuesta de error detallada podría filtrar información sensible del sistema. |
| **D**enial of Service | Múltiples peticiones a este endpoint podrían agotar los recursos del servidor. |
| **E**levation of Privilege | Una vulnerabilidad en la lógica de autorización podría permitir a un usuario sin privilegios ejecutar esta acción. |

