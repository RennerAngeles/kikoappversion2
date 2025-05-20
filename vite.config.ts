import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: false
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
});