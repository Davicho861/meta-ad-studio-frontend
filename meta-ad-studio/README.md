# Meta Ad Studio

Meta Ad Studio es una aplicación diseñada para generar anuncios utilizando inteligencia artificial. Esta aplicación permite a los usuarios ingresar un prompt y recibir anuncios generados de manera rápida y eficiente.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
meta-ad-studio
├── src
│   └── frontend
│       ├── index.html          # Plantilla HTML principal
│       └── src
│           ├── main.jsx        # Punto de entrada de la aplicación React
│           ├── App.jsx         # Componente principal de la aplicación
│           ├── components       # Componentes de la interfaz de usuario
│           │   ├── PromptBar.jsx # Componente para ingresar el prompt
│           │   ├── GenerationGrid.jsx # Componente para mostrar resultados
│           │   └── ResultCard.jsx # Componente para cada resultado generado
│           ├── store
│           │   └── adStore.js   # Lógica del estado global de la aplicación
│           ├── styles
│           │   └── globals.css   # Estilos globales de la aplicación
│           └── utils
│               └── api.js       # Funciones utilitarias para interactuar con APIs
├── package.json                 # Configuración del proyecto para npm
├── vite.config.js               # Configuración para Vite
├── tailwind.config.js           # Configuración de TailwindCSS
├── postcss.config.js            # Configuración para PostCSS
├── .gitignore                   # Archivos y directorios ignorados por Git
├── AUDIT_AND_ROADMAP.md         # Informe diagnóstico y plan de acción estratégico
└── README.md                    # Documentación del proyecto
```

## Instalación

Para instalar las dependencias del proyecto, ejecuta el siguiente comando en la raíz del proyecto:

```
npm install
```

## Uso

Para iniciar la aplicación en modo de desarrollo, utiliza el siguiente comando:

```
npm run dev
```

Esto abrirá la aplicación en tu navegador predeterminado.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.