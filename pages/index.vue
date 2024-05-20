<template>
    <div>
      <Head>
        <Title>Home</Title>
      </Head>
      <body class="overflow-hidden">
        <transition name="opacity-p5"> 
            <div v-if="showP5" class="max-md:h-custom-90 overflow-hidden">
              <div>
                <exp />
              </div>
            </div>
        </transition>
        <!-- <transition name="fade-info">
          <div v-if="showInfo" class="flex inset-0 absolute lg:left-24 z-40 md:justify-start overflow-hidden p-4 max-lg:hidden">
              <div class="flex flex-col 2xl:pr-32 lg:w-custom-40 max-w-[50vw]">
                    <div>
                      <p>Stepan Vedunov</p>
                      <p class="opacity-50">stepan@vedunov.com</p>
                    </div>
              </div>
          </div>
        </transition> -->
        <transition name="fade-info">
          <div v-if="showInfo" class="flex inset-0 absolute lg:left-48 z-40 md:justify-end overflow-hidden p-4 max-lg:hidden">
              <div class="flex flex-col 2xl:pr-32 lg:w-[50vw] w-[70vw]">
                    <div>
                      <p>Based in Zurich, CH</p>
                      <p class="opacity-50">Design Portfolio 2024</p>
                    </div>
              </div>
          </div>
        </transition>
        <transition name="fade-titles">
          <div v-if="showTitles" id="typewriter" class="flex inset-0 absolute lg:left-32 z-40 justify-end  overflow-hidden p-4">
              <div class="flex flex-col justify-center 2xl:pr-32 lg:pr-16 lg:w-[50vw] w-[70vw]">
                <div class="justify-self-center">
                  <h1 class="max-md:text-right" >Designing interactions <br>for the <em>digital</em> and <br> <em>physical</em> worlds.</h1>
                </div>
              </div>
          </div>
        </transition>

        <div class="h-64"></div>
        <div class="flex">
          <div class="hidden lg:inline-block lg:w-1/4"></div>
          <div class="flex flex-col lg:w-3/4 justify-end overflow-hidden p-4">
            <div class="">
              <h2>Recent Work</h2>
            </div>
            <div class="">
              <div class='xl:w-full adaptive-grid max-md:grid lg:pr-[20px]'>
                <div v-for="p in project.slice(0,5)" :key="p.id">
                    <ProjectCard :project="p"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="flex flex-col inset-0 absolute lg:left-48 z-40 md:justify-center overflow-hidden">
          <h2>Stepan Vedunov</h2>
          <h3 class="opacity-50">Design Portfolio 24</h3>
        </div> -->
        <!-- <transition name="fade-titles">
          <div v-if="showTitles" class="flex inset-0 absolute lg:left-48 z-40 md:justify-end overflow-hidden">
              <div class="flex flex-col justify-center 2xl:pr-32 lg:w-custom-40 min-w-96">
                <div v-for="p in project.slice(0,5)" :key="p.id">
                    <LandingLink  :project="p" @mouseover="handleMouseOver(p)" @mouseleave="handleMouseLeave"/>
                </div>
              </div>
          </div>
        </transition> -->

      </body>
    </div>
  </template>
  
  <script setup>
import jsonData from './assets/projects/projects.json';
const project = jsonData;
const hoveredProject = ref(null);
let showTitles = ref(false);
let showInfo = ref(false);
let showP5 = ref(false);

onMounted(() => {
  showP5.value = true;
  setTimeout(() => {
    showInfo.value = true;
    showTitles.value = true;
    startTypewriterAnimation();
  }, 300);
});

const handleMouseOver = (project) => {
  hoveredProject.value = project;
};

const handleMouseLeave = () => {
  hoveredProject.value = null;
};

const startTypewriterAnimation = () => {
  const textElement = document.getElementById('typewriter');
  console.log(textElement)
  if (textElement) {
    const text = textElement.textContent.trim();
    let character = 0;
    

    const typeWriter = () => {
      if (character < text.length) {
        textElement.textContent += text.charAt(character);
        character++;
        setTimeout(typeWriter, 150);
        
      }
    };

    typeWriter();
  }
}
  </script>
  
  <style lang="scss" scoped>

@media (max-width: 1500px) {
  .adaptive-grid{
        column-count: 1;
        column-gap: 20px;
    }
}
    .adaptive-grid{
        column-count: 2;
        column-gap: 20px;
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


    .fade-info-enter-active {
      transition: all 0.3s ease-out;
    }
    .fade-info-enter-to {
      opacity: 1;
    }
  
    .fade-info-enter-from {
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
  