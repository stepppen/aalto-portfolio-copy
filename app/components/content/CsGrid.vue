<script setup lang="ts">
withDefaults(defineProps<{ cols?: number | string }>(), { cols: 2 })
</script>

<template>
  <div class="cs-grid" :style="{ '--cols': cols }"><slot /></div>
</template>

<style scoped>
.cs-grid { display: grid; gap: var(--layout-gutter); align-items: start; }

@media (width >= 48rem) {
  .cs-grid { grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); }
}
</style>
