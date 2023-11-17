import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 1024 * 1024, // 1 MB
    },
    resolve: {
      alias: {
        src: fileURLToPath(new URL('./src', import.meta.url)),
        $: fileURLToPath(new URL('./src/assets', import.meta.url)),
        '#': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@': fileURLToPath(new URL('./src/components', import.meta.url)),
        '!': fileURLToPath(new URL('./src/libs', import.meta.url)),
      },
    },
    base: '/',
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
          ws: true,
        },
      },
    },
  };
});
