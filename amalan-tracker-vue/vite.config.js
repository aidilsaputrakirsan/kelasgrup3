// 📄 vite.config.js (BENAR - untuk Tailwind v4)
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss() // ✅ Plugin Tailwind v4
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: '/kelasgrup3/', // Untuk GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})