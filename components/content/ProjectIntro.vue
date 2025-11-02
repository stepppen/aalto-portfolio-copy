<template>
  <div class="min-md:mt-12 min-md:mb-24 project-intro">
    <h1 class="mb-4 bigger-text title-animation">{{ props.title }}</h1>
    <div class="min-md:pt-16 intro-content">
      <div class="intro-meta">
        <TagsContainer 
          :tags="tags"
          :should-animate="true"
          delay="0.2s"
          justify="start"
        />
      </div>
      <div class="intro-text text-animation">
        <p class="title">About</p>
        <div class="intro-text-content"> 
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string,
  year: string,
  context: string,
  team?: string,
  roles: string
}

const props = withDefaults(defineProps<Props>(), {
  team: ''
})

const tags = computed(() => [
  { text: props.year, iconName: "mdiCalendar" },
  { text: props.context, iconName: "mdiSchool" },
  { text: props.team, iconName: "mdiAccountMultiple" },
  { text: props.roles, iconName: "mdiPencilRulerOutline" },
])
</script>

<style scoped>
.project-intro {
  gap: 2rem;
  /* Optimize rendering */
  contain: layout style;
}

.intro-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.intro-meta {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.intro-text {
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: start;  
  gap: 6px;
  max-width: 100%;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  border-radius: 1.5rem;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: default;
  will-change: backdrop-filter;
  transform: translate3d(0, 0, 0);
}

.intro-text .title {
  display: inline-block;
  min-width: 4rem;
  margin: 0;
  opacity: 0.5;
  flex-shrink: 0;
}

.intro-text-content {
  flex: 1;
  min-width: 0;
}

.intro-text :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.intro-text :deep(li) {
  margin-bottom: 0.5rem;
  font-family: "Lato", sans-serif;
  color: rgb(255, 255, 255);
  font-weight: 300;
  font-size: 1.1rem;
  line-height: 1.6;
}

.intro-text :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.intro-text :deep(p:last-child) {
  margin-bottom: 0;
}

.title-animation {
  opacity: 0;
  transform: translateY(10px);
  animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 0s;
}

.text-animation {
  opacity: 0;
  transform: translateY(10px);
  animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 0.2s;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .title-animation,
  .text-animation {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 768px) {
  .intro-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .intro-text {
    flex-direction: column;
    max-width: 100%;
    padding: 1rem;
  }
  
  .intro-text .title {
    min-width: auto;
    margin-bottom: 0.5rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .intro-text :deep(li),
  .intro-text :deep(p) {
    font-size: 1rem;
  }
}
</style>