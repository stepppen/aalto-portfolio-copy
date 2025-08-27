<template>
  <div class="wrapper-container">
    <div class="main-container">
      <Head>
        <Title>Home</Title>
      </Head>
  
      <!-- <div class="hero-placeholder"></div> -->
  
      <transition name="fade-titles">
        <div v-if="showTitles" id="typewriter" class="flex lg:pl-8 lg:justify-start overflow-hidden p-4 h-min">
          <div class="flex flex-col justify-center max-lg:text-center w-full lg:py-32">
            <div class="justify-self-center">
              <h1 class="word text-stone-300 title-font max-md:text-center"> I build human-centred interactions, environments, and experiences in digital and physical form.</h1>
            </div>
            <TagsContainer 
              :tags="tags"
              :should-animate="true"
              delay="0.2s"
              :justify="isMobile ? 'center' : 'flex-start'"
            />
          </div>
        </div>
      </transition>
  
      <div v-if="showProjects">
        <div class="overflow-hidden p-4">
          <div>
            <div v-if="projects?.length" class="xl:w-full adaptive-grid-masonry max-md:grid lg:pr-[20px]">
              <ProjectCard
                v-for="p in projects"
                :key="p.slug"
                :project="p"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
const showTitles = ref(false);
const showInfo = ref(false);
const showProjects = ref(false);

const tags = [
  {text: "Stepan Vedunov", iconName: "mdiAccount" },
  {text: "Zurich, Switzerland", iconName: "mdiMapMarkerRadius" },
  {text: "Interaction Design", iconName: "mdiLightningBolt"},
]

const isMobile = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 1024
}

const { data: projects } = await useAsyncData('projects', () =>
  queryCollection('projects').all()
);

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  setTimeout(() => {
    showInfo.value = true;
    showTitles.value = true;
    showProjects.value = true;
  }, 300);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})

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
.hero-placeholder {
  height: 280px; /* Adjust based on your hero content height on mobile */
  display: none; /* Hidden by default */
}

/* Only show placeholder on mobile */
@media (max-width: 1024px) {
  .hero-placeholder {
    display: block;
  }
}

.fade-projects-enter-active {
  transition: opacity 0.6s ease-out;
}
.fade-projects-enter-from {
  opacity: 0;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* Base styles for text reveal */
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

/* Base styles for digital and physical words */
.digital-word, .physical-word {
  position: relative;
  font-style: italic;

  i {
    font-style: italic;
    position: relative;
    z-index: 2;
  }
  
  /* Enhanced underline base styling */
  .word-fx {
    position: absolute;
    bottom: -3px; /* Position slightly lower */
    left: 0;
    width: 100%;
    height: 3px; /* Increased from 2px */
    transform-origin: left;
    opacity: 0.95; /* Added opacity for better visibility */
    border-radius: 1px; /* Slightly rounded edges */
  }
}

/* Digital word enhanced styling */
.digital-word {
  color: rgb(100, 198, 255);
  text-shadow: 0 0 8px rgba(100, 255, 218, 0.6); /* Increased shadow intensity */
  
  .digital-fx {
    background: linear-gradient(90deg, rgb(100, 214, 255), rgb(0, 143, 191));
    box-shadow: 0 0 12px rgba(100, 255, 218, 1); /* Stronger glow */
    animation: expand-line 3s ease-in-out infinite;
    transform-origin: left;
    transform: scaleX(1);
  }
}

/* Physical word enhanced styling */
.physical-word {
  color: rgb(255, 128, 145);
  text-shadow: 0 0 8px rgba(255, 158, 128, 0.6); /* Increased shadow intensity */
  
  .physical-fx {
    background: linear-gradient(90deg, rgb(255, 128, 153), rgb(255, 64, 83));
    box-shadow: 0 0 12px rgba(255, 158, 128, 1); /* Stronger glow */
    animation: expand-line 3.5s ease-in-out infinite;
    transform-origin: left;
    transform: scaleX(1);
  }
}

/* Improved animation for more visible expansion/contraction */
@keyframes expand-line {
  0% { transform: scaleX(0.6); } /* Start more visible */
  50% { transform: scaleX(1); } /* Full width */
  100% { transform: scaleX(0.6); } /* Return to starting size */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .digital-word, .physical-word {
    .word-fx {
      height: 2.5px; /* Slightly smaller on mobile */
      bottom: -2px; /* Adjust position on mobile */
    }
  }
  
  @keyframes expand-line {
    0% { transform: scaleX(0.7); } /* Keep more visible on mobile */
    50% { transform: scaleX(1); }
    100% { transform: scaleX(0.7); }
  }
}

.custom-italics {
  font-style: italic;
}

/* FIXED: Safari-friendly adaptive grid */
.adaptive-grid {
  /* Use CSS Grid instead of columns for better Safari compatibility */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in-up 0.8s forwards;
  animation-delay: 0.8s;
  /* Ensure proper stacking context */
  position: relative;
  z-index: 1;
}

/* Responsive grid adjustments */
@media (max-width: 1500px) {
  .adaptive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .adaptive-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

/* Alternative: If you prefer masonry, use this Safari-optimized version */
.adaptive-grid-masonry {
  column-count: 3;
  -moz-column-count: 3;
  column-gap: 20px;
  width: 100%;
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in-up 0.8s forwards;
  animation-delay: 0.8s;
  /* Safari optimizations for masonry */
  -webkit-column-break-inside: avoid;
  break-inside: avoid;
  /* Force new stacking context */
  position: relative;
  z-index: 1;
  /* Prevent transform issues in Safari */
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}
@supports (hanging-punctuation: first) and (font: -apple-system-body) and (-webkit-appearance: none) {
  /* Safari-only styles go here */
  .adaptive-grid-masonry {
    column-count: 2 !important;
    column-gap: 20px;
  }
}
// @media (max-width: 1500px) {
//   .adaptive-grid-masonry {
//     column-count: 3;
//     -moz-column-count: 3;
//     column-gap: 20px;
//   }
// }

@media (max-width: 768px) {
  .adaptive-grid-masonry {
    column-count: 1;
    column-gap: 0;
  }
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
    position: absolute !important; /* Keep it absolute on mobile */
    top: 0;
    left: 0;
    right: 0;
    height: auto;
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