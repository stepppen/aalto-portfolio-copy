import type { RouterConfig } from '@nuxt/schema'

// Where the page lands after a navigation. Nuxt's default waits for the page transition to report
// that it finished, and with our out-in fade that signal didn't always come, so a link from the
// middle of one page (e.g. "Read more" under About on the landing) opened the next page in the
// middle too. Here: once the new page has rendered, go to the top, to the #anchor, or, on
// back/forward, to where the reader was. A timer makes sure it happens even if no hook fires.
export default <RouterConfig>{
  scrollBehavior(to, from, saved) {
    // Same page, only the hash changed: scroll to it smoothly. Otherwise leave the page alone.
    if (to.path === from.path) return to.hash ? { el: to.hash, behavior: 'smooth' } : false

    const nuxtApp = useNuxtApp()
    // Instant, not the site's smooth scrolling: the new page should simply open at the right spot.
    const target = () => ({ ...(saved ?? (to.hash ? { el: to.hash } : { left: 0, top: 0 })), behavior: 'instant' as ScrollBehavior })
    return new Promise((resolve) => {
      let done = false
      const go = () => {
        if (done) return
        done = true
        requestAnimationFrame(() => resolve(target()))
      }
      nuxtApp.hooks.hookOnce('page:finish', go)
      setTimeout(go, 600)
    })
  },
}
