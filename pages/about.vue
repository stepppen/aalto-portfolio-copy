<template>
    <Head>
    <Title>About</Title>
  </Head>
  <div class="flex flex-col lg:flex-row justify-center inset-0 px-4 overflow-hidden  max-lg:items-center max-lg:gap-8">
    <transition name="opacity-p5">
      <div>
        <ClientOnly>
          <div>
            <div 
              ref="threeContainer"
              class="lg:my-auto max-md:flex max-md:scale-75 max-md:mt-12 max-md:justify-center max-md:h-72 max-md:-translate-y-16"
            >
              <!-- Always render placeholder to avoid CLS -->
              <div v-if="!showThree" class="three-placeholder"></div>
              <ThreeFace v-else />
          </div>
          </div>
        </ClientOnly>
      </div>
    </transition>

    <div class="w-16">
    </div>
    <transition name="fade-titles">
      <div v-if="showTitles" class="flex flex-col md:w-2/3 lg:w-96 lg:my-auto lg:inset-0 max-lg:justify-center max-lg:items-center margin-handeler max-lg:text-center">
        <h2>Stepan Vedunov</h2>
        <p lang="en" class=" lg:justify-center  max-md:max-w-sm">I’m an interaction designer with a strong foundation in UX/UI, going beyond conventional web design to shape experiences for emerging technologies such as VR, IoT and robotics. <br> </p>
        
        <!-- Updated contact section with icons -->
        <div class="contact-info">
  <a href="mailto:stepan.vedunov@outlook.com" class="contact-tag email-tag">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
    stepan.vedunov@outlook.com
  </a>
  <a href="https://www.linkedin.com/in/stepan-v-0242b2226/" target="_blank" class="contact-tag linkedin-tag">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
    LinkedIn
  </a>
</div>
      </div>
    </transition>
  </div>
</template>
  
<script setup lang="ts">
const ThreeFace = defineAsyncComponent(() => import('~/components/ThreeNew.vue'))
let showThree = ref(false);
let showTitles = ref(false);
const threeContainer = ref(null)


useSeoMeta({
  title: 'About Me — Design Portfolio',
  description: 'Learn more about Stepan Vedunov, an interaction designer focused on digital and physical product experiences.',
  ogTitle: 'About Me — Design Portfolio',
  ogDescription: 'Learn more about Stepan Vedunov, an interaction designer focused on digital and physical product experiences.',
})


onMounted(() => {
  showThree.value = true
  showTitles.value = true
})
</script>
  
<style lang="scss" scoped>
h2 {
  margin-bottom: 20px;
}

@media (max-width: 700px){
  .margin-handeler{
    margin: auto;
  }
}

p {
  margin: 0;
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

.three-placeholder {
  width: 300px; 
  height: 300px; 
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

@media (max-width: 640px) {
  .contact-info {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding-bottom: 2rem;
  }
}


/* Contact tags styling */
.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.contact-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.contact-tag:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.email-tag:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.linkedin-tag:hover {
  background: rgba(0, 119, 181, 0.15);
  border-color: rgba(0, 119, 181, 0.3);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .contact-info {
    justify-content: center;
  }
  
  .contact-tag {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}

/* Remove old social styling */
.social-links,
.social-icon,
.email {
  /* Overriding old styles */
  margin: 0;
  padding: 0;
  display: inline;
}
</style>