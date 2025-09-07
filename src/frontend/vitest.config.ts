/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  test: {
    projects: [
      'packages/meta-verse-visualizer-main/vitest.config.ts',
      'packages/api-server/server/vitest.config.ts'
    ]
  }
});
