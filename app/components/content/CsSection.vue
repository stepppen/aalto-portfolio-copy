<script setup lang="ts">
// A numbered case-study section. Text sits in a reading column; media inside breaks out to full width.
defineProps<{ title: string; n?: string }>()
</script>

<template>
  <section class="cs-section" :aria-label="title">
    <header class="cs-section__head">
      <span v-if="n" class="t-mono muted">{{ n }}</span>
      <h2 class="t-heading">{{ title }}</h2>
    </header>
    <div class="cs-flow">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.cs-section { padding-block: var(--space-12); border-top: 1px solid var(--line); }

.cs-section__head { display: grid; gap: var(--space-2); margin-bottom: var(--space-6); }

@media (width >= 75rem) {
  .cs-section__head { grid-template-columns: calc(100% / 12) 1fr; align-items: baseline; }
}
</style>
