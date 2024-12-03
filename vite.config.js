import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.glb'],
  optimizeDeps: {
    include: ['react-router-dom'], // Ensure react-router-dom is included
    exclude: ['three']
  },
  server: {
    fs: {
      strict: false
    }
  }
});