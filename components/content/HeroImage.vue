<template>
  <div class="hero-wrapper">
    <NuxtImg
      :src="src.startsWith('/') ? src : `/${src}`"
      :alt="alt"
      class="hero-image"
      format="webp"
      loading="lazy"
    />
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.hero-wrapper {
  width: 100%;
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: auto;
}
</style>