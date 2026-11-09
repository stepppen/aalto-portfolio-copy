<script setup lang="ts">
// A short aside in the reading column, e.g. "No screens: confidential client".
</script>

<template>
  <aside class="cs-note t-small"><slot /></aside>
</template>

<style scoped>
.cs-note {
  padding: var(--space-4) var(--space-6);
  border-left: 2px solid var(--signal);
  background: var(--panel);
  color: var(--ink);
}
</style>
