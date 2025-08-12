<template>
  <div class="hero-wrapper rounded-2xl image-animation">
    <NuxtImg
      :src="src.startsWith('/') ? src : `/${src}`"
      :alt="alt"
      class="hero-image object-cover"
      format="webp"
      width="1000px"
      preload
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

.image-animation{
  opacity: 0;
  transform: translateY(10px);
  animation: fade-in-up 0.8s forwards;
  animation-delay: 0s;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>