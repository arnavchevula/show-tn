// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark', // Can be 'system', 'light', or 'dark'
    fallback: 'dark',     // Fallback if preference cannot be determined
    classSuffix: '',      // Optional: if you want to use a specific class for color mode
  },
  nitro: {
    runtimeConfig: {
      taskSecret: null,
      twilioRecoverCode: 'U5AF1WBKQ3RZ61RHY2VVDPAB', 
      supabaseUrl: 'https://zylpuvjzvdyzfedpqqqh.supabase.co',
      supabaseKey:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bHB1dmp6dmR5emZlZHBxcXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODc3OTgsImV4cCI6MjA3ODQ2Mzc5OH0.C0vSNceaiUKdASequxfd4olYkXrIWx0FOTnURjUUDIM'
    },
    experimental: {
      tasks: true
    },
    scheduledTasks: {
      // Run `cms:update` task every minute
      '51 * * * *': ['cms:update']
    }
  }
})