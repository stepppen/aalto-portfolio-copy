<script setup lang="ts">
// Simple writing layout: a narrow reading column, giant title, date in mono.
const slug = String(useRoute().params.slug)
const { t, lp, lang, col } = useLang()
const { data: note } = await useAsyncData(`note-${lang.value}-${slug}`, () => queryCollection(col('notes')).path(lp(`/notes/${slug}`)).first())
if (!note.value) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
const date = computed(() => {
  const [y, m] = note.value!.date.split('-')
  return m ? new Date(Date.UTC(+y, +m - 1)).toLocaleString(t('date.locale'), { month: 'long', year: 'numeric', timeZone: 'UTC' }) : y
})
useSeoMeta({
  title: () => note.value!.title,
  description: () => note.value!.description,
  ogType: 'article',
  ogDescription: () => note.value!.description,
})
</script>

<template>
  <article v-if="note" class="container note">
    <header class="note__head">
      <p class="t-mono muted"><NuxtLink :to="lp('/notes')" class="link-quiet">{{ t('notes.title') }}</NuxtLink> · <time :datetime="note.date">{{ date }}</time></p>
      <h1 class="t-title note__title">{{ note.title }}</h1>
      <p class="t-statement note__lead">{{ note.description }}</p>
    </header>
    <ContentRenderer :value="note" class="note__body" />
  </article>
</template>

<style scoped>
.note { padding-block: var(--space-8) 0; }

.note__head { display: grid; gap: var(--space-6); max-width: 60rem; padding-bottom: var(--space-12); }

.note__title { max-width: 14ch; }

.note__lead { max-width: 32ch; color: var(--ink-muted); }

.note__body { max-width: 44rem; font-size: var(--text-heading); line-height: 1.6; letter-spacing: -0.005em; }

.note__body :deep(p + p) { margin-top: var(--space-4); }

.note__body :deep(.cs-section) { padding-block: var(--space-12) 0; border-top: 1px solid var(--line); margin-top: var(--space-12); }

.note__body :deep(.cs-section > h2) { font-size: var(--text-statement); margin-bottom: var(--space-4); }

.note__body :deep(.cs-flow) { display: grid; gap: var(--space-4); }

.note__body :deep(.cs-flow > ul) { display: grid; gap: var(--space-2); padding-left: 1.1em; }

.note__body :deep(figure) { margin-block: var(--space-6); font-size: var(--text-body); }

@media (width >= 64rem) {
  .note__body { margin-left: calc((100% + var(--layout-gutter)) / 3); }

}
</style>
