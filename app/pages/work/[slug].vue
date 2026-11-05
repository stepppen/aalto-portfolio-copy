<script setup lang="ts">
// Case-study template:
// hero (title, outcome) → facts → hero media → context → my role → numbered sections (body)
// → outcome → what I'd do differently → next project.
const slug = String(useRoute().params.slug)
const slugOf = (p: { path: string }) => p.path.split('/').pop()

const { data } = await useAsyncData(`work-${slug}`, async () => {
  const all = await queryCollection('work').order('stem', 'ASC').all()
  // Featured first (file order), then earlier work, then side projects.
  const ordered = ['featured', 'archive', 'side'].flatMap((t) => all.filter((p) => p.tier === t))
  const i = ordered.findIndex((p) => slugOf(p) === slug)
  if (i < 0) return null
  const next = ordered[(i + 1) % ordered.length]
  return { entry: ordered[i], next: { title: next.title, slug: slugOf(next) } }
})
if (!data.value) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const entry = computed(() => data.value!.entry)
const hero = computed(() => entry.value.hero ?? entry.value.cover)
const facts = computed(() =>
  [
    ['Role', entry.value.role + (entry.value.org ? `, ${entry.value.org}` : '')],
    ['Team', entry.value.team],
    ['Timeframe', entry.value.timeframe ?? entry.value.year],
    ['Tools', entry.value.tools?.join(', ')],
    ['Status', entry.value.status],
  ].filter(([, v]) => v) as [string, string][],
)

useSeoMeta({
  title: () => entry.value.title,
  description: () => entry.value.outcome,
  ogTitle: () => `${entry.value.title} · Stepan Vedunov`,
  ogDescription: () => entry.value.outcome,
})
</script>

<template>
  <article v-if="data" class="cs">
    <header class="container cs__hero">
      <p class="t-mono muted">
        <NuxtLink to="/#work" class="cs__back">← Work</NuxtLink>
        <span v-if="entry.tier === 'archive'"> · Archive</span>
        <span v-if="entry.confidential"> · Confidential</span>
      </p>
      <h1 class="t-title">{{ entry.title }}</h1>
      <p class="t-lead cs__outcome">{{ entry.outcome }}</p>

      <dl class="cs__facts">
        <div v-for="[k, v] in facts" :key="k">
          <dt class="t-mono muted">{{ k }}</dt>
          <dd><Txt :text="v" /></dd>
        </div>
      </dl>
      <ul v-if="entry.links?.length" class="cs__links" role="list">
        <li v-for="l in entry.links" :key="l.href">
          <a class="link-quiet" :href="l.href" rel="noopener">{{ l.label }}</a>
        </li>
      </ul>
    </header>

    <div class="container">
      <CsMedia
        v-if="hero && !entry.confidential"
        :src="hero.src"
        :alt="hero.alt"
        :todo="hero.todo?.replace(/^\[TODO:\s*|\]$/g, '')"
        ratio="16 / 9"
        develop
        hero
        class="cs__hero-media"
      />
    </div>

    <div class="container cs__intro">
      <section v-if="entry.context" class="cs__block" aria-labelledby="cs-context">
        <h2 id="cs-context" class="t-mono muted">Context</h2>
        <div class="cs__prose"><p v-for="(para, i) in entry.context.split(/\n\s*\n/)" :key="i"><Txt :text="para" /></p></div>
      </section>
      <section v-if="entry.myRole?.length" class="cs__block" aria-labelledby="cs-role">
        <h2 id="cs-role" class="t-mono muted">My role</h2>
        <ul class="cs__prose cs__role">
          <li v-for="(r, i) in entry.myRole" :key="i"><Txt :text="r" /></li>
        </ul>
      </section>
    </div>

    <div class="container cs__body">
      <ContentRenderer :value="entry" />
    </div>

    <section v-if="entry.results" class="container cs__results" aria-labelledby="cs-outcome">
      <h2 id="cs-outcome" class="t-heading">Outcome</h2>
      <dl v-if="entry.results.stats?.length" class="cs__stats">
        <div v-for="s in entry.results.stats" :key="s.label">
          <dt class="t-small muted"><Txt :text="s.label" /></dt>
          <dd class="t-heading"><Txt :text="s.value" /></dd>
        </div>
      </dl>
      <p v-if="entry.results.text" class="cs__prose"><Txt :text="entry.results.text" /></p>
    </section>

    <section v-if="entry.reflection" class="container cs__reflection" aria-labelledby="cs-reflection">
      <h2 id="cs-reflection" class="t-heading">What I'd do differently</h2>
      <p class="t-lead cs__prose"><Txt :text="entry.reflection" /></p>
    </section>

    <nav class="container cs__next" aria-label="Next project">
      <NuxtLink :to="`/work/${data.next.slug}`" class="cs__next-link">
        <span class="t-mono muted">Next</span>
        <span class="t-title">{{ data.next.title }} →</span>
      </NuxtLink>
    </nav>
  </article>
</template>

<style scoped>
.cs__hero { padding-block: var(--space-8) var(--space-8); display: grid; gap: var(--space-4); }

.cs__back { display: inline-flex; align-items: center; min-height: var(--layout-tap); text-decoration: none; }

.cs__outcome { max-width: 36ch; }

.cs__facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4) var(--layout-gutter);
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--ink);
}

.cs__facts dd { margin: var(--space-1) 0 0; font-size: var(--text-small); }

.cs__links { display: flex; flex-wrap: wrap; gap: 0 var(--space-6); padding: 0; list-style: none; }

.cs__hero-media { margin-block: var(--space-4) var(--space-8); }

.cs__intro { display: grid; gap: var(--space-8); padding-block: var(--space-8); }

.cs__block { display: grid; gap: var(--space-3); }

.cs__prose { max-width: 62ch; }

.cs__prose p + p { margin-top: var(--space-4); }

.cs__role { display: grid; gap: var(--space-2); padding-left: 1.1em; }

.cs__results, .cs__reflection { padding-block: var(--space-12); border-top: 1px solid var(--ink); display: grid; gap: var(--space-6); }

.cs__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6) var(--layout-gutter);
}

.cs__stats div { display: flex; flex-direction: column-reverse; gap: var(--space-1); }

.cs__stats dd { margin: 0; }

.cs__next { padding-block: var(--space-12) 0; }

.cs__next-link {
  display: grid;
  gap: var(--space-2);
  padding-block: var(--space-8);
  border-top: 1px solid var(--ink);
  text-decoration: none;
}

.cs__next-link:hover .t-title { color: var(--signal); }

@media (width >= 48rem) {
  .cs__facts { grid-template-columns: repeat(5, minmax(0, 1fr)); }

  .cs__stats { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (width >= 75rem) {
  .cs__hero { padding-block: var(--space-12) var(--space-8); }

  .cs__intro { grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--layout-gutter); }

  .cs__block { grid-column: 1 / -1; grid-template-columns: subgrid; }

  .cs__block > h2 { grid-column: 1 / span 4; }

  .cs__block > .cs__prose { grid-column: 5 / span 7; }

  .cs__results, .cs__reflection { grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--layout-gutter); }

  .cs__results > h2, .cs__reflection > h2 { grid-column: 1 / span 4; }

  .cs__results > dl, .cs__results > p, .cs__reflection > p { grid-column: 5 / -1; }
}
</style>

<style>
/* Flow inside numbered sections (rendered from Markdown): text in a reading column, media full width. */
.cs__body .cs-flow { display: grid; gap: var(--space-6); }

.cs__body .cs-flow > p,
.cs__body .cs-flow > ul,
.cs__body .cs-flow > ol,
.cs__body .cs-flow > h3,
.cs__body .cs-flow > blockquote,
.cs__body .cs-flow > aside,
.cs__body .cs-flow > .todo { max-width: 62ch; }

/* A placeholder on its own line loses its <p>; keep it in the reading column and at its own width. */
.cs__body .cs-flow > .todo { justify-self: start; }

.cs__body .cs-flow > h3 { font-size: var(--text-heading); margin-top: var(--space-4); }

.cs__body .cs-flow > ul { padding-left: 1.1em; display: grid; gap: var(--space-2); }

@media (width >= 75rem) {
  .cs__body .cs-flow > p,
  .cs__body .cs-flow > ul,
  .cs__body .cs-flow > ol,
  .cs__body .cs-flow > h3,
  .cs__body .cs-flow > blockquote,
  .cs__body .cs-flow > aside,
  .cs__body .cs-flow > .todo { margin-left: calc((100% + var(--layout-gutter)) / 12 * 4); }
}
</style>
