// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@nuxt/image', '@nuxt/content'],
  head: {
    title: 'Vedunov',
    meta: [
      { name: 'description', content: 'Design Portfolio'}
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons'}
    ]
  },

  // app: {
  //   pageTransition: { name: 'slide-fade', mode: 'out-in' },
  //   layoutTransition: { name: 'project-fade', mode: 'out-in' }
  // },
  googleFonts: {
    families: {
      Roboto: [300, 400, 700],
      "Bricolage Grotesque": [200, 300, 400, 600], 
      "Space Grotesk": [300, 400, 600],
      Lato: [300, 400, 700]
    }
  },
  content: {
    markdown: {
      mdc: true
    }
  },

  compatibilityDate: '2025-04-01'
});