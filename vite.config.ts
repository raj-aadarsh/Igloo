import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// base: './' makes the production build run from any path and fully offline
// (e.g. opening the built files locally), with no hard-coded server root.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Pyodide ships a Node-aware loader; let it run as-is in the worker instead of
  // being pre-bundled (which would try to resolve node: built-ins for the browser).
  optimizeDeps: {
    exclude: ['pyodide'],
  },
  worker: {
    format: 'es',
  },
  server: {
    port: 5173,
    open: true,
  },
});
