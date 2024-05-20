<template>
    <div>
        <Head>
        <Title>Archive</Title>
    </Head>
    <!-- <div class="w-1/4"></div> -->
    <div>
        <div class='xl:w-full adaptive-grid p-4'>
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
.adaptive-grid{
    column-count: 2;
    column-gap: 20px;
}

</style>