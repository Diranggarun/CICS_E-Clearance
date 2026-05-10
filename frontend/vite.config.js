<<<<<<< HEAD
// vite.config.js
=======
>>>>>>> 5accb46445691198462fa55466598b2aa3c568d0
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Use 127.0.0.1 to avoid localhost resolution issues
        changeOrigin: true,
        
      },
    },
  },
})
=======
    port: 5173,
    proxy: {
      // Proxy API calls to the backend — update the target once backend is ready
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
>>>>>>> 5accb46445691198462fa55466598b2aa3c568d0
