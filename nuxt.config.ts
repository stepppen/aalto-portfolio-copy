export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/scripts',
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
        { name: 'description', content: 'Design Portfolio' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://www.youtube.com' },
        { rel: 'preconnect', href: 'https://img.youtube.com' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
          media: 'print',
          onload: "this.media='all'"
        }
      ]
    }
  },

  googleFonts: {
    families: {
      Roboto: [300, 400],
      "Bricolage Grotesque": [400, 500],
      Lato: [300, 400]
    },
    display: 'swap',
    preload: true,
    prefetch: true,
    preconnect: true,
    download: false,
    inject: true,
    useStylesheet: true
  },

  image: {
    format: ['webp', 'avif'],
    quality: 85,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      project: {
        modifiers: {
          format: 'webp',
          quality: 85,
          loading: 'lazy'
        }
      }
    }
  },

  content: {
    highlight: {
      theme: 'github-dark',
      preload: ['vue', 'javascript', 'typescript']
    },
    markdown: {
      anchorLinks: false,
    },
    experimental: {
      clientDB: false, 
      stripQueryParameters: true
    }
  },

  routeRules: {
    '/': { swr: 3600 },
    '/projects/**': { swr: 3600 },
    '/about': { prerender: true }
  },

  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    viewTransition: false
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/three/')) {
              if (id.includes('examples/jsm')) {
                return 'three-addons'; 
              }
              return 'three-core'; 
            }
            
            if (id.includes('node_modules/vue') || 
                id.includes('node_modules/@vue')) {
              return 'vue-vendor';
            }
            
            if (id.includes('node_modules/@nuxt') || 
                id.includes('node_modules/nuxt')) {
              return 'nuxt-vendor';
            }
            
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      },
      chunkSizeWarningLimit: 600, 
      cssCodeSplit: true,
      minify: 'esbuild', 
      target: 'es2020' 
    },
    optimizeDeps: {
      include: [
        'three',
        'three/examples/jsm/loaders/GLTFLoader.js',
        'three/examples/jsm/effects/AsciiEffect.js'
      ]
    }
  },

  compatibilityDate: '2025-08-27'
});