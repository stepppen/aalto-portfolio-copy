<template>
  <div class="content-grid flex">
    <slot></slot>
  </div>
</template>


<style scoped>
.content-grid {
  display: flex;
  gap: 2rem;
  /* margin: 4px 0; */
}

/* .cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.cols-3 {
  grid-template-columns: repeat(3, 1fr);
} */

@media (max-width: 768px) {
  .content-grid {
    flex-direction: column;
  }
}
</style>