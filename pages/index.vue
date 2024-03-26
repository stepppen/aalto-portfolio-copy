<template>
    <!-- <div>
      <LandingAnimation />
    </div> -->
    <div class="flex inset-0 absolute lg:left-48">
      <div class="hidden lg:flex flex-col justify-center w-custom-50">
        <img v-if="hoveredProject" :src="hoveredProject ? hoveredProject.thumb : project.thumb" alt="project img" loading="lazy" class="object-cover min-w-full aspect-[4/3]">
      </div>
      <div class="flex flex-col justify-center pl-8">
        <div class="flex flex-col" v-for="p in project.slice(0,5)">
          <LandingLink :project="p" @mouseover="handleMouseOver(p)" @mouseleave="handleMouseLeave"/>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import jsonData from './assets/projects/projects.json';
  const project = jsonData;
  const hoveredProject = ref(null);
  
  const handleMouseOver = (project) => {
    hoveredProject.value = project;
  };
  
  const handleMouseLeave = () => {
    hoveredProject.value = null;
  };
  
  onMounted(() => {
    // Preload landing animation script
    const landingScript = document.createElement('script');
    landingScript.src = 'landing-animation.js';
    landingScript.defer = true;
    document.head.appendChild(landingScript);
  
    // Lazy load project thumbnail images
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
  
    const lazyImages = document.querySelectorAll('.lazy-img');
    lazyImages.forEach(image => {
      observer.observe(image);
    });
  });
  </script>
  
  <style lang="scss" scoped> 
  .landing-img {
    width: 220px;
    transition: 0.3s ease;
  }
  </style>
  