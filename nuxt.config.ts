import { VitePWA } from "vite-plugin-pwa";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            link: [
                { rel: "stylesheet", href: "https://unpkg.com/pattern.css" }
                ],
            meta: [
                {
                    name: "viewport",
                    content:
                        "width=device-width, height=device-height, initial-scale=1, maximum-scale=1.0, user-scalable=yes",
                },
                {
                    "http-equiv": "ScreenOrientation",
                    content: "autoRotate:disabled",
                },
            ],
            // script: [
            //     {src: "https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.14.2/matter.js"}
            // ]
        },
    },
    dayjs: {
        locales: ["en"],
        plugins: ["relativeTime", "timezone", "utc", 'customParseFormat'],
        defaultLocale: "en",
    },
    devtools: { enabled: false },
    esbuild: {
        pure: ['console.log'],
      },
    quasar: {
        
        cssAddon: true,
        extras: {
            animations: [
                "fadeIn",
                "fadeOut",
                "fadeInDown",
                "fadeOutUp",
                "shakeX",
                "slideInUp",
                "slideInRight",
                "slideInLeft",
                "slideInDown",
                "slideOutLeft",
                "slideOutUp",
                "slideOutRight",
                "slideOutUp",
                "slideOutDown",
            ],
            fontIcons: ["material-icons-outlined", "material-icons"],
            
        },
        config: {
            brand: {
                primary: '#673ab7'
            },
            ripple: {

            }
        },
        plugins: ["Dialog", "Notify"],
        sassVariables: true,
    },
    modules: [
        "@nuxtjs/supabase",
        "@pinia/nuxt",
        "nuxt-quasar-ui",
        "@vueuse/nuxt",
        "dayjs-nuxt",
        // "@vite-pwa/nuxt",
        '@nuxt/image',
        '@pinia-orm/nuxt'
        // '@vueuse/components'
    ],
    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Nuxt Vite PWA',
            short_name: 'NuxtVitePWA',
          },
        workbox: {
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/(.+)\.supabase\.co\/storage\/v1\/object\/Avatars\/(.+)$/,
                    // urlPattern: /^https:\/\/(cdn.jsdelivr.net|patak.dev|github.com|avatars.githubusercontent.com)\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'avatars'
                    }
                },
            ],
        },
        client: {
            installPrompt: true,
        
          },
        devOptions: {
            enabled: false,
            suppressWarnings: true,
            navigateFallbackAllowlist: [/^\/$/],
            type: 'module',
          },
    },
    ssr: false,
    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
        client: {
            auth: {
                debug: true,
            },
        },
    },
    typescript: {
        typeCheck: false,
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use '@/styles/variables.scss' as *; @use '@/styles/global.scss' as *; @use '@/styles/container.scss' as *; @use '@/styles/zindex.scss' as *; `,
                },
            },
        },
    },
});
