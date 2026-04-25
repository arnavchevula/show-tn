// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark', // Can be 'system', 'light', or 'dark'
    fallback: 'dark',     // Fallback if preference cannot be determined
    classSuffix: '',      // Optional: if you want to use a specific class for color mode
  },
  routeRules: {
    '/': { prerender: true }
  },
  runtimeConfig: {
    taskSecret: null,
    twilioRecoverCode: process.env.TWILIO_KEY || '', 
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseSecretServer: process.env.SUPABASE_SECRET_SERVER,
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseApiKeyBrowser: process.env.SUPABASE_API_KEY_BROWSER,
      archiveDbName: process.env.ARCHIVE_DB_NAME || 'archived-events-qa',
      dbName: process.env.DB_NAME || 'events-qa',
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