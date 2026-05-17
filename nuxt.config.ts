export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: ['@pinia/nuxt'],
  
  css: ['~/assets/css/tailwind.css'],
  
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  
  nitro: {
    routeRules: {
      '/api/**': { cors: true }
    }
  },
  
  compatibilityDate: '2025-07-15'
})