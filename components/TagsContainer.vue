<template>
      <div class="personal-tags" :class="{ 'animate-tags': shouldAnimate }" :style="{ '--animation-delay': delay, '--justify-content': justify }">
    <BlurryTag 
      v-for="tag in tags" 
      :key="tag.text"
      :text="tag.text"
      :iconName="tag.iconName"
    />
  </div>
</template>

<script setup lang="ts">
interface Tag {
  text: string
  iconName?: string
}

interface Props {
  tags: Tag[]
  shouldAnimate?: boolean
  delay?: string
  justify?: string
}

const props = withDefaults(defineProps<Props>(), {
  shouldAnimate: false,
  delay: '0.2s'
})
</script>

<style scoped>
.personal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  /* padding-top: 2rem; */
  --animation-delay: 0.2s;
}

.animate-tags {
  opacity: 0;
  transform: translateY(10px);
  animation: fade-in-up 0.8s forwards;
  animation-delay: v-bind(delay);
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .personal-tags {
    --justify-content: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .personal-tags {
    gap: 0.5rem;
  }
}
</style>