import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginA11y from 'eslint-plugin-jsx-a11y';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    ignores: [
      'backup_*',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/.next/**',
      '**/.vercel/**',
      '**/.output/**',
      '**/.vitepress/cache/**',
      '**/.vscode/**',
      '**/jest.config.*',
      '**/vite.config.*',
      '**/postcss.config.*',
      '**/tailwind.config.*',
      '**/cypress.config.*',
      '**/playwright.config.*',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: [
          './tsconfig.json',
          './packages/*/tsconfig.json',
          './server/tsconfig.json',
          './config/tsconfig/tsconfig.app.json',
          './config/tsconfig/tsconfig.node.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react: pluginReact,
      'jsx-a11y': pluginA11y,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginA11y.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'no-console': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Configuration for server-side code
  {
    files: ['server/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Add server-specific rules here
    },
  },
  // Configuration for configuration files
  {
    files: ['config/**/*.{js,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  // Configuration for plain JavaScript files
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  }
);
