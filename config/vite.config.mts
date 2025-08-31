/// <reference types="vitest" />
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "components": path.resolve(__dirname, "../src/components"),
      "hooks": path.resolve(__dirname, "../src/hooks"),
      "lib": path.resolve(__dirname, "../src/lib"),
      "assets": path.resolve(__dirname, "../src/assets"),
      "pages": path.resolve(__dirname, "../src/pages"),
    },
    dedupe: ['react', 'react-dom'],
  },
  plugins: [
    react(),
  ],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          recharts: ['recharts'],
          lodash: ['lodash'],
        },
      },
    },
  },
});
