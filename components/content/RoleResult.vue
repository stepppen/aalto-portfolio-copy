<template>
  <div class="image-grid pb-12 w-full" :class="rows">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  rows: {
    type: String,
    default: 'rows-3'
  }
});
</script>

<style scoped>
.image-grid {
    display: flex;
    flex-direction: column;
  /* margin: 12px 0; <-- You can keep this or remove it, depending on spacing needs */
  align-items: center;
  justify-content: center;
  height: 100%;
}

.rows-2 {
  /* Enforce 2 rows of equal height */
  grid-template-rows: repeat(2, 1fr);
}

/* Remove or fix the .rows-3 definition if you only need a vertical grid */
.rows-3 {
  /* If this is meant to be vertical, it should be grid-template-rows: repeat(3, 1fr); */
  grid-template-rows: repeat(3, 1fr);
  /* The original grid-template-columns: repeat(3, 1fr); was wrong for a vertical row layout. */
}

@media (max-width: 768px) {
  .image-grid {
    /* Mobile: Stack them all in a single column */
    grid-template-columns: 1fr; 
    margin: 0;
  }
  /* In mobile, rows-2 should revert to stacking, which happens naturally
     when the outer grid collapses to 1 column and the inner grid has no fixed columns.
     However, keeping grid-template-rows is generally fine unless the 1fr causes issues.
     The overall layout is usually managed by the outer grid breaking.
  */
}
</style>