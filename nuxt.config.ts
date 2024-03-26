// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  static: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@tresjs/nuxt'
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
  googleFonts: {
    families: {
      Caladea: [300, 500, 700],
      Barlow: [300, 500, 700],
      Castoro: [300, 500, 700],
      Inter: [300, 500, 700],
      Arvo: [300, 500, 700],
    }
  }
});
