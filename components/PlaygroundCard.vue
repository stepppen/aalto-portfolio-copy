<template>
    <transition name="card-fade">
        <div v-if="cardLoaded" class="playground-card-wrapper">
            <article class="project-card">
                
                <div 
                    class="image-wrapper" 
                    :style="{ 
                        aspectRatio: getAspectRatioValue(item.meta.aspectRatio || '3:2')
                    }"
                >
                    <div v-if="!imageLoaded" class="image-placeholder">
                        <div class="skeleton-loader"></div>
                    </div>

                    <NuxtImg
                        :src="item.meta.preview"
                        :alt="item.title"
                        class="project-image"
                        :class="{ 'loaded': imageLoaded }"
                        :width="400"
                        :height="getHeightFromAspectRatio(item.meta.aspectRatio)"
                        format="webp"
                        quality="90"
                        loading="lazy"
                        decoding="async"
                        @load="handleImageLoaded"
                        sizes="sm:100vw md:50vw lg:33vw"
                    />
                </div>

                <div class="card-content">
                    
                    <div class="text-group">
                        <h2 class="project-title">{{ item.title }}</h2>
                        <p class="one-liner">{{ item.meta.description || item.meta.oneLiner }}</p>
                    </div>

                    <div v-if="item.meta.tags && item.meta.tags.length" class="tags-row">
                        <span 
                            v-for="(tag, index) in item.meta.tags" 
                            :key="index" 
                            class="tag-pill"
                        >
                            {{ tag }}
                        </span>
                    </div>

                    <div class="divider"></div>

                    <div class="card-footer">
                        <div class="meta-item">
                            <span class="meta-label">Type</span>
                            <span class="meta-value">{{ item.meta.type || 'Resource' }}</span>
                        </div>
                        
                        <a 
                            :href="item.meta.link" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="action-icon-link"
                            title="View External Link"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </div>
            </article>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  item: { type: Object, required: true } // Renamed to 'item' for distinction
});

const cardLoaded = ref(false);
const imageLoaded = ref(false);

// --- Helpers (copied from your original component) ---
function getAspectRatioValue(ratio) {
  if (typeof ratio === 'string' && ratio.includes(':')) {
    const [width, height] = ratio.split(':').map(Number);
    return `${width}/${height}`;
  }
  return '3/2';
}

function getHeightFromAspectRatio(aspectRatio, baseWidth = 400) {
  if (!aspectRatio) return baseWidth;
  const [width, height] = aspectRatio.split(':').map(Number);
  return Math.round((baseWidth * height) / width);
}

function handleImageLoaded() {
  imageLoaded.value = true;
}

onMounted(() => {
  cardLoaded.value = true;
});
</script>

<style scoped>
/*
  --- Base styles copied from your ProjectCard.vue ---
  Only specific overrides are noted below.
*/

/* --- Container --- */
.playground-card-wrapper {
  margin-bottom: 2rem;
  break-inside: avoid;
  position: relative;
  will-change: transform, opacity; 
  /* Added a general pointer to show it's interactable (for the link) */
  cursor: default; 
}

/* --- Card Base --- */
.project-card {
  /* ... existing styles ... */
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), 
              box-shadow 0.4s ease, 
              border-color 0.4s ease,
              background-color 0.4s ease;
  isolation: isolate;
  /* Ensure the card does not appear clickable like a router link */
  cursor: default; 
}

/* Re-enabling hover effects that now apply to the article tag */
.project-card:hover {
  transform: translateY(-6px);
  background-color: rgb(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
}

.project-card:hover .project-image {
  transform: scale(1.04);
}

.project-card:hover .tag-pill {
  border-color: rgba(255, 255, 255, 0.15);
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.project-card:hover .action-icon-link {
  opacity: 1;
  transform: translateX(0);
}

/* --- Action Icon (Link) Styling --- */
.action-icon-link {
    color: #ededed;
    opacity: 0; 
    transform: translateX(-10px);
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    cursor: pointer; /* Explicitly show it's a link */
    padding: 5px; /* Increase clickable area */
    border-radius: 50%;
    text-decoration: none; /* Remove underline if any */
}

.action-icon-link:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
}

/* --- Copy/Paste all other styles from your ProjectCard.vue's <style scoped> here --- */
/* ... (Ensure all other styles like .image-wrapper, .skeleton-loader, .card-content, etc. are present here) ... */
/* NOTE: The NuxtImg component requires a valid image source that is publicly accessible. */

/* --- Transitions --- */
/* ... (Copy all keyframes and card-fade styles) ... */
.card-fade-enter-active { transition: all 0.5s ease-out; }
.card-fade-enter-from { opacity: 0; transform: translateY(20px); }
.card-fade-enter-to { opacity: 1; transform: translateY(0); }
</style>