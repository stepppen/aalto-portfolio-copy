<template>
    <div>
      <transition name="slide-fade">
        <header class="dynamic-header z-50" v-if="showHeader">
          <nav class="dynamic-nav">
            <nuxt-link to="/" class="flex lg:hover:px-2 lg:hover:bg-rose-700 slow-transition">
              <div class="flex">
                <p class="pr-2">Stepan</p>
                <p>Vedunov</p>
              </div>
            </nuxt-link>
            <ul class="flex lg:flex-col gap-2">
              <li class="lg:hover:px-2 slow-transition lg:hover:bg-rose-700">
                <nuxt-link to="/about" class="flex">
                  <p class=" ">About</p>
                  <img class="px-2" src="../assets/icons/arrow.svg" alt="arrow-icon">
                </nuxt-link>
              </li>
              <li class="lg:hover:px-2 slow-transition lg:hover:bg-rose-700">
                <nuxt-link to="/projects" class="flex">
                  <p class="">Projects</p>
                  <img class="md:px-2 pl-2" src="../assets/icons/arrow.svg" alt="arrow-icon">
                </nuxt-link>
              </li>
            </ul>
            <p class="lg:block hidden">©2024</p>
          </nav>
        </header>
      </transition>
      <div class="flex lg:justify-between justify-center">
        <div class="lg:w-1/2"></div>
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  
  let showHeader = ref(false);
  const router = useRouter();
  const cursor = ref(null);
  

  onMounted(() => {
      // showHeader.value = true;
        setTimeout(() => {
          showHeader.value = true;
        },100);

  });

  // router.afterEach(() => {
  //   // Reset showHeader when navigating to a new route
  //   showHeader.value = false;
  // });


  </script>
  
  <style>
  p {
    font-family: Barlow, sans-serif;
    font-size: 18px;
    font-weight: 300;
  }
  .slow-transition {
      transition: 0.2s ease-in-out;
    }
    
    .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }
  
  .slide-fade-leave-active {
    transition: all 0.1s ease-out;
  }
  
  .slide-fade-enter-to,
  .slide-fade-leave-from {
    opacity: 1;
  }
  
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
  }

  </style>
  