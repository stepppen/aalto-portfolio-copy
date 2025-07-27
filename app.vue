<template>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </template>
  
  <script setup>
  // Add setup to make it a proper script setup block
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