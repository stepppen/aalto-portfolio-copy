// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  static: true,

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts'
  ],

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
      Caladea: [300, 500, 700],
      Barlow: [300, 500, 700],
      "Playfair Display": {
        wght: '200..900',
        ital: '200..700',
      },
      Castoro: [300, 500, 700],
      Inter: [300, 500, 700],
      Arvo: [300, 500, 700],
      Roboto: [300, 400, 700]
      
    }
  },

  compatibilityDate: '2025-04-01'
});