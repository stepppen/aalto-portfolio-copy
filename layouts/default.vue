<template>
  <div class="page-wrapper">
   <bgGradient />
    <div class="page-wrapper relative z-10">
      <transition name="slide-fade">
        <header class="dynamic-header z-50 overflow-hidden" v-if="showHeader">
          <nav class="dynamic-nav">
            <Tab />
          </nav>
        </header>
      </transition>
      <div class="overflow-hidden pt-32">
        <slot />
      </div>
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
    border: 1px solid rgb(255, 255, 255);
    transition: 0.2s ease-in-out;
  }
  .border-white:active{
    border: 1px solid rgb(240, 0, 0);
    /* border: 1px solid rgb(125, 12, 41); */
    /* background-color: rgb(10, 76, 127); */
  }
  p {
    font-family: Roboto, sans-serif;
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

  .content {
    position: relative;
    z-index: 10;
  }
  </style>
  