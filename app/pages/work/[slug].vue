<script setup lang="ts">
// Case-study template (Valdivia layout):
// giant title → intro left + spec right (Team, Services, Date, Role) → read-mode switch → TL;DR
// → full-width hero → [quick read: 2–3 key visuals] [full story: context, my role, sections,
// outcome, quote, what I'd do differently] → next project.
const slug = String(useRoute().params.slug)
const slugOf = (p: { path: string }) => p.path.split('/').pop()

const { data } = await useAsyncData(`work-${slug}`, async () => {
  const all = await queryCollection('work').order('stem', 'ASC').all()
  // Featured first (file order), then earlier work, then side projects.
  const ordered = ['featured', 'archive', 'side'].flatMap((t) => all.filter((p) => p.tier === t))
  const i = ordered.findIndex((p) => slugOf(p) === slug)
  if (i < 0) return null
  const next = ordered[(i + 1) % ordered.length]
  return { entry: ordered[i], next: { title: next.title, href: next.href ?? `/work/${slugOf(next)}` } }
})
if (!data.value) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const entry = computed(() => data.value!.entry)
const hero = computed(() => (entry.value.confidential ? undefined : entry.value.hero ?? entry.value.cover))
const team = computed(() => {
  const t = entry.value.team
  return !t ? [] : Array.isArray(t) ? t : t.split(/,\s*/)
})
const initials = (name: string) => name.replace(/\[.*?\]/g, '').trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2) || '?'
const hasQuick = computed(() => !!entry.value.tldr)
const intro = computed(() => entry.value.context?.split(/\n\s*\n/)[0] ?? entry.value.outcome)
// The first context paragraph is already the intro at the top; Context continues from there.
const moreContext = computed(() => entry.value.context?.split(/\n\s*\n/).slice(1).filter(Boolean) ?? [])
const isTodo = (s?: string) => !s || /^\[TODO/i.test(s)
const clean = (s?: string) => s?.replace(/^\[TODO:\s*|\]$/g, '')

const { init } = useReadMode()
// Only case studies with a TL;DR have a quick read; earlier work always shows everything.
onMounted(() => { if (hasQuick.value) init() })

useSeoMeta({
  title: () => entry.value.title,
  description: () => entry.value.outcome,
  ogTitle: () => `${entry.value.title} · Stepan Vedunov`,
  ogDescription: () => entry.value.outcome,
})
</script>

<template>
  <article v-if="data" class="cs" :class="{ 'cs--quick': hasQuick }">
    <header class="container cs__head">
      <h1 class="t-title cs__title">{{ entry.title }}</h1>
      <div class="cs__intro">
        <p class="cs__lead"><Txt :text="intro" /></p>
        <dl class="cs__spec">
          <div v-if="team.length">
            <dt class="t-mono muted">Team</dt>
            <dd class="cs__team">
              <span v-for="n in team" :key="n" class="cs__person">
                <NuxtImg v-if="n === 'Stepan Vedunov'" src="/photos/stepan-1.jpg" alt="" class="cs__avatar" width="64" height="64" format="webp" />
                <span v-else class="cs__avatar cs__avatar--initials" aria-hidden="true">{{ initials(n) }}</span>
                <Txt :text="n" />
              </span>
            </dd>
          </div>
          <div v-if="entry.services?.length">
            <dt class="t-mono muted">Services</dt>
            <dd class="cs__pills"><span v-for="s in entry.services" :key="s" class="pill">{{ s }}</span></dd>
          </div>
          <div>
            <dt class="t-mono muted">Date</dt>
            <dd><Txt :text="entry.date ?? entry.timeframe ?? entry.year" /></dd>
          </div>
          <div>
            <dt class="t-mono muted">Role</dt>
            <dd>{{ entry.role }}<template v-if="entry.org">, {{ entry.org }}</template></dd>
          </div>
        </dl>
      </div>
      <ul v-if="entry.links?.length" class="cs__links" role="list">
        <li v-for="l in entry.links" :key="l.href"><a :href="l.href" class="link-quiet" rel="noopener">{{ l.label }}<span aria-hidden="true">&nbsp;↗</span></a></li>
      </ul>
      <ReadModeSwitch v-if="hasQuick" class="cs__switch" />
    </header>

    <section v-if="entry.tldr" class="container cs__tldr" aria-labelledby="cs-tldr">
      <h2 id="cs-tldr" class="t-heading">TL;DR</h2>
      <dl>
        <div><dt class="muted">Problem</dt><dd><Txt :text="entry.tldr.problem" /></dd></div>
        <div><dt class="muted">My role</dt><dd><Txt :text="entry.tldr.role" /></dd></div>
        <div><dt class="muted">What I did</dt><dd><Txt :text="entry.tldr.did" /></dd></div>
        <div><dt class="muted">Outcome</dt><dd><Txt :text="entry.tldr.outcome" /></dd></div>
      </dl>
    </section>

    <div class="container">
      <CsMedia
        v-if="hero && (hero.src || hero.todo)"
        :src="hero.src"
        :alt="hero.alt"
        :todo="clean(hero.todo)"
        ratio="16 / 9"
        hero
        class="cs__hero"
      />
    </div>

    <!-- Quick read: the 2–3 visuals that matter, then a way into the full story. -->
    <section v-if="hasQuick" class="container cs__key rm-quick-only" aria-label="Key visuals">
      <CsMedia v-for="(v, i) in entry.keyVisuals ?? []" :key="i" :src="v.src" :alt="v.alt" :caption="v.caption" :todo="clean(v.todo)" />
      <div class="cs__more">
        <p class="muted">That's the short version.</p>
        <ReadModeSwitch />
      </div>
    </section>

    <!-- Full story -->
    <div class="container cs__full">
      <section v-if="moreContext.length" class="cs-section rm-extra" aria-labelledby="cs-context">
        <h2 id="cs-context" class="t-heading">Context</h2>
        <div class="cs__prose"><p v-for="(para, i) in moreContext" :key="i"><Txt :text="para" /></p></div>
      </section>
      <section v-if="entry.myRole?.length" class="cs-section rm-extra" aria-labelledby="cs-role">
        <h2 id="cs-role" class="t-heading">My role</h2>
        <ul class="cs__prose cs__role"><li v-for="(r, i) in entry.myRole" :key="i"><Txt :text="r" /></li></ul>
      </section>

      <ContentRenderer :value="entry" class="cs__body" />

      <section v-if="entry.results" class="cs-section rm-extra" aria-labelledby="cs-outcome">
        <h2 id="cs-outcome" class="t-heading">Outcome</h2>
        <div class="cs__prose">
          <dl v-if="entry.results.stats?.length" class="cs__stats">
            <div v-for="s in entry.results.stats" :key="s.label">
              <dt class="muted"><Txt :text="s.label" /></dt>
              <dd class="t-statement"><Txt :text="s.value" /></dd>
            </div>
          </dl>
          <p v-if="entry.results.text"><Txt :text="entry.results.text" /></p>
        </div>
      </section>

      <section v-if="entry.quote" class="cs-section rm-extra" aria-labelledby="cs-quote">
        <h2 id="cs-quote" class="t-heading">In their words</h2>
        <figure class="cs__quote">
          <blockquote class="t-statement"><Txt :text="isTodo(entry.quote.text) ? entry.quote.text : `“${entry.quote.text}”`" /></blockquote>
          <figcaption class="muted"><Txt :text="entry.quote.name" /><template v-if="entry.quote.role">, <Txt :text="entry.quote.role" /></template></figcaption>
        </figure>
      </section>

      <section v-if="entry.reflection" class="cs-section rm-extra" aria-labelledby="cs-reflection">
        <h2 id="cs-reflection" class="t-heading">What I'd do differently</h2>
        <p class="cs__prose t-heading"><Txt :text="entry.reflection" /></p>
      </section>
    </div>

    <nav class="container cs__next" aria-label="Next project">
      <hr class="hairline">
      <NuxtLink :to="data.next.href" class="cs__next-link">
        <span class="muted">Next<span class="sr-only">: </span></span>
        <span class="t-statement">{{ data.next.title }}<span aria-hidden="true">&nbsp;→</span></span>
      </NuxtLink>
    </nav>
  </article>
</template>

<style scoped>
.cs__head { display: grid; gap: var(--space-8); padding-block: var(--space-8); }

.cs__title { max-width: 12ch; }

.cs__intro { display: grid; gap: var(--space-8); }

.cs__lead { max-width: 46ch; }

.cs__spec { display: grid; gap: var(--space-4); align-content: start; }

.cs__spec > div { display: grid; grid-template-columns: 6rem 1fr; gap: var(--space-4); align-items: center; }

.cs__spec dd { margin: 0; }

.cs__team { display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-4); }

.cs__person { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-small); }

.cs__avatar { width: 2rem; height: 2rem; border-radius: 50%; object-fit: cover; }

.cs__avatar--initials {
  display: inline-grid;
  place-items: center;
  background: var(--panel);
  border: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: var(--text-mono);
}

.cs__pills { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.cs__links { display: flex; flex-wrap: wrap; gap: var(--space-1) var(--space-6); padding: 0; list-style: none; }

.cs__links a { display: inline-flex; align-items: center; min-height: var(--layout-tap); }

.cs__switch { justify-self: start; }

.cs__tldr { display: grid; gap: var(--space-4); padding-block: var(--space-8); border-top: 1px solid var(--line); }

.cs__tldr dl { display: grid; gap: var(--space-4); }

.cs__tldr dl > div { display: grid; gap: var(--space-1); }

.cs__tldr dd { margin: 0; max-width: 62ch; }

.cs__hero { margin-block: var(--space-8); }

.cs__key { display: grid; gap: var(--space-8); padding-bottom: var(--space-8); }

.cs__more { display: grid; justify-items: start; gap: var(--space-3); padding-top: var(--space-4); }

.cs__prose { max-width: 62ch; }

.cs__prose p + p { margin-top: var(--space-4); }

.cs__role { display: grid; gap: var(--space-2); padding-left: 1.1em; }

.cs__stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-6) var(--layout-gutter); margin-bottom: var(--space-6); }

.cs__stats div { display: flex; flex-direction: column-reverse; gap: var(--space-1); }

.cs__stats dd { margin: 0; }

.cs__quote { display: grid; gap: var(--space-4); margin: 0; padding: var(--space-8); border-radius: var(--radius-card); background: var(--panel); }

.cs__next { margin-top: var(--space-section); }

.cs__next-link { display: grid; gap: var(--space-2); padding-block: var(--space-8); text-decoration: none; }

.cs__next-link:hover .t-statement { text-decoration: underline; text-decoration-thickness: 1px; }

@media (width >= 64rem) {
  .cs__head { padding-block: var(--space-12) var(--space-8); }

  .cs__intro { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: var(--space-16); }

  .cs__tldr { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); column-gap: var(--layout-gutter); }

  .cs__tldr dl > div { grid-template-columns: 10rem 1fr; column-gap: var(--layout-gutter); }

  .cs__key { grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--layout-gutter); }

  .cs__key > :first-child { grid-column: 1 / -1; }

  .cs__more { grid-column: 1 / -1; }

  .cs__stats { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
</style>

<style>
/* Case studies only: sections from Markdown and the template share one grid (heading left, text right, media full width). */
.cs .cs-section { padding-block: var(--space-12); border-top: 1px solid var(--line); }

.cs .cs-section > h2 { margin-bottom: var(--space-4); }

.cs .cs-flow { display: grid; gap: var(--space-6); }

.cs .cs-flow > p, .cs .cs-flow > ul, .cs .cs-flow > ol, .cs .cs-flow > h3, .cs .cs-flow > aside, .cs .cs-flow > .todo { max-width: 62ch; }

.cs .cs-flow > .todo { justify-self: start; }

.cs .cs-flow > ul { padding-left: 1.1em; display: grid; gap: var(--space-2); }

@media (width >= 64rem) {
  .cs .cs-section {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    gap: var(--space-6) var(--layout-gutter);
    align-items: start;
  }

  .cs .cs-section > h2 { grid-column: 1; margin: 0; }

  .cs .cs-section > :not(h2) { grid-column: 2; }

  .cs-section .cs .cs-flow { display: contents; }

  .cs-section .cs .cs-flow > * { grid-column: 2; }

  .cs-section .cs .cs-flow > figure,
  .cs-section .cs .cs-flow > .cs-grid,
  .cs-section .cs .cs-flow > .cs-video { grid-column: 1 / -1; margin-top: var(--space-4); }
}
</style>
