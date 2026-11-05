export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },

  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/fonts'],

  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Stepan Vedunov, product designer in Zurich who builds the bridge to code. Health and enterprise software at OWT and Kymu.' },
        { name: 'theme-color', content: '#FFFFFF' },
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },

  // No font preloads: text paints at once in a metric-matched fallback, then swaps.
  // Latin covers German, French and Spanish; rare glyphs (e.g. Š) fall back per character.
  fonts: {
    defaults: { subsets: ['latin'], preload: false },
    families: [
      // Only the weights the design uses: static files are about half the size of the variable ones.
      { name: 'Inter', provider: 'google', weights: [400, 500] },
      { name: 'Inter Tight', provider: 'google', weights: [400] },
      { name: 'Geist Mono', provider: 'google', weights: [400] },
    ],
  },

  // Inline component CSS into the HTML instead of separate render-blocking stylesheets.
  features: { inlineStyles: true },

  experimental: {
    // Prefetch other pages on hover/focus, not as soon as a link scrolls into view.
    defaults: { nuxtLink: { prefetchOn: { interaction: true, visibility: false } } },
  },

  image: {
    // Pre-render every image size at build time: the site is static, no image server.
    // (In dev there's nothing pre-rendered, so use the live ipx server.)
    provider: process.env.NODE_ENV === 'production' ? 'ipxStatic' : 'ipx',
    format: ['avif', 'webp'],
    quality: 80,
  },

  content: {
    experimental: { sqliteConnector: 'native' },
  },

  // With the netlify-static preset these become real 301s (_redirects) and headers (_headers).
  routeRules: {
    '/projects/**': { redirect: { to: '/work/**', statusCode: 301 } },
    '/playground': { redirect: { to: '/', statusCode: 301 } },
    '/cv.pdf': { redirect: { to: '/Stepan_Vedunov_CV.pdf', statusCode: 301 } },
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    },
    '/_ipx/**': { headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' } },
  },

  hooks: {
    // three.js and the tile scenes download only when a tile actually starts, never as a
    // page-load prefetch: on a phone that prefetch competed with the first image for bandwidth.
    'build:manifest'(manifest) {
      for (const [key, chunk] of Object.entries(manifest)) {
        if (/node_modules\/three\/|(^|\/)tiles\//.test(key)) { chunk.prefetch = false; chunk.preload = false }
      }
    },
  },

  nitro: {
    preset: 'netlify-static',
    // Old /projects/* URLs and the archive pages aren't linked from the new home yet,
    // so list them explicitly: this emits the redirect pages for every old URL.
    prerender: {
      crawlLinks: true,
      routes: ['/', ...['kymu', 'vr-learning-tool', 'volkswagen-hmi', 'llm-drawing-robot', 'ticket-machine-zvv'].flatMap((s) => [`/projects/${s}`, `/work/${s}`])],
    },
  },
})
