import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://e-shop-1-m034.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
