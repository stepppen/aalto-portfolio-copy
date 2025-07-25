<template>
  <transition name="card-fade">
    <div v-if="cardLoaded" class="project-card-container">
      <nuxt-link :to="`/projects/${project.meta.slug}`" class="project-link">
        <div class="project-card">
          <div class="image-wrapper" :style="{ 
            paddingBottom: imageLoaded ? '0' : `${getAspectRatio(project.aspectRatio || '3:2')}%` 
          }">
            <!-- Greyscale placeholder -->
            <div 
              v-if="!imageLoaded" 
              class="image-placeholder"
            ></div>
            
            <NuxtImg
              :src="getImagePath(project.meta.preview)"
              :alt="project.title"
              class="project-image"
              :width="400"
              :height="getHeightFromAspectRatio(project.meta.aspectRatio)"
              :style="{ height: imageLoaded ? 'auto' : '0' }"
              format="webp"
              loading="lazy"
              @load="handleImageLoaded"
            />
            <!-- <img :src="getImagePath(project.preview)" :alt="project.title" /> -->
          </div>
          
          <!-- Text content -->
          <div class="project-info">
            <h3 class="project-title">{{ project.title }}</h3>
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
import { ref, onMounted } from 'vue';

const props = defineProps({
  project: { type: Object, required: true }
});

const cardLoaded = ref(false);
const imageLoaded = ref(false);

// Convert aspect ratio string to percentage for padding-bottom
function getAspectRatio(ratio) {
  // Handle different formats: "3:2", "1:1", etc.
  if (typeof ratio === 'string' && ratio.includes(':')) {
    const [width, height] = ratio.split(':').map(Number);
    return (height / width) * 100;
  }
  // Default to 2:3 (portrait) if not specified
  return 66.67;
}

function handleImageLoaded() {
  imageLoaded.value = true;
}

function getImagePath(path) {
  // Debug the path to see what's actually coming from your JSON
  console.log("Original image path:", path);
  
  // If path is undefined or empty, use a fallback
  if (!path) {
    return '/images/placeholder.webp';
  }
  
  // If the path already starts with /, return it as is
  if (path.startsWith('/')) {
    return path;
  }
  
  // Otherwise, add the leading /
  return `/${path}`;
}

function getHeightFromAspectRatio(aspectRatio, baseWidth = 400) {
  if (!aspectRatio) return baseWidth; // Default to square if no ratio provided
  
  const [width, height] = aspectRatio.split(':').map(Number);
  return Math.round((baseWidth * height) / width);
}

onMounted(() => {
  console.log('ProjectCard project:', props.project);
  setTimeout(() => {
    cardLoaded.value = true;
  }, 200);
});
</script>
  
<style scoped>
.project-card-container {
  margin-bottom: 1.5rem;
  break-inside: avoid;
  isolation: isolate;
  position: relative;
  z-index: 1;
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
  will-change: transform;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Image container with variable height */
.image-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: 1rem 1rem 0 0;
  background-color: #282828; /* Light grey placeholder */
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.project-image {
  width: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.3s ease;
  z-index: 2;
}

/* Keep your existing hover and animation styles */
.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.project-card:hover .project-image {
  transform: scale(1.03);
}
  /* Text content styling */
  .project-info {
    padding: 0.8rem;
    transition: padding-left 0.2s ease, color 0.2s ease;
  }
  
  .project-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 200;
    line-height: 1.4;
    transition: color 0.2s ease;
  }
  
  .one-liner {
    margin: 0.2rem 0 0;
    font-size: 0.85rem;
    opacity: 0.4;
    transition: opacity 0.2s ease;
  }
  
  /* Subtle text changes on hover */
  .project-card:hover .project-info {
    padding-left: 1rem;
  }
  
  .project-card:hover .project-title {
    color: rgba(255, 255, 255, 1);
  }
  
  .project-card:hover .one-liner {
    opacity: 0.6;
  }
  
  /* Add a subtle border glow effect */
  .project-card {
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .project-card:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  /* Appearance animation */
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
  
  /* Active/pressed state for feedback */
  .project-card:active {
    transform: translateY(-1px); /* Slightly less elevation when pressed */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }
  </style>