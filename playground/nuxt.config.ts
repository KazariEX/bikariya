export default defineNuxtConfig({
    compatibilityDate: "latest",
    experimental: {
        typescriptPlugin: true,
    },
    future: {
        compatibilityVersion: 5,
    },
    modules: [
        "@bikariya/image-viewer",
        "@bikariya/modals",
        "@bikariya/shiki",
        "@nuxt/image",
        "@pinia/nuxt",
        "@unocss/nuxt",
        "@vueuse/nuxt",
    ],
});
