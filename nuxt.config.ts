// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no'},
        {"http-equiv": "ScreenOrientation", content: "autoRotate:disabled"}
      ]
    },
  },
  devtools: { enabled: false },
  quasar: {
    cssAddon: true,
    extras: {
      animations: [
        'fadeIn',
        'fadeOut',
        'shakeX',
        'slideInUp',
        'slideInRight',
        'slideInLeft',
        'slideOutLeft',
        'slideOutRight',
        'slideOutUp',
        'slideOutDown',
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
    typeCheck: false,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/styles/variables.scss' as *; @use '@/styles/global.scss' as *;`
        }
      }
    }
  }
})
