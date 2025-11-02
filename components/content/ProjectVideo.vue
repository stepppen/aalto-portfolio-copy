<template>
  <div class="my-4 video-container-wrapper">
    <div class="flex items-center justify-center">
      <div class="relative aspect-video overflow-hidden rounded-2xl w-full max-w-full mx-auto">
        <div 
          v-if="!isPlaying" 
          class="video-thumbnail"
          @click="playVideo"
          @keydown.enter="playVideo"
          @keydown.space.prevent="playVideo"
          role="button"
          tabindex="0"
          aria-label="Play video"
        >
          <img 
            :src="thumbnailUrl" 
            :alt="`${caption || 'Video'} thumbnail`"
            class="thumbnail-image"
            loading="lazy"
            decoding="async"
          />
          <div class="play-button-wrapper">
            <div class="play-button">
              <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
                <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                <path d="M 45,24 27,14 27,34" fill="#fff"></path>
              </svg>
            </div>
            <div class="click-hint">Click to play</div>
          </div>
        </div>
        <iframe
          v-else
          :src="`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`"
          :title="caption || 'Video player'"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          class="video-iframe"
        ></iframe>
      </div>
    </div>
    
    <figcaption v-if="caption" class="mt-2 text-center text-gray-600 text-sm">
      {{ caption }}
    </figcaption>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  }
});

const isPlaying = ref(false);
const thumbnailUrl = computed(() => {
  return `https://img.youtube.com/vi/${props.id}/maxresdefault.jpg`;
});

function playVideo() {
  isPlaying.value = true;
}
</script>

<style scoped>
.video-container-wrapper {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in-up 0.6s ease-out forwards;
  animation-delay: 0.2s;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: #000;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.video-thumbnail:hover {
  transform: scale(1.02);
}

.video-thumbnail:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 4px;
  border-radius: 1rem;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.play-button-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 2;
}

.play-button {
  width: 68px;
  height: 48px;
  transition: transform 0.2s ease, filter 0.2s ease;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
}

.video-thumbnail:hover .play-button {
  transform: scale(1.15);
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.5));
}

.click-hint {
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
}

.video-thumbnail:hover .click-hint {
  opacity: 1;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  animation: fade-in 0.4s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

figcaption {
  margin-top: 0.5rem;
  text-align: center;
  color: #ffffff;
  opacity: 0.5;
  font-size: 0.9rem;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}

@media (max-width: 768px) {
  .play-button {
    width: 48px;
    height: 34px;
  }
  
  .click-hint {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
}
</style>