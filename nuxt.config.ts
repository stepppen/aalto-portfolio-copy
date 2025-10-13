// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/scripts',
    'nuxt-aos',
    '@vueuse/motion/nuxt',
    'nuxt-mdi'
  ],
  app: {
    head: {
      title: 'Vedunov Portfolio',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { name: 'Design Portfolio'}
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons'},
      ]
    }
  },
  googleFonts: {
    families: {
      Roboto: [300, 400, 700],
      "Bricolage Grotesque": [200, 300, 400, 500, 600, 700], 
      Lato: [300, 400]
    }
  },
  content: {
    markdown: {
      mdc: true
    }
  },
  aos: {
    duration: 500,
    easing: 'ease-out',
    offset: 100,
  },  

  compatibilityDate: '2025-08-27'
});