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
    piniaOrm: {
        model: {
            withMeta: true
        }
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
                "zoomIn",
                "zoomOut"
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
        '@pinia-orm/nuxt',
    ],
    image: {
        inject: true,
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
