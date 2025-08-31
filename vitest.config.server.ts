/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './vitest.setup.server.ts',
    include: ['server/src/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', 'src/**/*'],
    watch: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      all: true,
      reportsDirectory: './coverage-server',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
