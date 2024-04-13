<template>
  <div>
    <transition name="project-fade">
      <header v-if="showHeader" class="dynamic-header">
        <nav class="dynamic-nav">
          <nuxt-link to="/" class="flex lg:hover:px-1 slow-transition">
            <p class="pr-2">Stepan</p>
            <p>Vedunov</p>
          </nuxt-link>
          <ul class="flex lg:flex-col gap-2">
            <li>
              <nuxt-link to="/about" class="flex">
                <p class="lg:hover:px-1 slow-transition">About</p>
                <img class="px-2" src="../assets/icons/arrow.svg" alt="arrow-icon">
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/projects" class="flex">
                <p class="lg:hover:px-1 slow-transition">Projects</p>
                <img class="md:px-2 pl-2" src="../assets/icons/arrow.svg" alt="arrow-icon">
              </nuxt-link>
            </li>
          </ul>
          <p class="lg:block hidden">©2024</p>
        </nav>
      </header>
    </transition>

    <div class="flex justify-between justify-items-end p-4">
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
  