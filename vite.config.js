import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFile } from 'node:fs/promises'

const pagesFallback = {
  name: 'github-pages-spa-fallback',
  async closeBundle() {
    await copyFile('dist/index.html', 'dist/404.html')
  },
}

export default defineConfig({ plugins: [react(), pagesFallback], base: '/' })
