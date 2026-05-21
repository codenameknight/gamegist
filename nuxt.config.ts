// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    // Hem server hem de client tarafında erişilebilir
    public: {
      rawgKey: "",
    },
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/supabase",
  ],
  tailwindcss: {
    config: {
      darkMode: "class",
    },
  },
  supabase: {
    redirect: false,
    types: "~/types/database.types.ts",
  },
  css: ["~/assets/css/main.css"],
  experimental: {
    appManifest: false,
  },
});
