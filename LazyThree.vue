<template>
  <div v-if="threeJSLoaded">Three.js has been loaded.</div>
  <div v-else>Three.js is not loaded yet.</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';

const threeJSLoaded = ref(false);

onMounted(() => {
  // Three.js is now imported and available
  threeJSLoaded.value = true;
});

// Expose `threeJSLoaded` ref to the template by returning it
return {
  threeJSLoaded
};
</script>
