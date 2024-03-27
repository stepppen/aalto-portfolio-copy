<template>
  <div class="flex flex-col lg:flex-row justify-center inset-0 lg:left-48 px-4 absolute">
    <div class="lg:my-auto">
      <div v-if="isThreeLoaded">
        <ThreeNew />
      </div>
    </div>
    <div class="w-16"></div>
    <div class="flex flex-col w-full md:w-1/2 lg:w-1/4 my-auto md:inset-0">
      <p lang="en" class="text-justify md:justify-center">I am currently studying interaction design at the Zurich University of the Arts in Switzerland. Looking to further my understanding of interaction and product design while continuing to explore interdisciplinary learning. Feel free to contact me under: </p>
      <p>stepan@vedunov.com</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isThreeLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isThreeLoaded.value = true;
    preloadThreeScript();
  }, 2000); // Delay set to 2000ms
});

const preloadThreeScript = () => {
  // Preload Three.js script
  const threeScript = document.createElement('script');
  threeScript.src = 'ThreeNew.vue';
  threeScript.defer = true;
  document.head.appendChild(threeScript);
};
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 20px;
  font-size: 36px;
}

p {
  margin: 20px 0;
  word-break: break-word !important; 
  -webkit-hyphens: auto !important; 
  -moz-hyphens: auto !important; 
  -ms-hyphens: auto !important; 
  -o-hyphens: auto !important; 
  hyphens: auto !important;
}
</style>
