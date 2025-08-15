<template>
  <div class="hero-wrapper rounded-2xl image-animation">
    <div v-if="!showImage" class="image-placeholder"></div>
    <NuxtImg
      v-else
      :src="src.startsWith('/') ? src : `/${src}`"
      :alt="alt"
      class="hero-image object-cover"
      format="webp"
      width="1080px"
      height="720px"
      preload
    />  
  </div>
  
</template>

<script setup>
let showImage = ref(false)

onMounted(() => {
  showImage.value = true
})

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

.image-placeholder{
  width: 1080px;
  height: 720px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>