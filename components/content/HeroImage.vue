<template>
  <div class="hero-wrapper rounded-2xl">
    <div 
      v-if="!imageLoaded" 
      class="image-placeholder"
      :style="{ aspectRatio: '3/2' }"
    >
      <div class="shimmer"></div>
    </div>
    
    <NuxtImg
      :src="src.startsWith('/') ? src : `/${src}`"
      :alt="alt"
      class="hero-image object-cover"
      :class="{ 'loaded': imageLoaded }"
      format="webp"
      quality="90"
      width="1080"
      height="720"
      sizes="sm:100vw md:100vw lg:90vw"
      preload
      fetchpriority="high"
      decoding="async"
      @load="handleImageLoad"
      @error="handleImageError"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  }
});

const imageLoaded = ref(false);
const imageError = ref(false);

function handleImageLoad() {
  imageLoaded.value = true;
}

function handleImageError() {
  console.error('Hero image failed to load:', props.src);
  imageError.value = true;
  imageLoaded.value = true;
}

onMounted(() => {
  if (process.client) {
    const img = new Image();
    img.src = props.src.startsWith('/') ? props.src : `/${props.src}`;
    img.onload = () => {
      imageLoaded.value = true;
    };
  }
});
</script>

<style scoped>
.hero-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  aspect-ratio: 3 / 2;
  opacity: 0;
  transform: translateY(10px);
  animation: fade-in-up 0.8s forwards;
  animation-delay: 0s;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  position: relative;
  overflow: hidden;
}

.shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.03) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.hero-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.6s ease-out;
  /* GPU acceleration */
  transform: translate3d(0, 0, 0);
  will-change: opacity;
}

.hero-image.loaded {
  opacity: 1;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-wrapper {
    aspect-ratio: 4 / 3;
  }
}
</style>