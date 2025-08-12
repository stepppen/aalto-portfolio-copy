<template>
  <figure class="content-image" data-aos="fade-up">
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="width || 1200"
      format="webp"
      loading="lazy"
      class="image rounded-2xl object-cover"
    />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  caption: String,
  width: Number
});
</script>

<style scoped>
.content-image {
  margin: 1rem 0;
}

.image {
  width: 100%;
  height: 100%;
}

figcaption {
  margin-top: 0.5rem;
  text-align: center;
  color: #ffffff;
  opacity: 0.5;
  font-size: 0.9rem;
}
</style>