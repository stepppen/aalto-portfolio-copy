<template>
  <div class="flex flex-col lg:flex-row justify-center inset-0 lg:left-48 px-4 lg:absolute overflow-hidden  max-lg:items-center max-lg:gap-8">
    <transition name="opacity-p5">
      <div v-if="showThree" class="lg:my-auto max-md:flex max-md:scale-75 max-md:mt-12 max-md:justify-center max-md:h-72 max-md:-translate-y-16">
        <ThreeNew />
      </div>
    </transition>

    <div class="w-16">
    </div>
    <transition name="fade-titles">
      <div v-if="showTitles" class="flex flex-col w-dvw md:w-1/2 lg:w-96 lg:my-auto lg:inset-0 max-lg:justify-center max-lg:items-center margin-handeler max-lg:text-center">
        <h2>Stepan Vedunov</h2>
        <p lang="en" class=" lg:justify-center  max-md:max-w-sm">I design intelligent interfaces that enhance real-world interactions, with a strong interest in human-machine interaction and industrial design. Contact me at: </p>
        
        <!-- Updated contact section with icons -->
        <div class="contact-info">
          <p class="email">stepan@vedunov.com</p>
          <div class="social-links">
            <a href="https://www.linkedin.com/in/stepan-v-0242b2226/" target="_blank" class="social-icon linkedin" aria-label="LinkedIn Profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue';
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
    margin: auto;
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

/* New styles for contact section */
.contact-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
}

.email {
  margin: 0;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s ease;
}

.social-icon:hover {
  color: #0077B5; /* LinkedIn blue */
  transform: translateY(-2px);
}

.social-icon:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .contact-info {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
}
</style>