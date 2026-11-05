<script setup lang="ts">
// Phase 2 shell: the top of the home page (eyebrow, headline, proof, contact) to set type and layout.
// Cards, about teaser, how I work and the contact composer arrive in Phase 3.
const { data } = await useSite()
const site = computed(() => data.value!.site)
useSeoMeta({ description: () => `${site.value.name}. ${site.value.positioning} ${site.value.proof.join(' · ')}.` })
</script>

<template>
  <section class="container hero" aria-labelledby="hero-title">
    <p class="t-mono muted">{{ site.status }}</p>
    <h1 id="hero-title" class="t-display hero__title">{{ site.positioning }}</h1>
    <p class="hero__proof">
      <span class="muted">{{ site.proof.join(' · ') }}</span>
      <a :href="`mailto:${site.email}`" class="hero__mail">Email me<span aria-hidden="true">&nbsp;›</span></a>
    </p>
  </section>

  <section class="container section" aria-label="Coming in Phase 3">
    <p class="todo">Phase 3: project cards, about teaser, how I work, contact composer</p>
  </section>
</template>

<style scoped>
.hero { padding-block: var(--space-8) var(--space-12); display: grid; gap: var(--space-6); }

.hero__title { max-width: 21ch; }

.hero__proof { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--space-2) var(--space-6); font-size: var(--text-small); }

.hero__mail { display: inline-flex; align-items: center; min-height: var(--layout-tap); text-decoration: none; font-weight: 500; }

.hero__mail:hover { text-decoration: underline; }

@media (width >= 64rem) {
  .hero { padding-block: var(--space-16) var(--space-16); }
}
</style>
