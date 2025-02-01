import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  assetsInclude: ['**/*.glb'], // Added to handle .glb assets
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html',
      output: {
        // Dynamically group vendor modules
        manualChunks: (id) => {
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});