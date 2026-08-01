import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: ['@pinia/nuxt'],
  
  css: ['~/assets/css/tailwind.css'],
  
  vite: {
    plugins: [tailwindcss()],
  },
  
  nitro: {
    routeRules: {
      '/api/**': { cors: true }
    }
  },
  
  compatibilityDate: '2025-07-15'
})