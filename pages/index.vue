<template>
  <div class="wrapper-container">
    <div class="main-container">
      <Head>
        <Title>Home</Title>
      </Head>
  
      <div v-if="showTitles" class="hero-spacer"></div>
      
      <transition name="fade-titles">
        <div
          v-if="showTitles"
          id="typewriter"
          ref="typewriter"
          class="flex lg:pl-8 lg:justify-start overflow-hidden p-4 h-min max-lg:h-80 hero-block"
          :style="{
            '--hero-blur': '0px',
            '--hero-opacity': '1',
            '--hero-translate': '0px'
          }"
        >
          <div class="flex flex-col justify-center items-center max-lg:text-center w-full lg:py-32">
            <div class="justify-self-center">
              <h1 class="word text-stone-300 title-font text-center my-0 py-0"> Stepan Vedunov </h1>
              <div class="flex gap-2 content-center items-center justify-center opacity-70 my-0 py-0 ">
                <p class="text-center">Interaction Designer</p>
                <div class="rounded-full bg-white opacity-100 bullet"></div>
                <p class="text-center">Zurich, CH</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
  
      <div class="projects-container" :class="{ 'projects-loading': !showProjects }">
        <div v-if="showProjects" ref="projectsRoot">
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

  </div>
</template>

<script setup>
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

const typewriter = ref(null);
const projectsRoot = ref(null);
let ticking = false;

function clamp(v, a = 0, b = 1) { 
  return Math.min(Math.max(v, a), b); 
}

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateHeroBlur();
      ticking = false;
    });
    ticking = true;
  }
}

function updateHeroBlur() {
  if (!typewriter.value || !projectsRoot.value) return;
  
  const projRect = projectsRoot.value.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const vw = window.innerWidth || document.documentElement.clientWidth;

  let start, end;
  
  if (vw <= 768) {
    start = vh * 0.4;
    end = vh * 0.2;
  } else if (vw <= 1024) {
    start = vh * 0.3;
    end = vh * 0.1;
  } else if (vw <= 1440) {
    start = vh * 0.5;
    end = vh * 0.3;
  } else {
    start = vh * 0.35;
    end = vh * 0.15;
  }

  const t = clamp((start - projRect.top) / (start - end), 0, 1);
  const blur = (t * 10).toFixed(2);
  const opacity = (1 - t * 0.7).toFixed(2);

  typewriter.value.style.setProperty('--hero-blur', `${blur}px`);
  typewriter.value.style.setProperty('--hero-opacity', `${opacity}`);
}

onMounted(() => {
  setTimeout(async () => {
    showInfo.value = true;
    showTitles.value = true;
    showProjects.value = true;

    await nextTick();

    if (typewriter.value?.style) {
      typewriter.value.style.setProperty('--hero-blur', '0px');
      typewriter.value.style.setProperty('--hero-opacity', '1');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeroBlur(); 
  }, 300);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});

</script>

<style lang="scss" scoped>
.projects-container {
  min-height: 60vh;
  position: relative;
}

.projects-container.projects-loading {
  min-height: 80vh;
}

.hero-spacer {
  height: 250px;
  width: 100%;
}

@media (min-width: 768px) and (max-width: 1023px) {
  .hero-spacer {
    height: 320px; 
  }
}

@media (min-width: 1024px) and (max-width: 1439px) {
  .hero-spacer {
    height: 350px;
  }
}

@media (min-width: 1440px) {
  .hero-spacer {
    height: 380px; 
  }
}

.hero-placeholder {
  height: 280px;
  display: none;
}

@media (max-width: 1024px) {
  .hero-placeholder {
    display: block;
  }
}

@keyframes title {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fade-projects-enter-active {
  transition: opacity 0.6s ease-out;
}
.fade-projects-enter-from {
  opacity: 0;
}

.hero-block {
  position: fixed;
  top: 8vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 1100px;
  z-index: 10;

  transition: filter 300ms ease, opacity 300ms ease;
  filter: blur(var(--hero-blur, 0px));
  opacity: var(--hero-opacity, 1);
  will-change: filter, opacity;
  pointer-events: none; 
}

.hero-block h1,
.hero-block p {
  pointer-events: auto;
}

@media (max-width: 768px) {
  .hero-block {
    top: 4vh;
  }
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
  height: 100vh;
  pointer-events: none;
}

.hero-content h1, 
.hero-content .word {
  pointer-events: auto;
}

.bullet {
  width: 5px;
  height: 5px;
  transform: translateY(2px);
}

.text-reveal {
  position: relative;
  line-height: 1.4;
  
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(220, 220, 255, 1) 50%,
    rgba(255, 255, 255, 0.85) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  
  mix-blend-mode: difference;
  
  text-shadow: 
    0 0 3px rgba(255, 255, 255, 0.1),
    0 0 15px rgba(255, 255, 255, 0.05);
    
  .line-reveal {
    display: block;
    overflow: hidden;
    
    &:not(:last-child) {
      margin-bottom: 0.3rem;
    }
  }
  
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
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 3px;
    transform-origin: left;
    opacity: 0.95;
    border-radius: 1px;
  }
}

.digital-word {
  color: rgb(100, 198, 255);
  text-shadow: 0 0 8px rgba(100, 255, 218, 0.6);
  
  .digital-fx {
    background: linear-gradient(90deg, rgb(100, 214, 255), rgb(0, 143, 191));
    box-shadow: 0 0 12px rgba(100, 255, 218, 1);
    animation: expand-line 3s ease-in-out infinite;
    transform-origin: left;
    transform: scaleX(1);
  }
}

.physical-word {
  color: rgb(255, 128, 145);
  text-shadow: 0 0 8px rgba(255, 158, 128, 0.6);
  
  .physical-fx {
    background: linear-gradient(90deg, rgb(255, 128, 153), rgb(255, 64, 83));
    box-shadow: 0 0 12px rgba(255, 158, 128, 1);
    animation: expand-line 3.5s ease-in-out infinite;
    transform-origin: left;
    transform: scaleX(1);
  }
}

@keyframes expand-line {
  0% { transform: scaleX(0.6); }
  50% { transform: scaleX(1); }
  100% { transform: scaleX(0.6); }
}

@media (max-width: 768px) {
  .word {
    font-size: 1.7rem;
  }
  .digital-word, .physical-word {
    .word-fx {
      height: 2.5px;
      bottom: -2px;
    }
  }
  
  @keyframes expand-line {
    0% { transform: scaleX(0.7); }
    50% { transform: scaleX(1); }
    100% { transform: scaleX(0.7); }
  }
}

.custom-italics {
  font-style: italic;
}

.adaptive-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in-up 0.8s forwards;
  animation-delay: 0.8s;
  position: relative;
  z-index: 20;
}

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

.adaptive-grid-masonry {
  column-count: 3;
  -moz-column-count: 3;
  column-gap: 20px;
  width: 100%;
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in-up 0.8s forwards;
  animation-delay: 0.8s;
  -webkit-column-break-inside: avoid;
  break-inside: avoid;
  position: relative;
  z-index: 20; 
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

@supports (hanging-punctuation: first) and (font: -apple-system-body) and (-webkit-appearance: none) {
  .adaptive-grid-masonry {
    column-count: 2 !important;
    column-gap: 20px;
  }
}

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

@media (max-width: 1024px) {
  .hero-content {
    position: absolute !important;
    top: 0;
    left: 0;
    right: 0;
    height: auto;
  }
  .hero-block {
    position: fixed;
    top: 4vh;
  }
  .hero-spacer {
    display: block;
  }
}

@media (max-width: 768px) {
  .text-reveal {
    font-size: 1.8rem;
  }
}
</style>