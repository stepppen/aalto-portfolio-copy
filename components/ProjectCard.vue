<template>
  <transition name="card-fade">
    <div v-if="cardLoaded" class="project-card-wrapper">
      <nuxt-link :to="`/projects/${project.meta.slug}`" class="project-link">
        <article class="project-card">
          
          <div 
            class="image-wrapper" 
            :style="{ 
              aspectRatio: getAspectRatioValue(project.meta.aspectRatio || '3:2')
            }"
          >
            <div v-if="!imageLoaded" class="image-placeholder">
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
              quality="90"
              loading="lazy"
              decoding="async"
              @load="handleImageLoaded"
              sizes="sm:100vw md:50vw lg:33vw"
            />
          </div>

          <div class="card-content">
            
            <div class="text-group">
              <h2 class="project-title">{{ project.title }}</h2>
              <p class="one-liner">{{ project.meta.oneLiner }}</p>
            </div>

            <div v-if="project.meta.tags && project.meta.tags.length" class="tags-row">
              <span 
                v-for="(tag, index) in project.meta.tags" 
                :key="index" 
                class="tag-pill"
              >
                {{ tag }}
              </span>
            </div>

            <div class="divider"></div>

            <div class="card-footer">
              <div class="meta-item">
                <span class="meta-label">Year</span>
                <span class="meta-value">{{ project.meta.year || '2024' }}</span>
              </div>
              
              <div class="action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
        </article>
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

// --- Helpers ---
function getAspectRatioValue(ratio) {
  if (typeof ratio === 'string' && ratio.includes(':')) {
    const [width, height] = ratio.split(':').map(Number);
    return `${width}/${height}`;
  }
  return '3/2';
}

function getImagePath(path) {
  if (!path) return '/images/placeholder.webp';
  return path.startsWith('/') ? path : `/${path}`;
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
/* --- Container --- */
.project-card-wrapper {
  margin-bottom: 2rem;
  break-inside: avoid;
  position: relative;
  will-change: transform, opacity; 
}

.project-link {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

/* --- Card Base --- */
.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 1.2rem;
  background-color: rgb(255, 255, 255, 0.02);
  /* background-color: #0b0f1a; */
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), 
              box-shadow 0.4s ease, 
              border-color 0.4s ease,
              background-color 0.4s ease;
  isolation: isolate;
}

/* --- Image Area --- */
.image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #1e1e1e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.image-placeholder {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.skeleton-loader {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  background-size: 200% 100%;
  animation: skeleton 1.5s infinite;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
  opacity: 0;
  z-index: 2;
}
.project-image.loaded { opacity: 1; }

/* --- Content Area --- */
.card-content {
  padding: 1.5rem; /* More breathing room */
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.text-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.project-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500; /* Medium weight looks cleaner than Bold */
  color: #ededed;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.one-liner {
  margin: 0;
  font-size: 0.95rem;
  color: #888888;
  line-height: 1.5;
  font-weight: 400;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* --- Tags --- */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #a1a1aa;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.35rem 0.75rem;
  border-radius: 100px; /* Fully rounded pill */
  transition: all 0.2s ease;
}

/* --- Divider --- */
.divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
}

/* --- Footer --- */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meta-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: 'SF Mono', 'Roboto Mono', monospace; /* Monospace for data */
  font-size: 0.75rem;
}

.meta-label {
  color: #52525b; /* Very muted label */
  /* text-transform: uppercase; */
  /* letter-spacing: 0.05em; */
}

.meta-value {
  color: #d4d4d8;
}

.action-icon {
  color: #ededed;
  opacity: 0; /* Hidden by default for cleaner look */
  transform: translateX(-10px);
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

/* --- Hover Effects --- */
.project-card:hover {
  transform: translateY(-6px);
  background-color: rgb(255, 255, 255, 0.05);
  /* background-color: #161616; */
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
}

.project-card:hover .project-image {
  transform: scale(1.04); /* Subtle zoom */
}

.project-card:hover .tag-pill {
  border-color: rgba(255, 255, 255, 0.15);
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.project-card:hover .action-icon {
  opacity: 1;
  transform: translateX(0);
}

/* --- Transitions --- */
@keyframes skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.card-fade-enter-active { transition: all 0.5s ease-out; }
.card-fade-enter-from { opacity: 0; transform: translateY(20px); }
.card-fade-enter-to { opacity: 1; transform: translateY(0); }
</style>