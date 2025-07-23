<template>
  <div>
    <div v-for="project in projects" :key="project._path">
      {{ project.title }} - {{ project.slug }} - {{ project._path }}
    </div>
    <div v-if="!projects">No projects found</div>
  </div>
</template>

<script setup>
const { data: projects } = await useAsyncData('projects', () =>
  queryCollection('projects').all()
);
console.log('All content:', projects.value);
</script>

