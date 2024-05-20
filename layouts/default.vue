<template>
    <div>
      <transition name="slide-fade">
        <header class="dynamic-header z-50 overflow-hidden" v-if="showHeader">
          <nav class="dynamic-nav">
            <nuxt-link to="/" class="flex">
              <div class="flex align-center px-3 py-1 border-white  lg:hover:px-4 slow-transition icon">
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
      <div class="flex lg:justify-between justify-center overflow-hidden">
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
  .border-white{
    /* border: 1px solid #f7f7f7; */
    /* background-color: rgb(0, 0, 0); */
     border-radius: 5px;
  }
  .border-white:hover{
    background-color: rgb(190 18 60);
    transition: 0.2s ease-in-out;
  }
  .border-white:active{
    border: 1px solid rgb(255, 255, 255);
    /* border: 1px solid rgb(125, 12, 41); */
    /* background-color: rgb(10, 76, 127); */
  }
  p {
    font-family: Barlow, sans-serif;
    font-size: 1rem;
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
  