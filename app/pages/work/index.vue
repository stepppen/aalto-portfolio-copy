<script setup lang="ts">
// Phase 4 builds the full page; this is enough structure to host the side-project tiles.
useSeoMeta({ title: 'Work', description: 'Case studies, side projects and earlier work by Stepan Vedunov.' })
const route = useRoute()
const posterMode = computed(() => route.query.poster === '1')
const { data } = await useAsyncData('work-page', async () => {
  const [work, tiles] = await Promise.all([
    queryCollection('work').order('stem', 'ASC').all(),
    queryCollection('tiles').order('stem', 'ASC').all(),
  ])
  return { work, tiles }
})
const slug = (p: { path: string }) => p.path.split('/').pop()
const featured = computed(() => data.value?.work.filter((p) => p.tier === 'featured') ?? [])
// Side projects without a tile yet (e.g. the drawing robot until its model exists) stay listed here.
const tiled = computed(() => new Set(data.value?.tiles.map((t) => t.href).filter(Boolean)))
const earlier = computed(() => data.value?.work.filter((p) => p.tier === 'archive' || (p.tier === 'side' && !tiled.value.has(`/work/${slug(p)}`))) ?? [])
</script>

<template>
  <div class="container work">
    <h1 class="t-title">Work</h1>

    <section class="work__section" aria-labelledby="w-cases">
      <h2 id="w-cases" class="t-heading">Case studies</h2>
      <p class="todo">Phase 4: large cards</p>
      <ul role="list" class="work__list">
        <li v-for="p in featured" :key="p.path"><NuxtLink :to="`/work/${slug(p)}`">{{ p.title }}</NuxtLink></li>
      </ul>
    </section>

    <section class="work__section" aria-labelledby="w-side">
      <h2 id="w-side" class="t-heading">Side projects and things I make</h2>
      <div class="work__tiles">
        <SideTile v-for="(t, i) in data?.tiles" :key="t.id" :tile="t" :poster-mode="posterMode" :eager="i < 2" />
      </div>
    </section>

    <section class="work__section" aria-labelledby="w-earlier">
      <h2 id="w-earlier" class="t-heading">Earlier work</h2>
      <ul role="list" class="work__list">
        <li v-for="p in earlier" :key="p.path"><NuxtLink :to="`/work/${slug(p)}`">{{ p.title }}</NuxtLink></li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.work { padding-block: var(--space-8) 0; }

.work__section { display: grid; gap: var(--space-6); margin-top: var(--space-section); }

.work__list { display: grid; gap: var(--space-2); padding: 0; list-style: none; }

.work__tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-8) var(--space-3);
}

@media (width >= 64rem) {
  .work__tiles { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-12) var(--layout-gutter); }
}
</style>
