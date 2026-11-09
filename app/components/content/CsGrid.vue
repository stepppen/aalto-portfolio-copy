<script setup lang="ts">
withDefaults(defineProps<{ cols?: number | string }>(), { cols: 2 })
</script>

<template>
  <!-- Four or more columns (e.g. phone screens) stay two across on phones instead of stacking. -->
  <div class="cs-grid" :class="{ 'cs-grid--dense': Number(cols) >= 4 }" :style="{ '--cols': cols }"><slot /></div>
</template>

<style scoped>
.cs-grid { display: grid; gap: var(--layout-gutter); align-items: start; }

.cs-grid--dense { grid-template-columns: repeat(2, minmax(0, 1fr)); }

@media (width >= 48rem) {
  .cs-grid { grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); }
}
</style>
