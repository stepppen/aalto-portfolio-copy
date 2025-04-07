<template>
  <div class="main-container">
    <Head>
      <Title>Home</Title>
    </Head>
    
    <transition name="fade-titles">
      <div v-if="showTitles" id="typewriter" class="flex lg:pl-8 z-40 justify-start overflow-hidden p-4 fixed hero-content">
        <div class="flex flex-col justify-center 2xl:pl-32 max-lg:text-center w-full">
          <div class="justify-self-center">
            <h1 class="text-reveal">
              <span class="line-reveal">
                <span class="word">Designing</span>
                <span class="word">interactions</span> 
              </span>
              <span class="line-reveal">
                <span class="word">in</span>
                <span class="word digital-word">
                  <i>digital</i>
                  <span class="word-fx digital-fx"></span>
                </span>
                <span class="word">space</span>
                <span class="word">and</span>
              </span>
              <span class="line-reveal">
                <span class="word physical-word">
                  <i>physical</i>
                  <span class="word-fx physical-fx"></span>
                </span>
                <span class="word">form.</span>
              </span>
            </h1>
          </div>
          <div class="personal-tags">
            <span class="info-tag">Stepan Vedunov</span>
            <span class="info-tag location">Zurich, Switzerland</span>
            <span class="info-tag focus">Interaction Design</span>
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

/* Updated styles for non-clickable tags */
.personal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 2.5rem;
  opacity: 0;
  transform: translateY(10px);
  animation: fade-in-up 0.8s forwards;
  animation-delay: 1.2s;
}

.info-tag {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);  /* Slightly more subtle background */
  backdrop-filter: blur(4px);
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: default;  /* Explicitly show this is not clickable */
  
  /* Remove hover effects that made them look clickable */
  
  &.location {
    &::before {
      content: "📍"; /* Location icon */
      margin-right: 0.4rem;
      font-size: 0.9rem;
    }
  }
  
  &.focus {
    
    &::before {
      content: "⚡"; /* Focus/specialty icon */
      margin-right: 0.4rem;
      font-size: 0.9rem;
    }
  }
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 1064px) {
  .personal-tags {
    padding-top: 2rem;
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .personal-tags {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .info-tag {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}


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

.digital-word, .physical-word {
  position: relative;
  font-style: italic;

  i {
    font-style: italic;
    position: relative;
    z-index: 2;
  }
  
  .word-fx {
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    transform-origin: left;
  }
}

/* Digital word always-on animations and styling */
.digital-word {
  color:rgb(100, 198, 255);
  text-shadow: 0 0 8px rgba(100, 255, 218, 0.3);
  animation: float-digital 4s ease-in-out infinite;
  
  .digital-fx {
    background: linear-gradient(90deg,rgb(100, 214, 255),rgb(0, 143, 191));
    box-shadow: 0 0 8px rgba(100, 255, 218, 0.5);
    animation: expand-line 3s ease-in-out infinite;
    transform: scaleX(1);
  }
  
  i {
    animation: pulse-digital 3s infinite;
  }
}

/* Physical word always-on animations and styling */
.physical-word {
  color:rgb(255, 128, 145);
  text-shadow: 0 0 8px rgba(255, 158, 128, 0.3);
  animation: float-physical 4.5s ease-in-out infinite;
  
  .physical-fx {
    background: linear-gradient(90deg,rgb(255, 128, 153),rgb(255, 64, 83));
    box-shadow: 0 0 8px rgba(255, 158, 128, 0.5);
    animation: expand-line 3.5s ease-in-out infinite;
    transform: scaleX(1);
  }
  
  i {
    animation: pulse-physical 3.5s infinite;
  }
}

/* Animation keyframes */
@keyframes pulse-digital {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes pulse-physical {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes float-digital {
  0% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
}

@keyframes float-physical {
  0% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0); }
}



// Your existing styles...
@media (max-width: 1500px) {
  .adaptive-grid {
    column-count: 1;
    column-gap: 20px;
  }
}

.custom-italics {
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

/* Add responsive adjustments for smaller screens */
@media (max-width: 1024px) {
  .hero-content {
    position: relative !important;
    height: auto;
    padding-top: 2rem;
    padding-bottom: 1rem;
  }
  
  .word {
    margin-right: 0.8rem !important;
  }
}

@media (max-width: 768px) {
  .text-reveal {
    font-size: 1.8rem;
  }
}
</style>