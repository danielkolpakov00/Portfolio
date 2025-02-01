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
        reactProjects: './public/reactprojects/**/*.jsx'
      },
    },
    assetsInlineLimit: 0,
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.jsx'],
  optimizeDeps: {
    include: ['react-router-dom'], // Ensure react-router-dom is included
    exclude: ['three']
  },
  server: {
    fs: {
      strict: false,
      allow: ['..']
    }
  }
});