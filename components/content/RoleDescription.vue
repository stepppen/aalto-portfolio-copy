<template>
  <div class="info-tag w-full" data-aos="fade-up" :class="{'resultContainer': isResult}">
    <p v-if="title" class="title">{{ title }}</p>
    <div class="text-content">
      <slot></slot>
    </div>
  </div>
</template>


<script setup lang="ts">

interface Props {
    title?: string
}
const props = defineProps<Props>()

const isResult = computed(() => { 
    return props.title === "Result"
})
</script>

<style scoped>
.info-tag{
    display: inline-flex;
    /* gap: 6px; */
    margin: 6px 0;

    max-width: 100%;
    height: auto;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(4px);
    border-radius: 1rem;
    padding: 0.6rem 1rem;
    /* border: 1px solid rgba(255, 255, 255, 0.08); */
    cursor: default;
}
.resultContainer {
    background-color: rgba(120, 126, 206, 0.2);
    box-shadow: 0 0 20px rgba(198, 206, 255, 0.1);
}
.text-content {
    flex: 1;
    min-width: 0;
}
.info-tag .title {
  display: inline-block;
  width: auto;
  min-width: 4rem;
  margin-right: 0.5rem;
  opacity: 0.6;
  white-space: nowrap;
}

@media (max-width: 768px) {
    .info-tag{
        padding: 0.6rem rem;
        flex-direction: column;
        max-width: 100%;
    }
}
</style>