<script setup lang="ts">
const { t, lang, col } = useLang()
useSeoMeta({ title: () => t('notes.title'), description: () => t('notes.description') })
const { data: notes } = await useAsyncData(`notes-${lang.value}`, () => queryCollection(col('notes')).where('draft', '=', false).order('date', 'DESC').all())
const fmt = (d: string) => {
  const [y, m] = d.split('-')
  return m ? new Date(Date.UTC(+y, +m - 1)).toLocaleString(t('date.locale'), { month: 'long', year: 'numeric', timeZone: 'UTC' }) : y
}
</script>

<template>
  <section class="container section notes">
    <div class="notes__head">
      <h1 class="t-title">{{ t('notes.title') }}</h1>
      <p class="t-statement muted">{{ t('notes.wip') }}</p>
    </div>
    <ol v-if="notes?.length" class="notes__list" role="list">
      <li v-for="n in notes" :key="n.path" class="notes__item">
        <NuxtLink :to="n.path" class="notes__link">
          <span class="t-heading">{{ n.title }}</span>
          <span class="muted">{{ n.description }}</span>
        </NuxtLink>
        <span class="t-mono muted">{{ fmt(n.date) }}</span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.notes { display: grid; gap: var(--space-12); }

.notes__head { display: grid; gap: var(--space-4); }

.notes__list { padding: 0; list-style: none; border-bottom: 1px solid var(--line); }

.notes__item { display: grid; gap: var(--space-2); padding-block: var(--space-6); border-top: 1px solid var(--line); }

.notes__link { display: grid; gap: var(--space-1); text-decoration: none; }

.notes__link:hover .t-heading { text-decoration: underline; text-decoration-thickness: 1px; }

@media (width >= 64rem) {
  .notes__item { grid-template-columns: 1fr auto; align-items: baseline; }
}
</style>
