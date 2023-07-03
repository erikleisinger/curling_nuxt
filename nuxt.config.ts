// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  quasar: {
    extras: {
      animations: [
        'shakeX'
      ]
    },
      plugins: [
        'Dialog'
      ],
  
  },
  modules: [
    '@nuxt/devtools',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    'nuxt-quasar-ui',
    '@vueuse/nuxt',
  ],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  }
})
