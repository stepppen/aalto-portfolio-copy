<script setup lang="ts">
import type { HomeCollectionItem } from '@nuxt/content'
defineProps<{ about: HomeCollectionItem['about'] }>()
</script>

<template>
  <section class="container section about" aria-labelledby="about-title">
    <NuxtImg
      :src="about.photo.src"
      :alt="about.photo.alt"
      class="about__photo"
      sizes="sm:60vw md:40vw xl:340px"
      densities="x1 x2"
      format="webp"
      loading="lazy"
      :style="{ aspectRatio: imageRatio(about.photo.src) }"
    />
    <div class="about__text">
      <h2 id="about-title" class="t-statement">{{ about.statement }}</h2>
      <p v-for="(para, i) in about.paragraphs" :key="i">{{ para }}</p>
      <NuxtLink to="/about" class="about__more link-quiet">Read more<span aria-hidden="true">&nbsp;›</span></NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.about { display: grid; gap: var(--space-8); }

.about__photo { width: min(100%, 22rem); border-radius: var(--radius-card); object-fit: cover; }

.about__text { display: grid; gap: var(--space-4); align-content: start; max-width: 40rem; }

.about__text p { font-size: var(--text-body); }

.about__more { display: inline-flex; align-items: center; min-height: var(--layout-tap); justify-self: start; }

@media (width >= 64rem) {
  .about { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); column-gap: var(--layout-gutter); }

  .about__photo { width: 100%; max-width: 22rem; }

  .about__text p { font-size: var(--text-heading); line-height: 1.45; letter-spacing: -0.005em; }
}
</style>
