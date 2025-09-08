/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
  // Force all imports of react/react-dom used by tests to resolve to the workspace root
  'react': path.resolve(__dirname, '../../node_modules/react'),
  'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
  'react/jsx-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-runtime'),
  'react/jsx-dev-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-dev-runtime'),
    },
  },
})
