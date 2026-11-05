<script setup lang="ts">
useSeoMeta({ title: 'Work', description: 'Selected work and archive by Stepan Vedunov.' })
const { data: work } = await useAsyncData('work-list', () => queryCollection('work').order('stem', 'ASC').all())
</script>

<template>
  <section class="container section">
    <h1 class="t-title">Work</h1>
    <p class="todo" style="margin-block: var(--space-8)">Phase 4: list with thumbnails, role and year</p>
    <ul role="list" style="padding: 0; list-style: none">
      <li v-for="p in work" :key="p.path"><NuxtLink :to="`/work/${p.path.split('/').pop()}`">{{ p.title }}</NuxtLink></li>
    </ul>
  </section>
</template>
