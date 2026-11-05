<script setup lang="ts">
useSeoMeta({ title: 'Notes', description: 'Writing by Stepan Vedunov on design, systems and code.' })
const { data: notes } = await useAsyncData('notes', () => queryCollection('notes').where('draft', '=', false).order('date', 'DESC').all())
const fmt = (d: string) => {
  const [y, m] = d.split('-')
  return m ? new Date(Date.UTC(+y, +m - 1)).toLocaleString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : y
}
</script>

<template>
  <section class="container section notes">
    <h1 class="t-title">Notes</h1>
    <ol class="notes__list" role="list">
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

.notes__list { padding: 0; list-style: none; border-bottom: 1px solid var(--line); }

.notes__item { display: grid; gap: var(--space-2); padding-block: var(--space-6); border-top: 1px solid var(--line); }

.notes__link { display: grid; gap: var(--space-1); text-decoration: none; }

.notes__link:hover .t-heading { text-decoration: underline; text-decoration-thickness: 1px; }

@media (width >= 64rem) {
  .notes__item { grid-template-columns: 1fr auto; align-items: baseline; }
}
</style>
