/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  test: {
    projects: [
      'sr./src/frontend/meta-verse-visualizer-main/vitest.config.ts',
      'src/backend/server/vitest.config.ts'
    ]
  }
});
