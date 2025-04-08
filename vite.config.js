import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression'; // Import the compression plugin
import { splitVendorChunkPlugin } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(), // Split vendor chunks for better caching
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
    // Optimize images
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
      pngquant: {
        quality: [0.7, 0.8],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
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
        manualChunks: (id) => {
          // If the id is not a string, return undefined
          if (typeof id !== 'string') return undefined;

          // Check for specific modules
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom/')) {
            return 'react-vendor';
          }
          
          if (id.includes('node_modules/framer-motion/') || 
              id.includes('node_modules/tailwindcss/')) {
            return 'ui-framework';
          }
          
          if (id.includes('node_modules/three/build/')) {
            return 'three-core';
          }
          
          if (id.includes('node_modules/three/examples/jsm/')) {
            return 'three-addons';
          }
          
          if (id.includes('node_modules/gsap/')) {
            return 'gsap';
          }

          // Handle potentially problematic packages separately
          if (id.includes('node_modules/react-animated-cursor/')) {
            return 'cursor-vendor';
          }

          if (id.includes('node_modules/@tsparticles/') || 
              id.includes('node_modules/tsparticles/') ||
              id.includes('node_modules/react-tsparticles/')) {
            return 'particles-vendor';
          }
        },
        // Larger chunks get their own files, which helps with caching
        chunkSizeWarningLimit: 800,
        // Use content hash for better caching
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
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
      target: 'es2020', // Change from esnext to es2020 for better compatibility
    },
  },
  // Add esbuild options for better tree-shaking
  esbuild: {
    target: 'es2020', // Change from esnext to es2020 for better compatibility
    legalComments: 'none', // Remove license comments to decrease bundle size
    treeShaking: true,
  },
});