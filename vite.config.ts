import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === 'build' ? 'extracti' : '/',
}))
