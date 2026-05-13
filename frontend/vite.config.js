import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward all /api requests to the Node.js backend on port 5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // We keep /api in the URL because our server.js routes now include it
      },
    },
  },
})