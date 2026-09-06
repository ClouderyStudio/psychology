import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: ['@pinia/nuxt'],
  
  css: ['~/assets/css/tailwind.css'],
  
  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    clouderyApiBase: process.env.CLOUDERY_API_BASE || 'https://localhost:7288',
    public: {
      clouderyApiBase: process.env.NUXT_PUBLIC_CLOUDERY_API_BASE || 'https://localhost:7288',
    },
  },

  compatibilityDate: '2025-07-15'
})