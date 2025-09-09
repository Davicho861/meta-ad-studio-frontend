import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import fs from 'fs'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
  // allow overriding the dev port via env (FRONTEND_PORT) so CI/containers and local dev stay consistent
  port: Number(process.env.FRONTEND_PORT) || 5173,
    proxy: {
      '/api': {
        target: 'http://api-server:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/v1': {
        target: 'http://api-server:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Prefer local React instance when present (e.g. inside the container's app folder).
      // Fall back to workspace-level node_modules for monorepo development.
      react: fs.existsSync(path.resolve(__dirname, './node_modules/react'))
        ? path.resolve(__dirname, './node_modules/react')
        : path.resolve(__dirname, '../../../node_modules/react'),
      'react-dom': fs.existsSync(path.resolve(__dirname, './node_modules/react-dom'))
        ? path.resolve(__dirname, './node_modules/react-dom')
        : path.resolve(__dirname, '../../../node_modules/react-dom'),
      'react/jsx-runtime': fs.existsSync(path.resolve(__dirname, './node_modules/react/jsx-runtime'))
        ? path.resolve(__dirname, './node_modules/react/jsx-runtime')
        : path.resolve(__dirname, '../../../node_modules/react/jsx-runtime'),
      'react/jsx-dev-runtime': fs.existsSync(path.resolve(__dirname, './node_modules/react/jsx-dev-runtime'))
        ? path.resolve(__dirname, './node_modules/react/jsx-dev-runtime')
        : path.resolve(__dirname, '../../../node_modules/react/jsx-dev-runtime'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  ssr: {
    noExternal: ['react', 'react-dom'],
  },
}))
