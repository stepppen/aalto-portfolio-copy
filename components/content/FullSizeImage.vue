<template>
  <figure class="content-image" :class="{ 'is-loaded': imageLoaded }">
    <div 
      v-if="!imageLoaded" 
      class="image-placeholder rounded-2xl"
      :style="{ aspectRatio: calculateAspectRatio() }"
    >
      <div class="shimmer"></div>
    </div>

    <img
      v-if="src.endsWith('.gif')"
      :src="src"
      :alt="alt"
      :width="width || 1200"
      class="image rounded-2xl"
      loading="lazy"
      decoding="async"
      @load="handleImageLoad"
    />
    
    <NuxtImg
      v-else
      :src="src"
      :alt="alt"
      format="webp"
      quality="95"
      loading="lazy"
      decoding="async"
      class="image rounded-2xl"
      @load="handleImageLoad"
      @error="handleImageError"
    />
    
    <figcaption v-if="caption">
      {{ caption }}
    </figcaption>
  </figure>
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
  },
  caption: String,
  width: Number,
  aspectRatio: {
    type: String,
    default: '16/9'
  }
});

const imageLoaded = ref(false);
const imageError = ref(false);

function calculateAspectRatio() {
  if (props.width) {
    if (props.width === 1200) return '16/9';
    if (props.width === 800) return '4/3';
  }
  return props.aspectRatio || '16/9';
}

function handleImageLoad() {
  imageLoaded.value = true;
}

function handleImageError() {
  imageError.value = true;
  imageLoaded.value = true;
}
</script>

<style scoped>
.content-image {
  margin: 1rem 0;
  position: relative;
  contain: layout style paint;
}

.image-placeholder {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
  min-height: 300px;
}

.shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.image {
  width: 100%;
  height: auto;
  display: block;
}

.is-loaded .image-placeholder {
  display: none;
}

figcaption {
  margin-top: 0.5rem;
  text-align: center;
  color: #ffffff;
  opacity: 0.5;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .image-placeholder {
    min-height: 200px;
  }
}
</style>