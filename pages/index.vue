<template>
    <div>
      <Head>
        <Title>Home</Title>
      </Head>
      <body class="max-md:overflow-hidden">
        <transition name="opacity-p5"> 
            <div v-if="showP5" class="max-md:h-custom-90">
              <div class="max-md:scale-150 max-md:-translate-x-16">
                <P5Animation />
              </div>
            </div>
        </transition>
        <transition name="fade-titles">
          <div v-if="showTitles" class="flex inset-0 absolute lg:left-48 z-40 md:justify-end overflow-hidden">
            <!-- <div class="2xl:w-custom-50">
            </div> -->
              <div class="flex flex-col justify-center 2xl:pr-32 lg:w-custom-40 min-w-96">
                <div v-for="p in project.slice(0,5)" :key="p.id">
                    <LandingLink  :project="p" @mouseover="handleMouseOver(p)" @mouseleave="handleMouseLeave"/>
                </div>
              </div>
          </div>
        </transition>

      </body>
    </div>
  </template>
  
  <script setup>
    import jsonData from './assets/projects/projects.json';
    const project = jsonData;
    const hoveredProject = ref(null);
    let showTitles = ref(false);
    let showP5 = ref(false);
  
    onMounted(() => {
      showP5.value = true;
      setTimeout(() => {
        showTitles.value = true;
        
      }, 300);
      // setTimeout(() => {
        
      // }, 100);
    });
  
    const handleMouseOver = (project) => {
      hoveredProject.value = project;
    };
  
    const handleMouseLeave = () => {
      hoveredProject.value = null;
    };
  </script>
  
  <style lang="scss" scoped>
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
  