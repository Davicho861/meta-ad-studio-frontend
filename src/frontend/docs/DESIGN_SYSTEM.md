# Sistema de Diseño de Meta Studio Flow 🎨

Este documento formaliza los principios de diseño y los componentes clave utilizados en Meta Studio Flow, asegurando coherencia y escalabilidad en toda la aplicación.

## 1. Filosofía de Diseño

Nuestra filosofía de diseño se centra en la **modernidad**, la **limpieza** y la **intuición**. Buscamos crear una experiencia de usuario fluida y eficiente, donde la funcionalidad se combine con una estética agradable y minimalista. La usabilidad es primordial, y cada elemento está diseñado para ser claro y fácil de entender.

## 2. Paleta de Colores

La paleta de colores de Meta Studio Flow se define a través de variables HSL en `tailwind.config.ts`, lo que permite una fácil adaptación a temas claros y oscuros.

| Categoría      | Nombre de la Variable CSS | Valor HSL (Ejemplo) | Descripción                                     |
| :------------- | :------------------------ | :------------------ | :---------------------------------------------- |
| **Base**       | `--background`            | `0 0% 100%`         | Fondo principal de la aplicación.               |
|                | `--foreground`            | `222.2 84% 4.9%`    | Color de texto principal.                       |
| **Primario**   | `--primary`               | `222.2 47.4% 11.2%` | Elementos interactivos principales, botones.    |
|                | `--primary-foreground`    | `210 40% 98%`       | Texto sobre elementos primarios.                |
| **Secundario** | `--secondary`             | `210 40% 96.1%`     | Elementos secundarios, fondos de secciones.      |
|                | `--secondary-foreground`  | `222.2 47.4% 11.2%` | Texto sobre elementos secundarios.             |
| **Acento**     | `--accent`                | `210 40% 96.1%`     | Resaltado, elementos interactivos sutiles.      |
|                | `--accent-foreground`     | `222.2 47.4% 11.2%` | Texto sobre elementos de acento.                |
| **Bordes**     | `--border`                | `214.3 31.8% 91.4%` | Bordes de componentes y separadores.            |
| **Input**      | `--input`                 | `214.3 31.8% 91.4%` | Bordes de campos de entrada.                    |
| **Anillo**     | `--ring`                  | `222.2 84% 4.9%`    | Foco de elementos interactivos.                 |
| **Card**       | `--card`                  | `0 0% 100%`         | Fondo de tarjetas y paneles.                    |
|                | `--card-foreground`       | `222.2 84% 4.9%`    | Texto sobre tarjetas.                           |
|                | `--card-border`           | `214.3 31.8% 91.4%` | Borde de tarjetas.                              |
| **Destructivo**| `--destructive`           | `0 84.2% 60.2%`     | Acciones peligrosas, mensajes de error.         |
|                | `--destructive-foreground`| `210 40% 98%`       | Texto sobre elementos destructivos.             |
| **Éxito**      | `--success`               | `142.1 76.2% 36.3%` | Mensajes de éxito, indicadores positivos.       |
| **Advertencia**| `--warning`               | `48 96% 50%`        | Mensajes de advertencia, atención.              |
| **Información**| `--info`                  | `210 90% 50%`       | Mensajes informativos.                          |
| **Gris Jira**  | `--jira-gray-50`          | `220 14.3% 95.3%`   | Tonos de gris específicos para la interfaz Jira.|
|                | `--jira-gray-900`         | `224 71.4% 4.1%`    |                                                 |
| **Sidebar**    | `--sidebar-background`    | `222.2 47.4% 11.2%` | Fondo de la barra lateral.                      |
|                | `--sidebar-foreground`    | `210 40% 98%`       | Texto en la barra lateral.                      |

*Nota: Los valores HSL son ejemplos y pueden variar ligeramente según la configuración de las variables CSS en `src/index.css`.*

## 3. Tipografía

Utilizamos una tipografía limpia y legible para garantizar una experiencia de lectura óptima. La fuente principal se define en el CSS global, y los tamaños y pesos se gestionan a través de las clases de utilidad de Tailwind CSS.

*   **Fuente Principal:** `Inter` (o una fuente sans-serif similar para fallback).
*   **Encabezados (H1):** `text-4xl font-bold` (ej. para títulos de página).
*   **Encabezados (H2):** `text-3xl font-semibold` (ej. para secciones principales).
*   **Encabezados (H3):** `text-2xl font-medium` (ej. para subsecciones).
*   **Párrafos:** `text-base leading-relaxed` (texto de cuerpo estándar).
*   **Texto Pequeño:** `text-sm` (para descripciones, metadatos).

## 4. Componentes Principales (Shadcn/ui)

Meta Studio Flow aprovecha la biblioteca de componentes `shadcn/ui` para construir una interfaz de usuario robusta y accesible. A continuación, se documentan tres componentes clave que serían fundamentales en una aplicación de gestión de proyectos.

### 4.1. Button

El componente `Button` es esencial para las interacciones del usuario. Se utiliza para acciones primarias, secundarias, destructivas, etc.

**Uso Básico:**

```tsx
import { Button } from "@/components/ui/button";

function MyComponent() {
  return (
    <Button>Guardar Cambios</Button>
  );
}
```

**Variantes Comunes:**

```tsx
import { Button } from "@/components/ui/button";

function ButtonExamples() {
  return (
    <div className="flex gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
```

### 4.2. Card

El componente `Card` se utiliza para agrupar contenido relacionado de manera visualmente distintiva, como tareas en un tablero Kanban o resúmenes de proyectos.

**Uso Básico:**

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

function TaskCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Implementar Autenticación</CardTitle>
        <CardDescription>Desarrollar el módulo de inicio de sesión y registro.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Estado: En Progreso</p>
        <p>Asignado a: Juan Pérez</p>
      </CardContent>
      <CardFooter>
        <Button>Ver Detalles</Button>
      </CardFooter>
    </Card>
  );
}
```

### 4.3. Table

El componente `Table` es ideal para mostrar datos tabulares, como listas de incidencias, usuarios o informes.

**Uso Básico:**

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const issues = [
  { id: "ISS-001", title: "Bug en el login", status: "Abierto", assignee: "Ana García" },
  { id: "ISS-002", title: "Mejora de rendimiento", status: "Cerrado", assignee: "Pedro López" },
  { id: "ISS-003", title: "Nueva característica X", status: "En Progreso", assignee: "Juan Pérez" },
];

function IssuesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Asignado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell className="font-medium">{issue.id}</TableCell>
            <TableCell>{issue.title}</TableCell>
            <TableCell>{issue.status}</TableCell>
            <TableCell className="text-right">{issue.assignee}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 5.1. Multiverse Gallery Components

To ensure consistency with the existing design, the Multiverse Photo Gallery utilizes specific styling for its layout and elements.

#### 5.1.1. `.multiverse-gallery`

The main container for the gallery.

*   **Purpose:** Provides overall padding and sets the base font family.
*   **Styles:**
    *   `padding: 20px;`
    *   `font-family: Arial, sans-serif;` (or the globally defined font)

#### 5.1.2. `.multiverse-gallery h2`

Styling for the gallery's main title.

*   **Purpose:** Ensures the title stands out and aligns with heading styles.
*   **Styles:**
    *   `margin-bottom: 20px;`
    *   `color: #333;` (or a primary/foreground color from the palette)

#### 5.1.3. `.photo-grid`

A grid container for displaying photos.

*   **Purpose:** Arranges photos in a responsive grid layout.
*   **Styles:**
    *   `display: grid;`
    *   `grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));`
    *   `gap: 20px;`

#### 5.1.4. `.photo-item`

Represents an individual photo entry in the gallery.

*   **Purpose:** Styles each photo card with borders, padding, and alignment.
*   **Styles:**
    *   `border: 1px solid #ddd;` (or `--border` color)
    *   `padding: 10px;`
    *   `text-align: center;`
    *   `background-color: #fff;` (or `--card` color)
    *   `box-shadow: 0 2px 4px rgba(0,0,0,0.1);`

#### 5.1.5. `.photo-item img`

Styling for the images within the gallery.

*   **Purpose:** Ensures images are responsive and maintain aspect ratio.
*   **Styles:**
    *   `max-width: 100%;`
    *   `height: 200px;` (Fixed height for consistency)
    *   `object-fit: cover;`

#### 5.1.6. `.photo-item p`

Styling for the caption of each photo.

*   **Purpose:** Formats the photo captions.
*   **Styles:**
    *   `margin: 0;`
    *   `font-size: 0.9em;`
    *   `color: #555;` (or a secondary foreground color)
