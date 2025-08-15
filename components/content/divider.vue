<template>
  <div class="flex flex-col pt-12" data-aos="fade-up">
    <div class="flex items-baseline">
      <h2 class="inline-block">{{ title }}</h2>
      <div class="h-px bg-white opacity-30 flex-1 ml-4"></div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props{
    title: String
}

defineProps<Props>()
</script>