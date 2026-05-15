/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const repoBase = process.env.GITHUB_PAGES_BASE ?? '/mousegame/';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? repoBase : '/',
  plugins: [react()],
  server: { port: 3000 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    exclude: ['node_modules', 'dist', 'tests/e2e/**'],
  },
}));
