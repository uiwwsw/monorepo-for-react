import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import { ViteFaviconsPlugin } from 'vite-plugin-favicon2';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      ViteFaviconsPlugin({
        logo: 'src/assets/logo.png',
      }),
    ],
    build: {
      chunkSizeWarningLimit: 1024 * 1024, // 1 MB
    },
    define: {
      'process.env': env,
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
          target: env.API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
