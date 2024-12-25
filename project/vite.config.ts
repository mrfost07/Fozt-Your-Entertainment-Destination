import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import history from 'connect-history-api-fallback';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensure the base path is correct
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    middleware: [
      history({
        rewrites: [
          { from: /\/(.*)/, to: '/index.html' },
        ],
      }),
    ],
  },
});