import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/components', import.meta.url)),
      '#': fileURLToPath(new URL('./src/utils', import.meta.url)),
      $: fileURLToPath(new URL('./src/styles', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      reporter: ['text'],
    },
  },
});
