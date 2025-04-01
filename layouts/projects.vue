<template>
  <P5Animation />
    <div>
      <transition name="slide-fade">
        <header class="dynamic-header z-50 overflow-hidden" v-if="showHeader">
          <nav class="dynamic-nav">
            <Tab />
            <p class="lg:block hidden">©2025</p>
          </nav>
        </header>
      </transition>
      <div class="flex lg:justify-between justify-center overflow-hidden max-lg:p-4 p-8">
        <div class="lg:w-1/4"></div>
        <slot />
      </div>
    </div>
  </template>

  
  <script setup>
  
  let showHeader = ref(false);
  const router = useRouter();
  
  onMounted(() => {
    // Set showHeader to true after a short delay to trigger the transition
    setTimeout(() => {
      showHeader.value = true;
    }, 100);
  });
  
  router.afterEach(() => {
    // Reset showHeader when navigating to a new route
    showHeader.value = false;
  });
  </script>
  

  <style>
  .project-fade-enter-active {
    transition: all 0.3s ease-out;
  }
  
  .project-fade-leave-active {
    transition: all 0.1s ease-out;
  }
  
  .project-fade-enter-to,
  .project-fade-leave-from {
    opacity: 1;
  }
  
  .project-fade-enter-from,
  .project-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
  } 
  /* .router-link-exact-active {
    color:rgb(122, 217, 26);
  } */
  </style>
  