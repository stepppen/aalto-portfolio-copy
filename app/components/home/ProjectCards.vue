<script setup lang="ts">
// Project cards row (Valdivia-style): big rounded media cards, title + one-liner + mono tags
// bottom-left, a collaborator quote bottom-right, the next card peeking in from the right.
// Desktop: previous/next arrows. Phone: native swipe (scroll snap). Keyboard: Tab moves through
// the card links and the browser scrolls each into view; the arrows are ordinary buttons.
import type { WorkCollectionItem } from '@nuxt/content'

defineProps<{ projects: WorkCollectionItem[] }>()
const slug = (p: WorkCollectionItem) => p.path.split('/').pop()
const { t, lp } = useLang()
const isTodo = (s?: string) => !s || /^\[TODO/i.test(s)
// Cards with a photo get white text on a scrim; confidential/missing/svg media get the light variant.
const variant = (p: WorkCollectionItem) =>
  p.confidential ? 'dark' : p.cover?.src && !p.cover.src.endsWith('.svg') ? 'photo' : 'light'

const row = ref<HTMLElement>()
const atStart = ref(true)
const atEnd = ref(false)
function update() {
  const el = row.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
}
function step(dir: 1 | -1) {
  const el = row.value
  if (!el) return
  const card = el.querySelector('li') as HTMLElement | null
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0
  el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth) + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
onMounted(update)
</script>

<template>
  <section class="cards" aria-labelledby="cards-title">
    <h2 id="cards-title" class="sr-only">{{ t('cards.title') }}</h2>
    <ul ref="row" class="cards__row hover-dim" role="list" @scroll.passive="update">
      <li v-for="p in projects" :key="p.path" class="card" :class="`card--${variant(p)}`">
        <NuxtLink :to="lp(p.href ?? `/work/${slug(p)}`)" class="card__link">
          <NuxtImg
            v-if="variant(p) === 'photo'"
            :src="p.cover!.src"
            :alt="p.cover!.alt ?? ''"
            class="card__media"
            sizes="sm:70vw md:68vw xl:930px"
            densities="x1 x2"
            format="webp"
            :quality="p === projects[0] ? 65 : undefined"
            :loading="p === projects[0] ? 'eager' : 'lazy'"
            :fetchpriority="p === projects[0] ? 'high' : undefined"
          />
          <img
            v-else-if="p.cover?.src"
            :src="p.cover.src"
            :alt="p.cover.alt ?? ''"
            class="card__media card__media--contain"
            loading="lazy"
          >
          <p v-else-if="p.confidential" class="card__confidential t-mono">{{ t('confidential') }}</p>
          <p v-else class="card__missing"><Txt :text="p.cover?.todo" /></p>

          <span class="card__body">
            <span class="card__title">{{ p.title }}<span class="sr-only">. </span></span>
            <span class="card__line">{{ p.outcome }}<span class="sr-only"> </span></span>
            <span v-if="p.tags?.length" class="card__tags">
              <span v-for="t in p.tags" :key="t" class="pill">{{ t }}</span>
            </span>
          </span>
        </NuxtLink>
        <figure v-if="p.quote" class="card__quote">
          <blockquote><Txt :text="isTodo(p.quote.text) ? p.quote.text : `“${p.quote.text}”`" /></blockquote>
          <figcaption><Txt :text="p.quote.name" /><template v-if="p.quote.role">, <Txt :text="p.quote.role" /></template></figcaption>
        </figure>
      </li>
    </ul>
    <div class="cards__nav">
      <button type="button" class="cards__btn" :disabled="atStart" :aria-label="t('cards.prev')" @click="step(-1)">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m14.5 6-6 6 6 6" /></svg>
      </button>
      <button type="button" class="cards__btn" :disabled="atEnd" :aria-label="t('cards.next')" @click="step(1)">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m9.5 6 6 6-6 6" /></svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.cards { position: relative; }

.cards__row {
  display: flex;
  gap: var(--layout-gutter);
  padding: 0 var(--layout-margin);
  margin: 0;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--layout-margin);
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}

.cards__row::-webkit-scrollbar { display: none; }

.card {
  position: relative;
  flex: 0 0 78%;
  display: flex;
  flex-direction: column;
  scroll-snap-align: start;
  overflow: hidden;
  border-radius: var(--radius-card);
  background: var(--panel);
  isolation: isolate;
}

/* Phone: image on top, then title, tags and quote on a solid panel. */
.card__link { display: flex; flex-direction: column; flex: 1; color: inherit; text-decoration: none; }

.card__link:focus-visible { outline-offset: -4px; border-radius: var(--radius-card); }

.card__media { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; }

.card__media--contain { object-fit: contain; padding: var(--space-6); background: var(--panel); }

.card__confidential, .card__missing {
  display: grid;
  place-items: center;
  aspect-ratio: 3 / 2;
  padding: var(--space-6);
  text-align: center;
}

.card__body { display: grid; gap: var(--space-1); padding: var(--space-6) var(--space-6) var(--space-4); }

.card__title { font-size: var(--text-heading); letter-spacing: var(--tracking-heading); }

.card__line { font-size: var(--text-small); max-width: 42ch; }

.card__tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-3); }

.card__quote {
  display: grid;
  gap: var(--space-2);
  margin: 0 var(--space-4) var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-media);
  font-size: var(--text-small);
  line-height: 1.45;
  background: var(--bg);
  color: var(--ink);
}

.card__quote figcaption { color: var(--ink-muted); }

.card--photo, .card--dark { background: var(--ink); color: var(--on-media); }

.card--photo .card__quote, .card--dark .card__quote { background: var(--scrim); color: var(--on-media); }

.card--photo .card__quote figcaption, .card--dark .card__quote figcaption { color: var(--on-media); opacity: 0.8; }

.card--light { color: var(--ink); }

.card--light .card__line { color: var(--ink-muted); }

.cards__nav { display: none; }

@media (width >= 64rem) {
  /* Desktop: one big media card; text overlays bottom-left, the quote bottom-right. */
  .card { flex-basis: min(58rem, 68%); aspect-ratio: 16 / 10; display: block; }

  .card__link { position: absolute; inset: 0; display: block; }

  .card__media { position: absolute; inset: 0; height: 100%; aspect-ratio: auto; }

  .card__media--contain { padding: 6% 6% 28%; }

  .card__confidential, .card__missing { position: absolute; inset: 0 0 35%; aspect-ratio: auto; }

  .card__body { position: absolute; inset: auto 30% 0 0; z-index: 1; padding: var(--space-8); }

  .card--photo .card__body { padding-top: 30%; background: linear-gradient(to top, var(--scrim) 0%, var(--scrim) 50%, transparent 100%); inset-inline-end: 0; padding-inline-end: 30%; }

  .card__quote {
    position: absolute;
    right: var(--space-6);
    bottom: var(--space-6);
    z-index: 2;
    width: min(24rem, 38%);
    margin: 0;
    padding: var(--space-4) var(--space-6);
    backdrop-filter: blur(12px);
    pointer-events: none;
  }

  .cards__nav {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
    padding: var(--space-4) var(--layout-margin) 0;
  }

  .cards__btn {
    display: grid;
    place-items: center;
    width: var(--layout-tap);
    height: var(--layout-tap);
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-pill);
    background: var(--bg);
    color: var(--ink);
  }

  .cards__btn:hover:not(:disabled) { background: var(--panel); }

  .cards__btn:disabled { color: var(--ink-muted); border-color: var(--line); cursor: default; }
}
</style>
