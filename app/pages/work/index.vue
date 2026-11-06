<script setup lang="ts">
// Work: case studies as large cards → side projects and things I make (tiles) → earlier work.
const { t, lp, lang, col } = useLang()
useSeoMeta({ title: () => t('work.title'), description: () => t('work.description') })
const route = useRoute()
const posterMode = computed(() => route.query.poster === '1')
const { data } = await useAsyncData(`work-page-${lang.value}`, async () => {
  const [work, tiles] = await Promise.all([
    queryCollection(col('work')).order('stem', 'ASC').all(),
    queryCollection(col('tiles')).order('stem', 'ASC').all(),
  ])
  return { work, tiles }
})
const slug = (p: { path: string }) => p.path.split('/').pop()
const hrefOf = (p: { path: string; href?: string }) => lp(p.href ?? `/work/${slug(p)}`)
const featured = computed(() => data.value?.work.filter((p) => p.tier === 'featured') ?? [])
// Side projects without a tile yet (e.g. the drawing robot until its model exists) stay listed here.
const tiled = computed(() => new Set(data.value?.tiles.map((t) => t.href).filter(Boolean)))
const earlier = computed(() => data.value?.work.filter((p) => p.tier === 'archive' || (p.tier === 'side' && !tiled.value.has(`/work/${slug(p)}`))) ?? [])
const media = (p: { cover?: { src?: string } }) => (p.cover?.src && !p.cover.src.endsWith('.svg') ? p.cover.src : undefined)
</script>

<template>
  <div class="container work">
    <h1 class="t-title">{{ t('work.title') }}</h1>

    <section class="work__section" aria-labelledby="w-cases">
      <h2 id="w-cases" class="t-statement">{{ t('work.cases') }}</h2>
      <ul class="work__cases hover-dim reveal" role="list">
        <li v-for="(p, i) in featured" :key="p.path" class="case" :class="{ 'case--dark': p.confidential, 'case--light': !p.confidential && !media(p) }">
          <NuxtLink :to="hrefOf(p)" class="case__link">
            <span class="case__media">
              <NuxtImg
                v-if="media(p)"
                :src="media(p)!"
                :alt="p.cover?.alt ?? ''"
                sizes="sm:100vw md:100vw lg:50vw xl:660px"
                densities="x1 x2"
                format="webp"
                :loading="i === 0 ? 'eager' : 'lazy'"
                :fetchpriority="i === 0 ? 'high' : undefined"
                :preload="i === 0 ? { fetchPriority: 'high' } : undefined"
              />
              <img v-else-if="p.cover?.src" :src="p.cover.src" :alt="p.cover.alt ?? ''" class="case__svg" loading="lazy">
              <span v-else-if="p.confidential" class="case__note t-mono">{{ t('confidential') }}</span>
              <span v-else class="case__note"><Txt :text="p.cover?.todo" /></span>
            </span>
            <span class="case__text">
              <span class="t-heading">{{ p.title }}<span class="sr-only">. </span></span>
              <span class="muted">{{ p.outcome }}</span>
              <span class="case__tags"><span v-for="t in p.tags ?? []" :key="t" class="pill">{{ t }}</span></span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section class="work__section" aria-labelledby="w-side">
      <h2 id="w-side" class="t-statement reveal">{{ t('work.side') }}</h2>
      <div class="work__tiles">
        <SideTile v-for="t in data?.tiles" :key="t.id" :tile="t" :poster-mode="posterMode" />
      </div>
    </section>

    <section class="work__section" aria-labelledby="w-earlier">
      <h2 id="w-earlier" class="t-statement reveal">{{ t('work.earlier') }}</h2>
      <ul class="earlier hover-dim reveal" role="list">
        <li v-for="p in earlier" :key="p.path" class="earlier__row">
          <span class="earlier__thumb">
            <NuxtImg v-if="media(p)" :src="media(p)!" alt="" sizes="sm:96px" densities="x1 x2" format="webp" loading="lazy" />
          </span>
          <NuxtLink :to="hrefOf(p)" class="earlier__title">{{ p.title }}</NuxtLink>
          <span class="earlier__line muted">{{ p.outcome }}</span>
          <span class="earlier__role muted">{{ p.role }}</span>
          <span class="earlier__year t-mono muted">{{ p.year }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.work { padding-block: var(--space-8) 0; }

.work__section { display: grid; gap: var(--space-8); margin-top: var(--space-section); }

.work__cases { display: grid; gap: var(--space-8) var(--layout-gutter); padding: 0; list-style: none; }

.case__link { display: grid; gap: var(--space-4); text-decoration: none; }

.case__media {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-card);
  background: var(--panel);
}

.case__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform var(--motion-dur-switch) var(--motion-ease); }

.case__media .case__svg { object-fit: contain; padding: var(--space-8); }

.case--dark .case__media { background: var(--ink); color: var(--on-media); }

.case__note { padding: var(--space-6); text-align: center; }

.case__link:hover .case__media img { transform: scale(1.015); }

.case__link:hover .t-heading { text-decoration: underline; text-decoration-thickness: 1px; }

.case__link:focus-visible { outline-offset: 4px; border-radius: var(--radius-card); }

.case__text { display: grid; gap: var(--space-1); }

.case__tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-2); }

.work__tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-8) var(--space-3);
}

.earlier { padding: 0; list-style: none; border-bottom: 1px solid var(--line); }

.earlier__row {
  position: relative;
  display: grid;
  grid-template-columns: 4.5rem 1fr auto;
  grid-template-areas: "thumb title year" "thumb line line";
  gap: var(--space-1) var(--space-4);
  align-items: center;
  padding-block: var(--space-4);
  border-top: 1px solid var(--line);
}

.earlier__thumb { grid-area: thumb; width: 4.5rem; aspect-ratio: 1; overflow: hidden; border-radius: var(--radius-control); background: var(--panel); }

.earlier__thumb img { width: 100%; height: 100%; object-fit: cover; }

.earlier__title { grid-area: title; text-decoration: none; }

/* The whole row is the link's hit area. */
.earlier__title::after { content: ""; position: absolute; inset: 0; }

.earlier__row:hover .earlier__title { text-decoration: underline; text-decoration-thickness: 1px; }

.earlier__line { grid-area: line; font-size: var(--text-small); }

.earlier__role { display: none; }

.earlier__year { grid-area: year; }

@media (width >= 64rem) {
  .work__cases { grid-template-columns: repeat(2, minmax(0, 1fr)); }

  .work__tiles { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-12) var(--layout-gutter); }

  .earlier__row {
    grid-template-columns: 4.5rem minmax(0, 1.2fr) minmax(0, 2fr) minmax(0, 1fr) auto;
    grid-template-areas: "thumb title line role year";
  }

  .earlier__role { display: block; grid-area: role; font-size: var(--text-small); }
}
</style>
