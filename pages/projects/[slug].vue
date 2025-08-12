<template>
  <div class="wrapper-container">
    <div class="main-container px-4 min-lg:px-0">
      <Head>
        <Title>{{ project?.title || 'Project' }}</Title>
      </Head>
    <!-- <ContentQuery :path="$route.path" find="one" v-slot="{ data }">
      <ContentRenderer :value="data" />
      
    </ContentQuery> -->
      <div v-if="project">
        <ContentRenderer :value="project" class="overflow-hidden"/>
        <!-- Optionally render a detailed component -->
        <!-- <ProjectDetails :project="project" /> -->
      </div>
      <div v-else>
        <p class="text-white">Project not found.</p>
      </div>
    </div>
  </div>
</template> 

<script setup>
const route = useRoute();

const { data: project } = await useAsyncData('project', () =>
  queryCollection('projects').path(`/projects/${route.params.slug}`).first()
);

// Optional: set SEO meta based on project
useSeoMeta({
  title: project.value?.title,
  description: project.value?.overview || ''
});
</script>

<style scoped>
/* Add custom styles if needed */
</style>