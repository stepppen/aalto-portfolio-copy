<template>
  <div class="wrapper-container">
    <div class="main-container px-4 min-lg:px-0">
      <Head>
        <Title>{{ project?.title || 'Project' }}</Title>
      </Head>
      <div v-if="project">
        <ContentRenderer :value="project" class="overflow-hidden"/>
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

useSeoMeta({
  title: project.value?.title,
  description: project.value?.oneLiner || 'Portfolio Project Description',
  ogTitle: project.value?.title,
  ogDescription: project.value?.oneLiner || 'Portfolio Project Description',

});
</script>
