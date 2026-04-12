import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor'
            if (id.includes('lucide-react') || id.includes('framer-motion') || id.includes('react-hot-toast')) return 'ui-vendor'
            if (id.includes('i18next')) return 'i18n-vendor'
            if (id.includes('@reduxjs')) return 'redux-vendor'
            return 'vendor'
          }
        }
      }
    },
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})