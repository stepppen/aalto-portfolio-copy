<template>
    <div class="wrapper-container">
        <div class="main-container max-lg:px-4">
            <div> 
                <Head>
                    <Title>{{ project.title }}</Title>
                </Head>

                <ProjectDetails :project="project"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import jsonData from '~/assets/projects/projects.json';
// import { useRoute, definePageMeta} from 'vue-router';

const route = useRoute();
const id = parseInt(route.params.id);
console.log(id);
console.log(jsonData);

const project = jsonData.find(item => item.id === id);
console.log(project)

if (!project) {
    throw createError({statusCode: 404, statusMessage: 'Project not found', fatal: true})
}

// definePageMeta({
//     layout: 'default'
// })
</script>

<style lang="scss" scoped>

</style>