import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps for production
    rollupOptions: {
      output: {
        // Better chunking strategy to avoid circular dependencies
        manualChunks: (id) => {
          // Separate node_modules into vendor chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            return 'vendor';
          }
          
          // Separate large components into their own chunks
          if (id.includes('src/components/LandingPage')) {
            return 'landing';
          }
          if (id.includes('src/components/FeaturesPage') || id.includes('src/components/AdditionalFeaturesPage')) {
            return 'features';
          }
          if (id.includes('src/components/Modals')) {
            return 'modals';
          }
          if (id.includes('src/components/Dashboard')) {
            return 'dashboard';
          }
        },
        // Ensure consistent chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/js/${chunkInfo.name}-[hash].js`;
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: [],
    esbuildOptions: {
      target: 'es2015'
    }
  },
  // Add server configuration for local development
  server: {
    port: 5173,
    strictPort: false,
    open: true
  }
})
