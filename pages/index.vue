<template>
        <Head>
            <Title>Home</Title>
        </Head>
        <div v-if="isWebsiteLoaded">
            <LandingAnimation v-if="!landingAnimationStarted" @animationComplete="handleAnimationComplete" />
        </div>
        <!-- <div>
            <div ref="landingAnimationContainer"></div>
        </div> -->
        <div class="flex inset-0 absolute lg:left-48">
            <div class=" hidden lg:flex flex-col justify-center w-custom-50">
                <img v-if="hoveredProject" :src="hoveredProject ? hoveredProject.thumb : project.thumb" alt="project img" loading="lazy" class="object-cover min-w-full aspect-[4/3]">
                <!-- <img :src="project.thumb" alt="project img" loading="lazy" class="object-cover min-w-full aspect-[4/3]"> -->
            </div>  
            <div class="flex flex-col justify-center pl-8">
                <div class="flex flex-col" v-for="p in project.slice(0,5)">
                    <LandingLink :project="p" @mouseover="handleMouseOver(p)" @mouseleave="handleMouseLeave"/>
                </div>
            </div>
        </div>
</template>

<script setup>
    // import LandingAnimation from '../LazyThree.vue';
    import jsonData from './assets/projects/projects.json';
    import LandingAnimation from '../components/LandingAnimation.vue';
    const project = jsonData;
    const hoveredProject = ref(null);

    const isWebsiteLoaded = ref(false);
    const landingAnimationStarted = ref(false);

    const handleAnimationComplete = () => {
        landingAnimationStarted.value = true;
    };

    // const largeBreakpoint = window.matchMedia("(min-width: 700px)")

    const handleMouseOver = (project) => {
        hoveredProject.value = project;
    };

    const handleMouseLeave = () => {
        hoveredProject.value = null;
    };


    onMounted(() => {
  // Simulate website loading completion after a delay
  setTimeout(() => {
    isWebsiteLoaded.value = true;
    preloadImages();
  }, 2000); // Adjust the delay as needed
});

const preloadImages = () => {
  project.forEach(p => {
    const img = new Image();
    img.src = p.thumb;
  });
};

// Preload images using link preload with appropriate 'as' attribute
project.forEach(p => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = p.thumb;
  document.head.appendChild(link);
});


    
</script>

<style lang="scss" scoped> 
.landing-img{
    width: 220px;
    transition: 0.3s ease;
}
</style>