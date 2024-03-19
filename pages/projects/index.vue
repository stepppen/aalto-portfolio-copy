<template>
    <div class="w-1/4"></div>
    <div>
        <div class='xl:w-full w-custom-80 grid grid-cols-3 xl:grid-cols-4 gap-4'>
            <div v-for="p in project">
                <ProjectCard :project="p"/>
            </div>
        </div>
    </div>
</template>

<script setup>
// import { ProjectCard } from '#build/components';
import jsonData from './assets/projects/projects.json';

    const project = jsonData;
    console.log(project.title);
    // console.log(project[0].id)

    useHead({
        title: 'Projects',
        meta: [
            {name: 'description', content: 'Vedunov Projects'}
        ]
    })
</script>

<style lang="scss" scoped>

</style>