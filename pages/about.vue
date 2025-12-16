<template>
    <Head>
    <Title>About</Title>
  </Head>
  <div class="about-wrapper">
    <div class="flex flex-col lg:flex-row justify-center px-6 max-lg:items-center max-lg:gap-8">
      <transition name="opacity-p5">
        <div>
          <ClientOnly>
            <div>
              <div 
                ref="threeContainer"
                class="lg:my-auto max-md:flex max-md:scale-75 max-md:mt-12 max-md:justify-center max-md:h-72 max-md:-translate-y-16"
              >
                <div v-if="!showThree" class="three-placeholder"></div>
                <MyFace v-else />
            </div>
            </div>
          </ClientOnly>
        </div>
      </transition>

      <div class="w-16">
      </div>
      <transition name="fade-titles">
        <div v-if="showTitles" class="flex flex-col max-lg:gap-0 md:w-2/3 lg:w-96 lg:my-auto lg:inset-0 max-lg:justify-center max-lg:items-center margin-handeler max-lg:text-center max-w-full">
          <h2 class="max-lg:m-0">About me</h2>
          <p lang="en" class=" lg:justify-center  max-md:max-w-sm">Hi, I am an interaction and end-to-end product designer based in Zurich. I focus on UX/UI and HCI, going beyond conventional web design to shape experiences for emerging technologies such as VR, IoT and robotics. <br> </p>
          <div class="py-8">
            <div class="skills-container">
              <div class="skills-line">
                <h4>Design</h4>
                <div class="skills-list">
                  <p>UI/UX Design</p>
                  <div class="bullet"></div>
                  <p>Service Design</p>
                  <div class="bullet"></div>
                  <p>Product Design</p>
                  <div class="bullet"></div>
                  <p>Design Systems</p>
                  <div class="bullet"></div>
                  <p>UX Research</p>
                </div>
              </div>
              
              <div class="skills-line">
                <h4 >Development</h4>
                <div class="skills-list">
                  <p>Vue.js / Nuxt.js</p>
                  <div class="bullet"></div>
                  <p>HTML / CSS / JS</p>
                  <div class="bullet"></div>
                  <p>Node.js</p>
                </div>
              </div>
              
              <div class="skills-line">
                <h4 >Tools</h4>
                <div class="skills-list">
                  <p>Figma</p>
                  <div class="bullet"></div>
                  <p>Adobe CS</p>
                  <div class="bullet"></div>
                  <p>Blender</p>
                  <div class="bullet"></div>
                  <p>CAD (Fusion360)</p>
                </div>
              </div>

          </div>
          </div>
        </div>
      </transition>
    </div>
  </div>

</template>
  
<script setup lang="ts">
import MyFace from '~/components/MyFace.vue'
import Footer from '~/components/Footer.vue'

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

// .about-wrapper {
//   min-height: calc(100vh - var(--header-height) - 80px);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   overflow-x: hidden;
// }

@media (min-width: 1024px) {
  .about-wrapper {
    min-height: calc(100vh - 8rem - 80px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    overflow-x: hidden;
  }
}

@media (max-width: 700px){
  .margin-handeler{
    padding: 1rem 0 0 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .about-wrapper {
    min-height: auto;
    padding: 2rem 0;
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
  max-width: 100%;
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

/* Skills section styling */
.skills-heading {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.skills-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  margin-bottom: 1rem;
  max-width: 100%;
  overflow: hidden;
}

.skills-line {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.8;
  max-width: 100%;
}

.skills-list p {
  margin: 0;
  font-size: 1rem;
  white-space: nowrap;
}

.bullet {
  width: 5px;
  height: 5px;
  background: white;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.8;
}

@media (max-width: 1024px) {
  .skills-container {
    align-items: center;
  }
  
  .skills-line {
    align-items: center;
    text-align: center;
  }
  
  .skills-list {
    justify-content: center;
  }
  
  .skills-list p {
    font-size: 0.9rem;
  }
}

.three-placeholder {
  width: 300px; 
  height: 300px; 
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(4px);
}
</style>