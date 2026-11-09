// Runs before first paint: applies the remembered read mode so case studies never jump.
// Without JS there's no attribute, and nothing is collapsed.
const readModeBootstrap = `(function(){var m='quick';try{var s=localStorage.getItem('readMode');if(s==='full'||s==='quick')m=s}catch(e){}document.documentElement.setAttribute('data-read',m)})()`

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',

  // Cookie-free visitor stats (Cloudflare Web Analytics). Off until the token is set as
  // NUXT_PUBLIC_CF_ANALYTICS_TOKEN in Netlify's environment variables; no cookies, so no banner.
  runtimeConfig: { public: { cfAnalyticsToken: '' } },
  devtools: { enabled: false },

  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/fonts'],

  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Stepan Vedunov is an interaction designer in Zurich, working between design and code. Health and enterprise software at OWT, and Kymu, game-based physiotherapy.' },
        { name: 'theme-color', content: '#FFFFFF' },
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
      script: [{ innerHTML: readModeBootstrap, tagPosition: 'head', tagPriority: 'critical' }],
    },
  },

  // The two regular faces are preloaded (about 34 KB together), so the first paint is already in
  // Inter and Geist Mono instead of a fallback that swaps a moment later, which read as "a different
  // font" on whichever page loaded first. No italics on the site, so no italic files.
  // Latin covers German, French and Spanish; rare glyphs (e.g. Š) fall back per character.
  fonts: {
    defaults: { subsets: ['latin'], styles: ['normal'], preload: true },
    families: [
      // Only the weights the design uses: static files are about half the size of the variable ones.
      { name: 'Inter', provider: 'google', weights: [400] }, // one weight → a small static file instead of the 48 KB variable one
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
    '/work/design-to-code': { redirect: { to: '/work', statusCode: 302 } },
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
    // German pages: every route also exists under /de, rendered by the same page component.
    // Pages read the language from the URL (useLang) and query the *_de content collections.
    'pages:extend'(pages) {
      const de = pages.map((p) => ({ ...p, name: `de-${String(p.name)}`, path: p.path === '/' ? '/de' : `/de${p.path}` }))
      pages.push(...de)
    },
    // three.js and the tile scenes download only when a tile actually starts, never as a
    // page-load prefetch: on a phone that prefetch competed with the first image for bandwidth.
    'build:manifest'(manifest) {
      const isTile = (key: string) => /node_modules\/three\/|(^|\/)tiles\//.test(key)
      const tileKeys = Object.keys(manifest).filter(isTile)
      // Shared chunks (e.g. three.js once several scenes use it) that only tile scenes import.
      const tileOnly = new Set(tileKeys.flatMap((k) => manifest[k]?.imports ?? []))
      for (const [key, chunk] of Object.entries(manifest)) {
        if (!isTile(key) && !tileOnly.has(key)) (chunk.imports ?? []).forEach((d) => tileOnly.delete(d))
      }
      for (const key of [...tileKeys, ...tileOnly]) {
        const chunk = manifest[key]
        if (chunk) { chunk.prefetch = false; chunk.preload = false }
      }
    },
  },

  nitro: {
    preset: 'netlify-static',
    // Old /projects/* URLs and the archive pages aren't linked from the new home yet,
    // so list them explicitly: this emits the redirect pages for every old URL.
    prerender: {
      crawlLinks: true,
      routes: ['/', '/de', ...['kymu', 'vr-learning-tool', 'volkswagen-hmi', 'llm-drawing-robot', 'ticket-machine-zvv'].flatMap((s) => [`/projects/${s}`, `/work/${s}`])],
      // Notes is hidden for now (no published notes, no nav link). Nuxt builds every static page
      // on its own, so skip it here. To bring Notes back: publish a note (draft: false) and
      // delete this line.
      ignore: ['/notes', '/de/notes'],
    },
  },
})
