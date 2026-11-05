<script setup lang="ts">
// About (Valdivia layout): giant title, photo left, story right, then short two-column blocks.
// This is where the personal half lives.
const { data: page } = await useAsyncData('about', () => queryCollection('pages').path('/pages/about').first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
useSeoMeta({ title: 'About', description: () => page.value!.description, ogDescription: () => page.value!.description })
</script>

<template>
  <article v-if="page" class="container about">
    <h1 class="t-title">About</h1>

    <div class="about__top">
      <NuxtImg :src="page.photo.src" :alt="page.photo.alt" class="about__photo" sizes="sm:80vw md:40vw xl:420px" densities="x1 x2" format="webp" :style="{ aspectRatio: imageRatio(page.photo.src) }" preload />
      <div class="about__story">
        <p class="t-statement">{{ page.intro }}</p>
        <hr class="about__dash">
        <ContentRenderer :value="page" class="about__body" />
      </div>
    </div>

    <section class="split about__block" aria-labelledby="a-working">
      <h2 id="a-working" class="t-heading">What I'm like to work with</h2>
      <p><Txt :text="page.workingWithMe" /></p>
    </section>

    <section class="split about__block" aria-labelledby="a-exp">
      <h2 id="a-exp" class="t-heading">Experience</h2>
      <ol class="about__list about__list--exp" role="list">
        <li v-for="e in page.experience" :key="e.what + e.when">
          <span class="t-mono muted about__when">{{ e.when }}</span>
          <span>{{ e.what }}<span class="muted">, {{ e.where }}</span></span>
        </li>
      </ol>
    </section>

    <section class="split about__block" aria-labelledby="a-rec">
      <h2 id="a-rec" class="t-heading">Recognition</h2>
      <ul class="about__list" role="list">
        <li v-for="r in page.recognition" :key="r">{{ r }}</li>
      </ul>
    </section>

    <section class="split about__block" aria-labelledby="a-lang">
      <h2 id="a-lang" class="t-heading">Languages</h2>
      <ul class="about__list" role="list">
        <li v-for="l in page.languages" :key="l.name" class="about__lang"><span>{{ l.name }}</span><span class="muted">{{ l.level }}</span></li>
      </ul>
    </section>

    <section class="split about__block" aria-labelledby="a-out">
      <h2 id="a-out" class="t-heading">Outside work</h2>
      <div class="about__out">
        <p>{{ page.outside.text }} <NuxtLink to="/work#w-side">See the tiles<span aria-hidden="true">&nbsp;›</span></NuxtLink></p>
        <div class="about__photos">
          <figure v-for="(p, i) in page.outside.photos" :key="i">
            <NuxtImg v-if="p.src" :src="p.src" :alt="p.alt ?? ''" sizes="sm:50vw xl:320px" densities="x1 x2" format="webp" loading="lazy" />
            <div v-else class="about__photo-todo"><Txt :text="p.todo" /></div>
          </figure>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.about { padding-top: var(--space-8); }

.about__top { display: grid; gap: var(--space-8); margin-top: var(--space-12); }

.about__photo { width: min(100%, 26rem); border-radius: var(--radius-card); object-fit: cover; }

.about__story { display: grid; gap: var(--space-6); align-content: start; max-width: 40rem; }

.about__dash { border: 0; border-top: 1px dashed var(--line-strong); }

.about__body :deep(p + p) { margin-top: var(--space-4); }

.about__body :deep(p) { font-size: var(--text-body); }

.about__block { margin-top: var(--space-section); padding-top: var(--space-6); border-top: 1px solid var(--line); }

.about__list { display: grid; gap: var(--space-3); padding: 0; list-style: none; }

.about__list li { display: grid; gap: var(--space-1); }

.about__when { white-space: nowrap; }

.about__lang { grid-template-columns: 1fr auto; padding-bottom: var(--space-2); border-bottom: 1px solid var(--line); }

.about__out { display: grid; gap: var(--space-6); }

.about__photos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--layout-gutter); }

.about__photos figure { margin: 0; }

.about__photos img, .about__photo-todo {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: var(--radius-card);
  background: var(--panel);
}

.about__photo-todo { display: grid; place-items: center; padding: var(--space-4); text-align: center; }

@media (width >= 64rem) {
  .about__top { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); column-gap: var(--layout-gutter); }

  .about__photo { width: 100%; }

  .about__body :deep(p) { font-size: var(--text-heading); line-height: 1.5; letter-spacing: -0.005em; }

  .about__list--exp li { grid-template-columns: 8rem 1fr; column-gap: var(--layout-gutter); }
}
</style>
