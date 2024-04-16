<template>
  <transition name="fade">
    <nuxt-link :to="`/projects/${project.id}`"> 
        <div class="flex items-baseline lg:hover:pl-2 slow-transition overlayTitle">
          <p class="px-4 min-w-14">0{{ project.id }}</p>
          <h2>{{ project.title }}</h2>
        </div>
    </nuxt-link>
  </transition>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const { project } = defineProps(['project']);   
  </script>
  
  <style lang="scss" scoped>
  .slow-transition {
    transition: 0.2s ease-in-out;
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
  