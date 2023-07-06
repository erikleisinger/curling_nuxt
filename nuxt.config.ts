// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  quasar: {
    cssAddon: true,
    extras: {
      animations: [
        'fadeIn',
        'fadeOut',
        'shakeX',
        'slideInDown',
        'slideInUp',
        'slideInRight',
        'slideInLeft',
      ]
    },
      plugins: [
        'Dialog'
      ],
      sassVariables: true,
  
  },
  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    'nuxt-quasar-ui',
    '@vueuse/nuxt',
  ],
  ssr: false,
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  typescript: {
    typeCheck: true,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/styles/variables.scss' as *;`
        }
      }
    }
  }
})
