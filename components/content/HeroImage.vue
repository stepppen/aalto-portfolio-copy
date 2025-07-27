<template>
  <div class="hero-wrapper rounded-xl">
    <NuxtImg
      :src="src.startsWith('/') ? src : `/${src}`"
      :alt="alt"
      class="hero-image object-cover"
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
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
}
</style>