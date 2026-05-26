import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
export default defineConfig({
  plugins: [react(),
    basicSsl()

  ],
  server: {
    host: true, // This allows the 192.168.1.133 connection
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})