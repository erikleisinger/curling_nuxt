import path from "path";
import { clientPlugin, defineConfig } from "@vitebook/client/node";
import { vuePlugin } from "@vitebook/vue/node";
import { defaultThemePlugin } from "@vitebook/theme-default/node";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { QuasarResolver } from "unplugin-vue-components/resolvers";
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
    include: ["**/*.story.vue"],
    plugins: [
        vuePlugin({ appFile: "App.vue" }),
        clientPlugin(),
        defaultThemePlugin(),
        vue({ include: /\.(md|vue)/ }),
        AutoImport({
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/, // .md
            ],
            imports: [
                "vue",
            ],
            dirs: [
                "composables"
            ],
            vueTemplate: true,
            injectAtEnd: false,
        }),
        Components({
            dirs: [
                "components",
                // Component folders that should be auto-imported
            ],
            dts: true,
            directoryAsNamespace: true,
            resolvers: [QuasarResolver()],
        }),
        quasar({
            sassVariables: 'quasar/src/css/index.sass'
          })
       
    ],
    alias: {
        "@": path.resolve(__dirname, "/"),
        // Add any other aliases you use in your code base
        // https://nuxt.com/docs/api/configuration/nuxt-config/#alias
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";`
            }
        }
    },
    site: {
        title: "curling",
        description: "",
        /** @type {(import('@vitebook/theme-default/node').DefaultThemeConfig} */
        theme: {},
    },
    
});
