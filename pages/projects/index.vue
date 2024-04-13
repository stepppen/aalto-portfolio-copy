<template>
    <div>
        <Head>
        <Title>Archive</Title>
    </Head>
    <!-- <div class="w-1/4"></div> -->
    <div>
        <div class='xl:w-full grid lg:grid-cols-3 2xl:grid-cols-4 gap-4 lg:p-4 px-0'>
            <div v-for="p in project">
                <ProjectCard :project="p"/>
            </div>
        </div>
    </div>
    </div>

</template>

<script setup>
import jsonData from './assets/projects/projects.json';

    const project = jsonData;
    console.log(project.title);

    useHead({
        title: 'Projects',
        meta: [
            {name: 'description', content: 'Vedunov Projects'}
        ]
    })
</script>

<style lang="scss" scoped>

</style>