<template>
        <Head>
            <Title>Home</Title>
        </Head>
        <div>
            <LandingAnimation />
        </div>
        <div class="flex inset-0 absolute lg:left-48">
            <div class=" hidden lg:flex flex-col justify-center w-custom-50">
                <img v-if="hoveredProject" :src="hoveredProject ? hoveredProject.thumb : project.thumb" alt="project img" loading="lazy" class="object-cover min-w-full aspect-[4/3]">
            </div>  
            <div class="flex flex-col justify-center pl-8">
                <div class="flex flex-col" v-for="p in project.slice(0,5)">
                    <LandingLink :project="p" @mouseover="handleMouseOver(p)" @mouseleave="handleMouseLeave"/>
                </div>
            </div>
        </div>
</template>

<script setup>
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
    
</script>

<style lang="scss" scoped> 
.landing-img{
    width: 220px;
    transition: 0.3s ease;
}
</style>