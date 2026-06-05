import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('xlsx')) {
            return 'vendor-xlsx'
          }

          if (id.includes('html2canvas')) {
            return 'vendor-html2canvas'
          }

          if (id.includes('dompurify')) {
            return 'vendor-dompurify'
          }

          if (id.includes('jspdf-autotable')) {
            return 'vendor-jspdf-autotable'
          }

          if (id.includes('jspdf')) {
            return 'vendor-jspdf'
          }

          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'vendor-charts'
          }

          if (id.includes('framer-motion')) {
            return 'vendor-motion'
          }

          if (id.includes('react-icons') || id.includes('lucide-react') || id.includes('@heroicons')) {
            return 'vendor-icons'
          }

          if (id.includes('react-router')) {
            return 'vendor-router'
          }

          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react'
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
