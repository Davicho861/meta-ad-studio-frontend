import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
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
      // Force single React instance when running in a monorepo/workspace
      react: path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  ssr: {
    noExternal: ['react', 'react-dom'],
  },
}))
