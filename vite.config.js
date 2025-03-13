import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative paths
  assetsInclude: [
    '**/*.png', 
    '**/*.jpg', 
    '**/*.jpeg', 
    '**/*.gif', 
    '**/*.svg', 
    '**/*.glb',
    '**/*.gltf',
    '**/*.ttf', 
    '**/*.woff', 
    '**/*.woff2'
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    manifest: true,
    // Ensure that import.meta.env.BASE_URL is properly set
    copyPublicDir: true,
    rollupOptions: {
      input: './index.html',
      output: {
        // Simplified asset naming scheme
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          
          if (/\.(woff|woff2|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name][extname]';
          }
          
          return `assets/[name][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.glb', '.gltf']
  },
  // Remove or update development server settings that won't apply in production
  server: {
    // These CORS settings only affect development
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'gsap']
  }
});