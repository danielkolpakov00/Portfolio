import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression'; // Import the compression plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analysis in production build (generates stats.html)
    process.env.ANALYZE && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    // Add compression for assets
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files larger than 10kb
    }),
    // Add Brotli compression for even better compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
    }),
  ],
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
    minify: 'terser', // Using terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Ensure that import.meta.env.BASE_URL is properly set
    copyPublicDir: true,
    rollupOptions: {
      input: './index.html',
      output: {
        // Improved chunking strategy
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-libs': ['framer-motion', 'gsap', '@gsap/react'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'particles': ['tsparticles', '@tsparticles/react', '@tsparticles/slim'],
        },
        // Simplified asset naming scheme
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          
          if (/\.(woff|woff2|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name][extname]';
          }
          
          if (/\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          
          if (/\.(glb|gltf)$/.test(assetInfo.name)) {
            return 'assets/models/[name]-[hash][extname]';
          }
          
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    // Enable source maps in development but disable in production for better performance
    sourcemap: process.env.NODE_ENV !== 'production',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/pages'),
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
    include: ['react', 'react-dom', 'framer-motion', 'gsap', 'three'],
    esbuildOptions: {
      target: 'esnext', // Optimize for modern browsers
    },
  },
  // Add esbuild options for better tree-shaking
  esbuild: {
    target: 'esnext',
    legalComments: 'none', // Remove license comments to decrease bundle size
  },
});