<script setup lang="ts">
import type { HomeCollectionItem } from '@nuxt/content'
defineProps<{ items: HomeCollectionItem['howIWork'] }>()
const { t } = useLang()
</script>

<template>
  <section class="container section how" aria-labelledby="how-title">
    <h2 id="how-title" class="t-statement reveal">{{ t('how.title') }}</h2>
    <ol class="how__list hover-dim reveal" role="list">
      <li v-for="(it, i) in items" :key="it.title" class="how__item">
        <span class="how__n t-mono muted" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
        <h3 class="t-heading how__title">{{ it.title }}</h3>
        <p class="how__text">{{ it.text }}</p>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.how { display: grid; gap: var(--space-8); }

.how__list { padding: 0; list-style: none; border-bottom: 1px solid var(--line); }

.how__item {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: var(--space-2) var(--space-4);
  padding-block: var(--space-6);
  border-top: 1px solid var(--line);
}

.how__n { padding-top: 0.35em; }

.how__text { grid-column: 2; color: var(--ink); max-width: 46ch; }

@media (width >= 64rem) {
  .how__item { grid-template-columns: 3rem minmax(0, 1fr) minmax(0, 2fr); padding-block: var(--space-8); }

  .how__text { grid-column: 3; font-size: var(--text-heading); line-height: 1.45; }
}
</style>
