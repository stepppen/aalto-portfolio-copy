<template>
  <div>
    <transition name="slide-fade">
        <header class="dynamic-header z-50" v-if="showHeader">
          <nav class="dynamic-nav">
            <nuxt-link to="/" class="flex">
              <div class="flex align-center px-3 py-1 border-white lg:hover:px-4 slow-transition icon">
                <p class=" p-0 "> Stepan Vedunov</p>
              </div>
            </nuxt-link>
            <ul class="flex lg:flex-col gap-2">
              <li class="lg:hover:px-4 slow-transition px-3 md:w-[9rem] py-1 border-white nav-button">
                <nuxt-link to="/about" class="flex">
                  <p class=" ">About</p>
                  <img class="hidden lg:inline-block px-2" src="../assets/icons/arrow.svg" alt="arrow-icon">
                </nuxt-link>
              </li>
              <li class="lg:hover:px-4 slow-transition px-3 md:w-[9rem] py-1 border-white nav-button">
                <nuxt-link to="/projects" class="flex">
                  <p class="">Projects</p>
                  <img class="hidden lg:inline-block md:px-2 pl-2" src="../assets/icons/arrow.svg" alt="arrow-icon">
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
  