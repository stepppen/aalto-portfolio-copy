<template>
  <div class="frame-wrapper">
    <NuxtImg
      :src="resolvedSrc"
      :alt="alt"
      class="frame-image"
      width="1200"
      format="webp"
      loading="lazy"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  }
});

// Compute the resolved source path
const resolvedSrc = computed(() => {
  if (!props.src) return '';
  // Remove leading # if present (from MDC syntax)
  const cleanSrc = props.src.replace(/^#/, '');
  // Remove quotes if present
  return cleanSrc.replace(/['"]/g, '');
});
</script>