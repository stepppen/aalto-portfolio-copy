<script setup lang="ts">
// A BIOS-style "Setup" screen for people who poke around: how the site is built.
// Opens with the Delete key (never Backspace, never while typing) or the footer "setup" link.
// Native <dialog>: focus is trapped inside, Esc closes it, focus returns where it was.
import qa from '~/assets/qa.json'
import tokens from '~~/tokens/dist.json'

const open = useSetupPanel()
const dialog = ref<HTMLDialogElement>()

watch(open, (v) => {
  const d = dialog.value
  if (!d) return
  if (v && !d.open) d.showModal()
  if (!v && d.open) d.close()
})

const typing = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName))

function onKey(e: KeyboardEvent) {
  if (e.key === 'Delete' && !e.metaKey && !e.ctrlKey && !e.altKey && !typing(e.target)) {
    e.preventDefault()
    open.value = true
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

type Score = { performance: number; accessibility: number; 'best-practices': number; seo: number; pages: number }
const lh = qa.lighthouse as Score | null
const { lang } = useLang()
const rows = computed(() => lang.value === 'de'
  ? [
      ['System', 'Nuxt 4, Vue 3 und Nuxt Content. Statische Seiten auf Netlify, kein Server, kein Tracking.'],
      ['Sprachen', 'Englisch und Schweizer Hochdeutsch. Gleiche Seiten, zwei Inhaltsordner, /de vor jeder Adresse.'],
      ['Tokens', 'Primitives → semantische Tokens → Komponenten, bei jedem Build kompiliert und auf Kontrast geprüft. Die gleiche Pipeline wie bei der Arbeit.'],
      ['Schrift', 'Inter Tight, Inter und Geist Mono, selbst gehostet, swap.'],
      ['Signal', `${tokens.signal} auf den Kacheln der Nebenprojekte und den Fokusrahmen. Der Lese-Schalter hat seine eigene rot-orange Taste, ${tokens.switch}.`],
      ['Bewegung', 'Seiten verschwimmen beim Wechseln, Abschnitte werden beim Scrollen scharf, Nachbarn treten beim Hover zurück. Alles aus bei reduzierter Bewegung.'],
      ['Barrierefreiheit', qa.axe === null ? 'Ziel WCAG 2.2 AA. Für diese Version noch nicht gemessen.' : `WCAG 2.2 AA. axe: ${qa.axe} Probleme auf jeder Seite.`],
      ['Performance', lh ? `Lighthouse mobil, ${lh.pages} Seiten: Performance ${lh.performance}, Barrierefreiheit ${lh.accessibility}, Best Practices ${lh['best-practices']}, SEO ${lh.seo} (jeweils der tiefste Wert).` : 'Lighthouse: für diese Version noch nicht gemessen.'],
      ['Tasten', 'Entf öffnet diesen Bildschirm. Esc schliesst ihn.'],
    ]
  : [
      ['System', 'Nuxt 4, Vue 3 and Nuxt Content. Static pages on Netlify, no server, no tracking.'],
      ['Languages', 'English and Swiss High German. Same pages, two content folders, /de in front of every address.'],
      ['Tokens', 'Primitives → semantic tokens → components, compiled and contrast-checked on every build. The same pipeline I use at work.'],
      ['Type', 'Inter Tight, Inter and Geist Mono, self-hosted, swap.'],
      ['Signal', `${tokens.signal} on the side-project tiles and focus rings. The read-mode switch gets its own red-orange keycap, ${tokens.switch}.`],
      ['Motion', 'Pages blur in and out, sections sharpen as you scroll, and neighbours step back when you hover. All of it stops with reduced motion.'],
      ['Accessibility', qa.axe === null ? 'WCAG 2.2 AA target. Not measured for this version yet.' : `WCAG 2.2 AA. axe: ${qa.axe} issues on every page.`],
      ['Performance', lh ? `Lighthouse mobile, ${lh.pages} pages: performance ${lh.performance}, accessibility ${lh.accessibility}, best practices ${lh['best-practices']}, SEO ${lh.seo} (lowest of each).` : 'Lighthouse: not measured for this version yet.'],
      ['Keys', 'Delete opens this screen. Esc closes it.'],
    ])
</script>

<template>
  <dialog
    ref="dialog"
    class="setup"
    aria-labelledby="setup-title"
    @close="open = false"
    @click.self="open = false"
  >
    <div class="setup__box">
      <p id="setup-title" class="setup__title">{{ lang === 'de' ? 'vedunov.com Setup-Programm' : 'vedunov.com setup utility' }}</p>
      <dl class="setup__rows">
        <div v-for="([k, v], i) in rows" :key="k" class="setup__row" :class="{ 'is-selected': i === 0 }">
          <dt>{{ k }}</dt>
          <dd>{{ v }}</dd>
        </div>
      </dl>
      <div class="setup__foot">
        <span>{{ qa.measured ? `${lang === 'de' ? 'letzte Prüfung' : 'last check'} ${qa.measured}` : 'v2' }}</span>
        <button type="button" class="setup__close" autofocus @click="open = false">{{ lang === 'de' ? 'esc zum Schliessen' : 'esc to close' }}</button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.setup {
  margin: auto; /* the global reset removes the dialog's own centring */
  width: min(44rem, calc(100vw - 2 * var(--layout-margin)));
  max-height: calc(100dvh - 2 * var(--space-8));
  padding: 0;
  border: 0;
  background: var(--ink);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: var(--text-mono);
  line-height: 1.6;
}

.setup::backdrop { background: var(--scrim); }

.setup__box {
  margin: var(--space-2);
  padding: var(--space-6);
  border: 4px double var(--bg);
}

.setup__title { margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--bg); }

.setup__rows { display: grid; gap: var(--space-1); }

.setup__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0 var(--space-4);
  padding: var(--space-1) var(--space-2);
}

.setup__row dd { margin: 0; }

.setup__row.is-selected { background: var(--signal); color: var(--ink); }

.setup__foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--bg);
}

.setup__close {
  min-height: var(--layout-tap);
  padding: 0 var(--space-3);
  border: 1px solid var(--bg);
  border-radius: 0;
  background: none;
  color: var(--bg);
  font: inherit;
}

.setup__close:hover { background: var(--bg); color: var(--ink); }

.setup :focus-visible { outline-color: var(--signal); }

@media (width >= 40rem) {
  .setup__row { grid-template-columns: 9rem 1fr; }
}
</style>
