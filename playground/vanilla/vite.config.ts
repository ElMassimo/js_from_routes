import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import VuePlugin from '@vitejs/plugin-vue'
import WindiCSSPlugin from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [
    VuePlugin(),
    RubyPlugin(),
    WindiCSSPlugin({
      root: __dirname,
      scan: {
        fileExtensions: ['html', 'erb', 'vue', 'js', 'ts'],
        dirs: ['app/javascript', 'app/views'],
      },
    }),
  ],
})
