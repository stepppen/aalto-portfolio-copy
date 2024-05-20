<template>
    <div class="flex flex-col lg:flex-row justify-center inset-0 lg:left-48 px-4 lg:absolute overflow-hidden">
      <transition name="opacity-p5">
        <div v-if="showThree" class="lg:my-auto max-md:scale-50 max-md:flex max-md:justify-center max-md:h-96 max-md:-translate-y-16">
            <ThreeNew />
        </div>
      </transition>

      <div class="w-16">

      </div>
      <transition name="fade-titles">
        <div v-if="showTitles" class="flex flex-col w-full md:w-1/2 lg:w-96 md:my-auto md:inset-0">
          <p lang="en" class="text-justify md:justify-center margin-handeler">I am a designer focused on intelligent interfaces that enhance real-world interactions. Apart from digital experiences I have a deep interest for industrial design and am looking to further my understanding in the intersection of digital and physical. Feel free to contact me under: </p>
          <p>stepan@vedunov.com</p>
          <!-- <div class="flex w-48 flex-wrap">
            <a href="mailto: stepan@vedunov.com"><button class="contact-button"> stepan@vedunov.com</button></a>
            
            <a href="https://www.linkedin.com/in/stepan-v-0242b2226/"><button class="contact-button"> Linkedin</button></a>
            <a href="https://www.instagram.com/vedunooov/"><button class="contact-button"> Instagram</button></a>
          </div> -->
        </div>
      </transition>

    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  let showThree = ref(false);
  let showTitles = ref(false);
  
  onMounted(() => {
    showThree.value = true;
    const threeScript = document.createElement('script');
    threeScript.src = 'ThreeNew.vue';
    threeScript.defer = true;
    document.head.appendChild(threeScript);
    setTimeout(() => {
        showTitles.value = true;
        
      }, 300);
  });
  </script>
  
  <style lang="scss" scoped>
  h2 {
    margin-bottom: 20px;
    font-size: 36px;
  }

  @media (max-width: 700px){
    .margin-handeler{
      margin: 0;
    }
  }
  
  p {
    margin: 10px 0;
    word-break: break-word !important; 
    -webkit-hyphens: auto !important; 
    -moz-hyphens: auto !important; 
    -ms-hyphens: auto !important; 
    -o-hyphens: auto !important; 
    hyphens: auto !important;
  }

  .fade-titles-enter-active {
      transition: all 0.3s ease-out;
    }
    .fade-titles-enter-to {
      opacity: 1;
    }
  
    .fade-titles-enter-from {
      transform: translateX(-20px);
      opacity: 0;
    }


  .opacity-p5-enter-from{
        opacity: 0;
    }
    .opacity-p5-enter-to{
        opacity: 1;
    }
    .opacity-p5-enter-active{
        transition: opacity 3s ease-out;
    }

  </style>
  