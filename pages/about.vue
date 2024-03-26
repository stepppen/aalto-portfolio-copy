<template>
    <div class="flex flex-col lg:flex-row justify-center inset-0 lg:left-48 px-4 absolute">
      <div class="lg:my-auto">
        <ThreeNew />
      </div>
      <div class="w-16"></div>
      <div class="flex flex-col w-full md:w-1/2 lg:w-1/4 my-auto md:inset-0">
        <p class="text-justify md:justify-center">I am currently studying interaction design at the Zurich University of the Arts in Switzerland. Looking to further my understanding of service and product design while continuing to explore interdisciplinary learning. Feel free to contact me under: </p>
        <p>stepan@vedunov.com</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  
  onMounted(() => {
    // Preload Three.js script
    const threeScript = document.createElement('script');
    threeScript.src = 'ThreeNew.vue';
    threeScript.defer = true;
    document.head.appendChild(threeScript);
  });
  </script>
  
  <style lang="scss" scoped>
  h2 {
    margin-bottom: 20px;
    font-size: 36px;
  }
  
  p {
    margin: 20px 0;
  }
  </style>
  