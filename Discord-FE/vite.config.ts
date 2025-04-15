import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/messages': {
        target: 'http://localhost:8089',
        changeOrigin: true,
        secure: false,
      },
      // Nếu có các endpoint khác cũng cần proxy, bạn có thể thêm tại đây
    },
  },
})
