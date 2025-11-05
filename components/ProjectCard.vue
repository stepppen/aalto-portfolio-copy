<template>
  <transition name="card-fade">
    <div v-if="cardLoaded" class="project-card-container">
      <nuxt-link :to="`/projects/${project.meta.slug}`" class="project-link">
        <div class="project-card">
          <div 
            class="image-wrapper" 
            :style="{ 
              aspectRatio: getAspectRatioValue(project.meta.aspectRatio || '3:2')
            }"
          >
            <div 
              v-if="!imageLoaded" 
              class="image-placeholder"
              :style="{
                backgroundColor: '#282828'
              }"
            >
              <div class="skeleton-loader"></div>
            </div>

            <NuxtImg
              :src="getImagePath(project.meta.preview)"
              :alt="project.title"
              class="project-image"
              :class="{ 'loaded': imageLoaded }"
              :width="400"
              :height="getHeightFromAspectRatio(project.meta.aspectRatio)"
              format="webp"
              quality="85"
              loading="lazy"
              decoding="async"
              @load="handleImageLoaded"
              preset="project"
              sizes="sm:100vw md:50vw lg:33vw"
            />
          </div>
          <div class="project-info">
            <h2 class="project-title">{{ project.title }}</h2>
            <div class="flex justify-between">
              <p class="one-liner">{{ project.meta.oneLiner }}</p>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>
  </transition>
</template>
  
<script setup>

const props = defineProps({
  project: { type: Object, required: true }
});

const cardLoaded = ref(false);
const imageLoaded = ref(false);

function getAspectRatioValue(ratio) {
  if (typeof ratio === 'string' && ratio.includes(':')) {
    const [width, height] = ratio.split(':').map(Number);
    return `${width}/${height}`;
  }
  return '3/2';
}

function getAspectRatio(ratio) {
  if (typeof ratio === 'string' && ratio.includes(':')) {
    const [width, height] = ratio.split(':').map(Number);
    return (height / width) * 100;
  }
  return 66.67;
}

function handleImageLoaded() {
  imageLoaded.value = true;
}

function getImagePath(path) {
  if (!path) {
    return '/images/placeholder.webp';
  }
  if (path.startsWith('/')) {
    return path;
  }
  return `/${path}`;
}

function getHeightFromAspectRatio(aspectRatio, baseWidth = 400) {
  if (!aspectRatio) return baseWidth;
  
  const [width, height] = aspectRatio.split(':').map(Number);
  return Math.round((baseWidth * height) / width);
}

onMounted(() => {
  cardLoaded.value = true;
});
</script>
  
<style scoped>
.project-card-container {
  margin-bottom: 1.5rem;
  break-inside: avoid;
  position: relative;
  isolation: isolate;
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.project-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.project-card {
  position: relative;
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.10);
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
  pointer-events: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: 1rem 1rem 0 0;
  background-color: #282828;
  contain: layout;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton-loader {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.project-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.3s ease, opacity 0.3s ease;
  z-index: 2;
  position: relative;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  opacity: 0;
}

.project-image.loaded {
  opacity: 1;
}

.project-card:hover {
  transform: translate3d(0, -2px, 0);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.project-card:hover .project-image {
  transform: translate3d(0, 0, 0) scale(1.03);
}

.project-info {
  padding: 0.8rem;
  transition: padding-left 0.2s ease;
  contain: layout style;
}

.project-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.4;
  transition: color 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
}

.one-liner {
  margin: 0.2rem 0 0;
  font-size: 1rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-card:hover .project-info {
  padding-left: 1rem;
}

.project-card:hover .project-title {
  color: rgba(255, 255, 255, 1);
}

.project-card:hover .one-liner {
  opacity: 0.9;
}

.card-fade-enter-active {
  transition: all 0.3s ease-out;
}

.card-fade-enter-to {
  opacity: 1;
}

.card-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.project-card:active {
  transform: translate3d(0, -1px, 0);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

@supports (-webkit-appearance: none) {
  .project-card-container {
    break-inside: avoid-column;
    page-break-inside: avoid;
  }
}
</style>