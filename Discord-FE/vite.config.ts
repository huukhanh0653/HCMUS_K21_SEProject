import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy tất cả request /send về http://localhost:8082/send
      "/send": {
        target: "http://localhost:8082",
        changeOrigin: true,
      },
      // Proxy SockJS endpoint
      "/ws": {
        target: "http://localhost:8082",
        ws: true,
        changeOrigin: true,
      },
      // Nếu bạn có GraphQL tại /graphql
      "/graphql": {
        target: "http://localhost:8082",
        changeOrigin: true,
      },
    },
  },
});
