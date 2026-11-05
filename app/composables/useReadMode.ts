export type ReadMode = 'quick' | 'full'

/**
 * Quick read ⇄ Full story, remembered across case studies.
 * A head script (nuxt.config) sets <html data-read> before first paint from localStorage,
 * so the page never jumps. Without JS nothing is collapsed.
 * In quick mode the extra sections get hidden="until-found": still in the HTML, still found
 * by Ctrl+F (which flips to Full story via the beforematch event).
 */
export function useReadMode() {
  const mode = useState<ReadMode>('read-mode', () => 'quick')

  function apply() {
    if (import.meta.server) return
    const html = document.documentElement
    html.setAttribute('data-read', mode.value)
    document.querySelectorAll<HTMLElement>('.cs--quick .rm-extra').forEach((el) => {
      if (mode.value === 'quick') el.setAttribute('hidden', 'until-found')
      else el.removeAttribute('hidden')
    })
    html.setAttribute('data-rm-ready', '')
  }

  function set(next: ReadMode) {
    mode.value = next
    try { localStorage.setItem('readMode', next) } catch { /* private mode: still works for this page */ }
    apply()
  }

  function init() {
    const saved = document.documentElement.getAttribute('data-read')
    mode.value = saved === 'full' ? 'full' : 'quick'
    apply()
    document.querySelectorAll<HTMLElement>('.cs--quick .rm-extra').forEach((el) =>
      el.addEventListener('beforematch', () => set('full'), { once: true }),
    )
  }

  return { mode: readonly(mode), set, init, apply }
}
