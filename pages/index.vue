<template>
  <div class="main-container">
    <Head>
      <Title>Home</Title>
    </Head>
    
    <!-- Place P5Animation at the very top level -->
    
    
    <transition name="fade-titles">
      <!-- CHANGE: Add height constraint instead of covering entire viewport -->
      <div v-if="showTitles" id="typewriter" class="flex lg:pl-32 z-40 justify-start overflow-hidden p-4 fixed hero-content">
        <div class="flex flex-col justify-center 2xl:pl-32 lg:pl-16">
          <div class="justify-self-center">
            <h1 class="text-reveal max-md:text-right">
              <span class="line-reveal">
                <span class="word">Designing</span>
                <span class="word">interactions</span> 
              </span>
              <span class="line-reveal">
                <span class="word">for</span>
                <span class="word">the</span>
                <span class="word digital-word"><i>digital</i></span>
                <span class="word">and</span>
              </span>
              <span class="line-reveal">
                <span class="word physical-word"><i>physical</i></span>
                <span class="word">worlds.</span>
              </span>
            </h1>
          </div>
        </div>
      </div>
    </transition>


    <div class="flex pt-4">
      <div class="lg:w-1/2"></div>
      <div class="flex flex-col lg:w-1/2 justify-end overflow-hidden p-4">
        <div class="">
          <div class="xl:w-full adaptive-grid max-md:grid lg:pr-[20px]">
            <div v-for="p in projects.slice(0, 5)" :key="p.id">
              <ProjectCard :project="p" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import P5Animation from '~/components/P5Animation.vue';
import projectsData from '~/assets/projects/projects.json'; // Adjust path as needed

const projects = ref(projectsData);
const showTitles = ref(false);
const showInfo = ref(false);

onMounted(() => {
  // Show the titles and info after a short delay
  setTimeout(() => {
    showInfo.value = true;
    showTitles.value = true;
    
    // Initialize text reveal animation after titles are shown
    nextTick(() => {
      animateText();
    });
  }, 300);
});

// Animation function for text reveal
function animateText() {
  const words = document.querySelectorAll('.word');
  
  words.forEach((word, index) => {
    setTimeout(() => {
      word.classList.add('revealed');
    }, 100 * index); // Stagger each word
  });
}
</script>

<style lang="scss" scoped>
.main-container {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  position: relative;
}

.hero-content {
  top: 0;
  left: 0;
  right: 0;
  height: 100vh; /* Limit to just the viewport height */
  pointer-events: none; /* Let clicks pass through the container */
}

/* But allow pointer events on the actual text */
.hero-content h1, 
.hero-content .word {
  pointer-events: auto;
}

// Text effect styles
.text-reveal {
  position: relative;
  line-height: 1.4;
  
  // Create subtle gradient effect
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(220, 220, 255, 1) 50%,
    rgba(255, 255, 255, 0.85) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  
  // Create interesting blend with background
  mix-blend-mode: difference;
  
  // Add subtle text glow
  text-shadow: 
    0 0 3px rgba(255, 255, 255, 0.1),
    0 0 15px rgba(255, 255, 255, 0.05);
    
  // Line reveal container
  .line-reveal {
    display: block;
    overflow: hidden;
    
    &:not(:last-child) {
      margin-bottom: 0.3rem;
    }
  }
  
  // Word animation
  .word {
    display: inline-block;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    margin-right: 1.5rem;
    
    &.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

// Your existing styles...
@media (max-width: 1500px) {
  .adaptive-grid {
    column-count: 1;
    column-gap: 20px;
  }
}

.custom-italics{
  font-style: italic;
}
.adaptive-grid {
  column-count: 2;
  column-gap: 20px;
}
.fade-titles-enter-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.fade-titles-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-titles-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.fade-info-enter-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.fade-info-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-info-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.opacity-p5-enter-from {
  opacity: 0;
}
.opacity-p5-enter-to {
  opacity: 1;
}
.opacity-p5-enter-active {
  transition: opacity 3s ease-out;
}

// Add hover effect to the heading
.text-reveal:hover .word {
  animation: subtle-wave 3s ease-in-out infinite;
}
</style>