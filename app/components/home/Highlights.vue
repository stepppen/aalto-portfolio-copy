<script setup lang="ts">
// Achievements under the about teaser: big value, mono label, one line of detail.
// Internal links go through lp() so they stay in the current language; external ones open the source.
import type { HomeCollectionItem } from '@nuxt/content'
defineProps<{ items: NonNullable<HomeCollectionItem['highlights']> }>()
const { t, lp } = useLang()
const external = (href?: string) => !!href && /^https?:/.test(href)
</script>

<template>
  <section class="container hl" aria-labelledby="hl-title">
    <h2 id="hl-title" class="t-mono muted hl__title reveal">{{ t('highlights.title') }}</h2>
    <ul class="hl__grid hover-dim reveal" role="list">
      <li v-for="h in items" :key="h.value + h.label">
        <component
          :is="!h.href ? 'div' : external(h.href) ? 'a' : resolveComponent('NuxtLink')"
          :href="external(h.href) ? h.href : undefined"
          :to="h.href && !external(h.href) ? lp(h.href) : undefined"
          :rel="external(h.href) ? 'noopener' : undefined"
          class="hl__card"
        >
          <span class="hl__value">{{ h.value }}</span>
          <span class="hl__label t-mono">{{ h.label }}<span v-if="h.href" class="hl__arrow" aria-hidden="true">&nbsp;{{ external(h.href) ? '↗' : '→' }}</span></span>
          <span v-if="h.detail" class="hl__detail muted">{{ h.detail }}</span>
        </component>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.hl { display: grid; gap: var(--space-4); margin-top: calc(-1 * var(--space-section) + var(--space-12)); }

.hl__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--layout-gutter); padding: 0; list-style: none; }

.hl__grid > li { display: grid; }

.hl__card {
  display: grid;
  align-content: start;
  gap: var(--space-2);
  padding: var(--space-6);
  border-radius: var(--radius-card);
  background: var(--panel);
  color: inherit;
  text-decoration: none;
  transition: background-color 200ms var(--motion-ease);
}

a.hl__card:hover { background: color-mix(in srgb, var(--ink) 6%, var(--panel)); }

.hl__value {
  font-family: var(--font-display);
  font-size: var(--text-statement);
  letter-spacing: var(--tracking-display);
  line-height: 1.05;
}

.hl__label { color: var(--ink); }

.hl__arrow { display: inline-block; transition: transform var(--motion-dur-fast) var(--motion-ease); }

a.hl__card:hover .hl__arrow { transform: translateX(3px); }

.hl__detail { font-size: var(--text-small); line-height: 1.45; }

@media (width < 30rem) {
  .hl__card { padding: var(--space-4); }
}

@media (width >= 64rem) {
  .hl__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }

  .hl__card { padding: var(--space-8); min-height: 13rem; }
}
</style>
