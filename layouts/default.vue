<template>
    <div>
      <transition name="slide-fade" v-if="!pageChanging">
        <header v-if="showHeader" class="dynamic-header z-50">
          <nav class="dynamic-nav">
            <nuxt-link to="/" class="flex lg:hover:px-1 slow-transition">
              <div class="flex">
                <p class="pr-2">Stepan</p>
                <p>Vedunov</p>
              </div>
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
      <div class="flex justify-between">
        <div class="lg:w-1/2"></div>
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  
  let showHeader = ref(false);
  let pageChanging = ref(false);
  const router = useRouter();

  onMounted(() => {
      // showHeader.value = true;
      if(!pageChanging.value){
            setTimeout(() => {
            showHeader.value = true;
        },100);
      }

  });

  watch(() => router.currentRoute.value, () => {
  pageChanging.value = true;
  
  setTimeout(() => {
    pageChanging.value = false;
  }, 1000);
});
  </script>
  
  <style>
  p {
    font-family: Barlow, sans-serif;
    font-size: 18px;
    font-weight: 300;
  }
  
  .slow-transition {
    transition: 0.1s ease-in-out;
  }
  
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }
  
  /* .slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  } */
  
  .slide-fade-enter-to {
    opacity: 1;
  }
  
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
  }
  </style>
  