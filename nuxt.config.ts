// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark', // Can be 'system', 'light', or 'dark'
    fallback: 'dark',     // Fallback if preference cannot be determined
    classSuffix: '',      // Optional: if you want to use a specific class for color mode
  },
  runtimeConfig: {
    taskSecret: null,
    twilioRecoverCode: process.env.TWILIO_KEY || '', 
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseSecretServer: process.env.SUPABASE_SECRET_SERVER,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseApiKeyBrowser: process.env.SUPABASE_API_KEY_BROWSER
    }
  },
  nitro: {
    experimental: {
      tasks: true
    },
    // scheduledTasks: {
    //   // Run `cms:update` task every minute
    //   '51 * * * *': ['cms:update']
    // }
  }
})