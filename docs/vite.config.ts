import { resolve } from 'path'
import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [
    WindiCSS({
      preflight: false,
      scan: {
        dirs: [resolve(__dirname, '.vitepress/theme/components')],
      },
    }),
  ],
})
