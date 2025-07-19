import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    // Thêm cấu hình này
    host: true, // Tương đương với việc chạy cờ --host
    allowedHosts: ['ec2-3-0-101-133.ap-southeast-1.compute.amazonaws.com'],
  },
})
