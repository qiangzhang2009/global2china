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
        manualChunks: (id) => {
          // React核心库 - 不包含scheduler
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          // i18n库
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'i18n-vendor';
          }
          // GSAP动画库
          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }
          // 图标库
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }
          // 其他node_modules (排除react和scheduler)
          if (id.includes('node_modules') && !id.includes('scheduler')) {
            return 'vendors';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    minify: 'esbuild',
    // 移动端优化
    target: 'es2015',
    cssCodeSplit: true,
    modulePreload: {
      polyfill: true,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-i18next', 'gsap', 'lucide-react'],
  },
})
