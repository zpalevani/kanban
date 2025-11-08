import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // Use /kanban/ base path only for production builds (GitHub Pages)
  // For local dev (serve), use root path
  const base = command === 'serve' ? '/' : '/kanban/'
  
  return {
    plugins: [react()],
    base: base,
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      css: true,
    }
  }
})
