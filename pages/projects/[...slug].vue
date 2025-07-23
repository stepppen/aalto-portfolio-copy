<template>
  <div class="wrapper-container">
    <div class="main-container max-lg:px-4">
      <Head>
        <Title>{{ data?.title || 'Project' }}</Title>
      </Head>
    <!-- <ContentQuery :path="$route.path" find="one" v-slot="{ data }">
      <ContentRenderer :value="data" />
      
    </ContentQuery> -->
      <div v-if="data">
        <ContentRenderer :value="data" />
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

const { data } = await useAsyncData('project', () =>
  queryCollection('projects').path(`/projects/${route.params.slug}`).first()
);

// Optional: set SEO meta based on project
useSeoMeta({
  title: data.value?.title,
  description: data.value?.overview || ''
});
</script>

<style scoped>
/* Add custom styles if needed */
</style>