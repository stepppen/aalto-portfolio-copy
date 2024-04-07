<template>
    <nuxt-link :to="`/projects/${project.id}`"> 
      <transition name="fade">
        <div class="flex items-baseline hover:px-1 slow-transition overlayTitle">
          <p class="px-4">0{{ project.id }}</p>
          <h2>{{ project.title }}</h2>
        </div>
      </transition>
    </nuxt-link>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const { project } = defineProps(['project']);   
  </script>
  
  <style lang="scss" scoped>
  .slow-transition {
    transition: 0.1s ease-in-out;
  }
  
  .overlayTitle {
    opacity: 1;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease-out;
  }
  
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  