<template>
        <Head>
            <Title>Home</Title>
        </Head>
        <!-- <div>
            <div ref="landingAnimationContainer"></div>
        </div> -->
        <div class="flex inset-0 absolute lg:left-48">
            <div class=" hidden lg:flex flex-col justify-center w-custom-50">
                <transition name="image">
                    <img v-if="hoveredProject" :src="hoveredProject ? hoveredProject.thumb : project.thumb" alt="project img" loading="lazy" class="object-cover min-w-full aspect-[4/3] fade-in">
                </transition>
                <!-- <img :src="project.thumb" alt="project img" loading="lazy" class="object-cover min-w-full aspect-[4/3]"> -->
            </div>  
            <div class="flex flex-col justify-center pl-8">
                <div class="flex flex-col" v-for="p in project.slice(0,5)">
                    <LandingLink :project="p" @mouseover="handleMouseOver(p)" @mouseleave="handleMouseLeave"/>
                </div>
            </div>
        </div>
        <div>
            <P5Animation />
        </div>
</template>

<script setup>
    import P5Animation from '@/components/P5Animation.vue';
    // import LandingAnimation from '../LazyThree.vue';
    import jsonData from './assets/projects/projects.json';
    const project = jsonData;
    const hoveredProject = ref(null);

    // const largeBreakpoint = window.matchMedia("(min-width: 700px)")

    const handleMouseOver = (project) => {
        hoveredProject.value = project;
    };

    const handleMouseLeave = () => {
        hoveredProject.value = null;
    };

    onMounted(() => {

        // const script = document.createElement('script');
        // script.src = '/components/LandingAnimation.vue';
        // document.body.appendChild(script);
        
        project.forEach(p => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = p.thumb;
            document.head.appendChild(link);
        });

        
    });


    
</script>

<style lang="scss" scoped> 
.landing-img{
    width: 220px;
    transition: 0.3s ease;
}
.image-enter-from,
.image-leave-to{
    opacity: 0;
}
.image-enter-to,
.image-leave-from{
    opacity: 1;
}
.image-enter-active{
    transition: opacity 0.5s ease-out;
}

.image-leave-active{
    transition: opacity 0.2s ease-out;
}


.alpha-80{
    opacity: 0.8;
}
.semi-transparent {
  opacity: 0.4; /* Opacity when hovered over */
  transition: 0.3s ease; /* Transition for both entering and leaving hover */
}

.image-enter-from,
.image-leave-to {
  opacity: 0;
}

.image-enter-to,
.image-leave-from {
  opacity: 1;
}

.image-enter-active {
    // transition-delay: 3s;
    transition: opacity 0.1s ease-out;
}

.image-leave-active {
    // transition-delay: 3s;
  transition: opacity 0.2s ease-out;
}
</style>