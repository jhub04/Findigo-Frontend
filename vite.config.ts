import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    istanbul({
      include: 'src/**/*',
      exclude: ['node_modules', 'cypress'],
      extension: ['.ts', '.vue'],
      cypress: true,
      requireEnv: false
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['fast-deep-equal'],
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    fs: {
      allow: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'node_modules'),
      ],
    },
  },

  build: {
    sourcemap: true
  }
});
