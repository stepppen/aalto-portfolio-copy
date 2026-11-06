<script setup lang="ts">
// About: a stack of photos left, a short story right, then experience, recognition (as cards
// with photos and links) and what I do outside work.
const { t, lp, lang, col } = useLang()
const { data: page } = await useAsyncData(`about-${lang.value}`, () => queryCollection(col('pages')).path(lang.value === 'de' ? '/de/pages/about' : '/pages/about').first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
useSeoMeta({ title: () => t('about.title'), description: () => page.value!.description, ogDescription: () => page.value!.description })
</script>

<template>
  <article v-if="page" class="container about">
    <h1 class="t-title">{{ t('about.title') }}</h1>

    <div class="about__top">
      <PhotoStack :photos="page.photos" />
      <div class="about__story">
        <p class="t-statement">{{ page.intro }}</p>
        <hr class="about__dash">
        <ContentRenderer :value="page" class="about__body" />
      </div>
    </div>

    <section class="split about__block reveal" aria-labelledby="a-exp">
      <h2 id="a-exp" class="t-heading">{{ t('about.experience') }}</h2>
      <ol class="about__list about__list--exp hover-dim" role="list">
        <li v-for="e in page.experience" :key="e.what + e.when">
          <span class="t-mono muted about__when">{{ e.when }}</span>
          <span>{{ e.what }}<span class="muted">, {{ e.where }}</span></span>
        </li>
      </ol>
    </section>

    <section class="about__block about__block--wide reveal" aria-labelledby="a-rec">
      <h2 id="a-rec" class="t-heading">{{ t('about.recognition') }}</h2>
      <ul class="rec hover-dim" role="list">
        <li v-for="r in page.recognition" :key="r.title" class="rec__item">
          <component :is="r.href ? 'a' : 'div'" :href="r.href" :rel="r.href ? 'noopener' : undefined" class="rec__card">
            <span class="rec__media">
              <NuxtImg v-if="r.image?.src" :src="r.image.src" :alt="r.image.alt ?? ''" sizes="sm:100vw md:50vw xl:340px" densities="x1 x2" format="webp" loading="lazy" />
              <span v-else class="rec__todo"><Txt :text="r.image?.todo ?? '[TODO: a photo]'" /></span>
            </span>
            <span class="rec__text">
              <span class="t-mono muted">{{ r.year }}</span>
              <span class="rec__title">{{ r.title }}<span v-if="r.href" class="rec__arrow" aria-hidden="true">&nbsp;↗</span></span>
              <span class="muted rec__detail">{{ r.detail }}</span>
            </span>
          </component>
        </li>
      </ul>
    </section>

    <section class="split about__block reveal" aria-labelledby="a-out">
      <h2 id="a-out" class="t-heading">{{ t('about.outside') }}</h2>
      <div class="about__out">
        <p>{{ page.outside.text }} <NuxtLink :to="lp('/work') + '#w-side'">{{ t('about.play') }}<span aria-hidden="true">&nbsp;›</span></NuxtLink></p>
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

.about__top { display: grid; gap: var(--space-12); margin-top: var(--space-12); }

.about__story { display: grid; gap: var(--space-6); align-content: start; max-width: 40rem; }

.about__dash { border: 0; border-top: 1px dashed var(--line-strong); }

.about__body :deep(p + p) { margin-top: var(--space-4); }

.about__body :deep(p) { font-size: var(--text-body); }

.about__block { margin-top: var(--space-section); padding-top: var(--space-6); border-top: 1px solid var(--line); }

.about__block--wide { display: grid; gap: var(--space-8); }

.about__list { display: grid; gap: var(--space-3); padding: 0; list-style: none; }

.about__list li { display: grid; gap: var(--space-1); }

.about__when { white-space: nowrap; }

/* Recognition: photo cards. Linked ones open the source. */
.rec { display: grid; gap: var(--layout-gutter); padding: 0; list-style: none; }

.rec__card { display: grid; gap: var(--space-3); color: inherit; text-decoration: none; }

.rec__media {
  display: block;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-card);
  background: var(--panel);
}

.rec__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms var(--motion-ease), filter 300ms var(--motion-ease);
}

.rec__todo { display: grid; place-items: center; height: 100%; padding: var(--space-4); text-align: center; }

.rec__text { display: grid; gap: var(--space-1); }

.rec__title { font-size: var(--text-heading); letter-spacing: var(--tracking-heading); line-height: 1.25; }

.rec__arrow { display: inline-block; transition: transform var(--motion-dur-fast) var(--motion-ease); }

.rec__detail { font-size: var(--text-small); }

a.rec__card:hover img { transform: scale(1.04); }

a.rec__card:hover .rec__arrow { transform: translate(2px, -2px); }

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

@media (width >= 40rem) {
  .rec { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: var(--space-8); }
}

@media (width >= 64rem) {
  .about__top { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); column-gap: var(--layout-gutter); }

  .about__body :deep(p) { font-size: var(--text-heading); line-height: 1.5; letter-spacing: -0.005em; }

  .about__list--exp li { grid-template-columns: 8rem 1fr; column-gap: var(--layout-gutter); }

  .about__block--wide { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); column-gap: var(--layout-gutter); align-items: start; }

  .rec { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (width >= 90rem) {
  .about__block--wide { grid-template-columns: 1fr; }

  .rec { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
</style>
