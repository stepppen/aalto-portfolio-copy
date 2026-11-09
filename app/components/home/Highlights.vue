<script setup lang="ts">
// Achievements under the about teaser, as stat cards.
import type { HomeCollectionItem } from '@nuxt/content'
defineProps<{ items: NonNullable<HomeCollectionItem['highlights']> }>()
const { t } = useLang()
</script>

<template>
  <section class="container hl" aria-labelledby="hl-title">
    <h2 id="hl-title" class="t-mono muted reveal">{{ t('highlights.title') }}</h2>
    <StatGrid :items="items" class="hover-dim reveal" />
  </section>
</template>

<style scoped>
.hl { display: grid; gap: var(--space-4); margin-top: calc(-1 * var(--space-section) + var(--space-12)); }
</style>
