import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import version from 'vite-plugin-package-version';
import { fileURLToPath, URL } from 'node:url';
import { ViteFaviconsPlugin } from 'vite-plugin-favicon2';
import { API } from './public/config.json';
export default defineConfig({
  plugins: [
    react(),
    version(),
    ViteFaviconsPlugin({
      logo: 'src/assets/logo.png',
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1024 * 1024, // 1 MB
  },
  resolve: {
    alias: {
      $: fileURLToPath(new URL('./src/assets', import.meta.url)),
      '#': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@': fileURLToPath(new URL('./src/components', import.meta.url)),
      '!': fileURLToPath(new URL('./src/libs', import.meta.url)),
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: API,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
