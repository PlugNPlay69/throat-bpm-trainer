import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/throat-bpm-trainer/",
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [vue(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,
    base: "/throat-bpm-trainer/",
    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'throat-bpm-trainer',
      short_name: 'throat-bpm-trainer',
      description: 'throat-bpm-trainer',
      theme_color: '#7e2ba8',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})
