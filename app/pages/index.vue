<script setup lang="ts">
// Home: who (headline + proof + contact above the fold) → what he's shipped (cards) →
// who he is (about teaser) → how he works → how to reach him (composer).
const { data } = await useSite()
const site = computed(() => data.value!.site)
const { data: page } = await useAsyncData('home', async () => {
  const [home, work] = await Promise.all([
    queryCollection('home').first(),
    queryCollection('work').where('tier', '=', 'featured').order('stem', 'ASC').all(),
  ])
  return { home: home!, featured: work }
})
useSeoMeta({ description: () => `${site.value.name}. ${site.value.positioning} ${site.value.proof.join(' · ')}.` })
</script>

<template>
  <section class="container hero" aria-labelledby="hero-title">
    <p class="t-mono muted">{{ site.status }}</p>
    <h1 id="hero-title" class="t-display hero__title">{{ site.positioning }}</h1>
    <p class="hero__proof">
      <span class="muted">{{ site.proof.join(' · ') }}</span>
      <a href="#contact" class="hero__mail">Email me<span aria-hidden="true">&nbsp;›</span></a>
    </p>
  </section>

  <template v-if="page">
    <HomeProjectCards :projects="page.featured" />
    <HomeAboutTeaser :about="page.home.about" />
    <HomeHowIWork :items="page.home.howIWork" />
    <HomeContactComposer :email="site.email" :heading="site.contactIntro" />
  </template>
</template>

<style scoped>
.hero { padding-block: var(--space-8) var(--space-8); display: grid; gap: var(--space-6); }

.hero__title { max-width: 21ch; }

.hero__proof { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--space-2) var(--space-6); font-size: var(--text-small); }

.hero__mail { display: inline-flex; align-items: center; min-height: var(--layout-tap); text-decoration: none; font-weight: 500; }

.hero__mail:hover { text-decoration: underline; }

@media (width >= 64rem) {
  .hero { padding-block: var(--space-16) var(--space-12); }
}
</style>
