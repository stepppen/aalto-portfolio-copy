<template>
    <transition name="card-fade">
      <div v-if="cardLoaded" class="project-card-container">
        <nuxt-link :to="`/projects/${project.id}`" class="project-link">
          <div class="project-card">
            <!-- Image container with subtle scaling effect -->
            <div class="image-wrapper">
              <img 
                :src="project.preview" 
                :alt="project.title" 
                loading="lazy" 
                class="project-image"
              />
            </div>
            
            <!-- Text content -->
            <div class="project-info">
              <h3 class="project-title">{{ project.title }}</h3>
              <div class="flex justify-between">
                  <p class="project-year">{{ project.role }}</p>
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
  
  onMounted(() => {
    setTimeout(() => {
      cardLoaded.value = true;
    }, 200);
  });
  </script>
  
  <style scoped>
  .project-card-container {
    margin-bottom: 1.5rem;
    break-inside: avoid;
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
  }
  
  /* Enhanced elevation on hover - matching your other components */
  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    background-color: rgba(255, 255, 255, 0.15);
  }
  
  /* Image container with overflow control */
  .image-wrapper {
    position: relative;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 3/2;
    border-radius: 1rem;
  }
  
  .project-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
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
    font-weight: 500;
    line-height: 1.4;
    transition: color 0.2s ease;
  }
  
  .project-year {
    margin: 0.2rem 0 0;
    font-size: 0.85rem;
    opacity: 0.6;
    transition: opacity 0.2s ease;
  }
  
  /* Subtle text changes on hover */
  .project-card:hover .project-info {
    padding-left: 1rem;
  }
  
  .project-card:hover .project-title {
    color: rgba(255, 255, 255, 1);
  }
  
  .project-card:hover .project-year {
    opacity: 0.8;
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