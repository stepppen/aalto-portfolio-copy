<script setup lang="ts">
// Home: who (headline + proof + contact above the fold) → what he's shipped (cards) →
// who he is (about teaser) → how he works → how to reach him (composer).
const { data } = await useSite()
const site = computed(() => data.value!.site)
const { t, lp, lang, col } = useLang()
const { data: page } = await useAsyncData(`home-${lang.value}`, async () => {
  const [home, work] = await Promise.all([
    queryCollection(col('home')).first(),
    queryCollection(col('work')).where('tier', '=', 'featured').order('stem', 'ASC').all(),
  ])
  return { home: home!, featured: work }
})
useSeoMeta({ description: () => `${site.value.name}, ${t('site.tagline')}. ${site.value.positioning}` })
</script>

<template>
  <section class="container hero" aria-labelledby="hero-title">
    <p class="t-mono muted">{{ t('hero.role') }}</p>
    <h1 id="hero-title" class="t-display hero__title">{{ site.positioning }}<span class="hero__cursor" aria-hidden="true" /></h1>
    <p class="hero__proof t-mono">
      <a href="#contact" class="hero__mail">{{ t('hero.email') }}<span aria-hidden="true">&nbsp;›</span></a>
      <NuxtLink :to="lp('/work')" class="hero__mail link-quiet">{{ t('hero.work') }}<span aria-hidden="true">&nbsp;›</span></NuxtLink>
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

.hero__mail { display: inline-flex; align-items: center; min-height: var(--layout-tap); text-decoration: none; }

.hero__mail:hover { text-decoration: underline; }

/* A blinking block cursor, a nod to the setup screen. Still when motion is reduced. */
.hero__cursor {
  display: inline-block;
  width: 0.08em;
  height: 0.8em;
  margin-left: 0.08em;
  vertical-align: -0.05em;
  background: var(--ink);
}

@media (prefers-reduced-motion: no-preference) {
  .hero__cursor { animation: blink 1.1s steps(1) infinite; }
}

@keyframes blink { 50% { opacity: 0; } }

@media (width >= 64rem) {
  .hero { padding-block: var(--space-16) var(--space-12); }
}
</style>
