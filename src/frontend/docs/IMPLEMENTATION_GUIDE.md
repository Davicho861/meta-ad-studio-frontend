# Guía de Implementación Técnica (Tareas P0)

Esta guía proporciona detalles técnicos para implementar las tareas de prioridad crítica (P0) identificadas en el backlog, con el objetivo de preparar la aplicación para producción.

---

## 1. P0: Navegación Completa por Teclado

**Épica:** Accesibilidad

**User Story:** Como usuario con discapacidad motriz, quiero poder navegar por toda la aplicación, incluida la galería de multiversos, usando únicamente mi teclado.

### Justificación

Esta tarea es **crítica (P0)** porque la navegación por teclado es un pilar fundamental de la accesibilidad web (WCAG 2.1). Sin ella, los usuarios que no pueden usar un ratón quedan completamente excluidos de la aplicación. Garantizar esta funcionalidad no solo cumple con los estándares, sino que también amplía la base de usuarios potenciales.

### Archivos a Modificar (Probables)

*   `src/components/ui/Button.tsx`: Asegurarse de que los botones personalizados manejen correctamente el foco.
*   `src/components/layout/Navbar.tsx`: Verificar que todos los enlaces de navegación sean accesibles.
*   `src/components/MultiverseGallery.tsx`: El contenedor principal de la galería y sus elementos interactivos (tarjetas, filtros).
*   `src/App.css` o `src/index.css`: Para añadir estilos de foco visibles globalmente.

### Librerías a Instalar/Utilizar

*   **Ninguna librería nueva es estrictamente necesaria.** La clave está en usar HTML semántico (`<button>`, `<a>`) y gestionar el foco.
*   **Radix UI** (ya inferido en el proyecto) es excelente para esto, ya que sus primitivas de componentes gestionan el foco y la interacción por teclado de forma nativa.

### Ejemplo de Código (Snippet)

Para asegurar un indicador de foco visible y accesible que no interfiera con los estilos de Tailwind CSS, se puede añadir una regla global.

```css
/* En: src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Regla global para un foco visible y accesible */
@layer base {
  :focus-visible {
    outline: 3px solid hsl(var(--ring));
    outline-offset: 2px;
    border-radius: var(--radius);
  }
}
```

### Comando de Verificación

1.  **Verificación Manual:**
    *   Abre la aplicación en el navegador.
    *   Presiona la tecla `Tab` repetidamente. Deberías ver un contorno de foco claro que se mueve de un elemento interactivo al siguiente en un orden lógico.
    *   Usa `Shift + Tab` para navegar hacia atrás.
    *   Intenta activar botones y enlaces usando las teclas `Enter` o `Espacio`.

2.  **Auditoría Automatizada:**
    *   Ejecuta una auditoría de accesibilidad con Lighthouse en Chrome DevTools.
    *   `npm run axe` (si se configura `axe-core` para pruebas automatizadas).

---

## 2. P0: Descripciones Alternativas para Imágenes

**Épica:** Accesibilidad

**User Story:** Como usuario con discapacidad visual, quiero que todas las imágenes tengan descripciones alternativas (`alt text`) para entender su contenido a través de un lector de pantalla.

### Justificación

El texto alternativo es **crítico (P0)** porque es la única forma en que los usuarios con discapacidad visual pueden comprender el contenido y la función de las imágenes. La ausencia de `alt text` es una de las fallas de accesibilidad más comunes y severas (WCAG Nivel A).

### Archivos a Modificar (Probables)

*   `src/components/MultiverseGallery.tsx`: Donde probablemente se renderizan las imágenes de la galería.
*   `src/pages/*.tsx`: Cualquier otra página que contenga imágenes estáticas o dinámicas.
*   `src/lib/sdlc-data.ts` (o similar): Si los datos de las imágenes (URLs, descripciones) provienen de un archivo local, es el lugar ideal para añadir los `alt text`.

### Librerías a Instalar/Utilizar

*   Ninguna. Esta tarea se basa en el uso correcto de atributos HTML.

### Ejemplo de Código (Snippet)

Supongamos que los datos de la galería provienen de un array de objetos.

```typescript
// En: src/lib/sdlc-data.ts o donde se definan los datos
export const multiverseData = [
  {
    id: 'm-01',
    title: 'Cyberpunk Neo-Kyoto',
    imageUrl: '/images/neo-kyoto.jpg',
    // Añadir el alt text aquí
    altText: 'Una vista nocturna de una ciudad futurista con rascacielos iluminados por neón y vehículos voladores.'
  },
  // ... más objetos
];

// En el componente que renderiza la imagen: src/components/MultiverseGallery.tsx
multiverseData.map((multiverse) => (
  <div key={multiverse.id} className="card">
    <img
      src={multiverse.imageUrl}
      alt={multiverse.altText} // Usar el alt text desde los datos
      className="w-full h-auto object-cover"
    />
    <h3>{multiverse.title}</h3>
  </div>
));
```

### Comando de Verificación

1.  **Inspección Manual:**
    *   Abre Chrome DevTools, selecciona una imagen y verifica en el panel "Elements" que la etiqueta `<img>` tiene un atributo `alt` con texto descriptivo.
2.  **Auditoría Automatizada:**
    *   Ejecuta una auditoría de Lighthouse. La sección de "Accesibilidad" marcará cualquier imagen que no tenga un `alt text`.
    *   Usa extensiones de navegador como **WAVE** o **Axe DevTools** para un análisis más detallado.

---

## 3. P0: Lazy Loading para Imágenes y Componentes

**Épica:** Performance

**User Story:** Implementar "lazy loading" para las imágenes y componentes pesados en la galería principal para acelerar el tiempo de carga inicial (LCP y FCP).

### Justificación

Esta tarea es **crítica (P0)** porque impacta directamente en los **Core Web Vitals**, métricas clave que Google usa para el ranking de búsqueda y que afectan la experiencia del usuario. Un tiempo de carga inicial lento es una de las principales razones por las que los usuarios abandonan un sitio. El "lazy loading" es una de las optimizaciones de mayor impacto con un esfuerzo de implementación relativamente bajo.

### Archivos a Modificar (Probables)

*   `src/components/MultiverseGallery.tsx`: El componente principal donde se renderiza la lista de imágenes.
*   `package.json`: Para añadir una nueva dependencia si se opta por una librería.

### Librerías a Instalar/Utilizar

*   **Opción A (Recomendada y Simple):** `react-lazy-load-image-component`. Es una librería ligera y muy popular para React.
    ```bash
    npm install react-lazy-load-image-component
    npm install --save-dev @types/react-lazy-load-image-component
    ```
*   **Opción B (Nativa):** Usar el atributo `loading="lazy"` en las etiquetas `<img>`. Es soportado por la mayoría de los navegadores modernos, pero ofrece menos control sobre placeholders.

### Ejemplo de Código (Snippet)

Usando `react-lazy-load-image-component`.

```typescript
// En: src/components/MultiverseGallery.tsx
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // O 'black-and-white.css'

// ... dentro del map
multiverseData.map((multiverse) => (
  <div key={multiverse.id} className="card">
    <LazyLoadImage
      alt={multiverse.altText}
      src={multiverse.imageUrl}
      effect="blur" // Efecto de placeholder
      height={300} // Es importante definir dimensiones
      width="100%"
      placeholderSrc="/path/to/placeholder.jpg" // Opcional: una imagen de baja resolución
    />
    <h3>{multiverse.title}</h3>
  </div>
));
```

### Comando de Verificación

1.  **Inspección en el Navegador:**
    *   Abre Chrome DevTools y ve a la pestaña **Network**.
    *   Marca la opción "Disable cache".
    *   Recarga la página. Verás que solo se descargan las imágenes visibles en el viewport.
    *   A medida que haces scroll hacia abajo, verás cómo se solicitan y descargan nuevas imágenes.
2.  **Auditoría de Performance:**
    *   Ejecuta una auditoría de Lighthouse antes y después del cambio.
    *   Compara las métricas de **Largest Contentful Paint (LCP)** y **First Contentful Paint (FCP)**. Deberían mostrar una mejora notable.
