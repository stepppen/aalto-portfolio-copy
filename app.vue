<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
useSeoMeta({
  title: 'Design Portfolio',
  ogTitle: 'Design Portfolio',
  description: 'Interaction Design Portfolio by Stepan Vedunov 2025',
  ogDescription: 'Interaction Design Portfolio by Stepan Vedunov 2025',
})
</script>
<style>
.nuxt-loading-indicator {
  background: linear-gradient(to right, #38b2ac, #1e4dd4) !important;
  height: 3px !important;
  /* Override other styles as needed */
}

/* Change color of the pulsing effect */
.nuxt-loading-indicator:before {
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.7)) !important;
}

/* Change color of the glow effect */
.nuxt-loading-indicator:after {
  box-shadow: 0 0 10px rgba(56, 178, 172, 0.7) !important;
}
</style>