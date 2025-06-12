import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy any /api/** to Flask
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Proxy Socket.IO websocket endpoint
      '/socket.io': {
        target: 'ws://localhost:5000',
        ws: true,
      },
    }
  }
})
