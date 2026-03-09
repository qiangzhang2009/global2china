import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-i18next'],
          'gsap': ['gsap'],
          'lucide': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-i18next', 'gsap', 'lucide-react'],
  },
})
