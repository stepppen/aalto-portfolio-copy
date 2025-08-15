<template>
  <div class="image-grid" :class="columns">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: String,
    default: 'cols-2'
  }
});
</script>

<style scoped>
.image-grid {
  display: grid;
  gap: 2rem;
  margin: 12px 0;
  align-items: start;
}

.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 0;
  }
}
</style>