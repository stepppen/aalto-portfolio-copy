<template>
  <div class="min-md:mt-12 mb-12 project-intro">
    <h1 class="mb-4 title-animation">{{ props.title }}</h1>
    <div class="min-md:pt-16 intro-content">
      <div class="intro-meta">
        <TagsContainer 
          :tags="tags"
          :should-animate="true"
          delay="0.2s"
          justify="center"
        />
      </div>
      <div class="intro-text text-animation">
        <p class="title">About</p>
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

interface Props {
  title: string,
  year: string,
  context: string,
  team: string,
  roles: string
}
const props = defineProps<Props>()

const tags = computed(() => [
  { text: props.year, iconName: "mdiCalendar" },
  { text: props.context, iconName: "mdiSchool" },
  { text: props.team, iconName: "mdiAccountMultiple" },
  { text: props.roles, iconName: "mdiPencilRulerOutline" },
])

onMounted(() => {
  console.log("Year:", props.year)
  console.log("Context:", props.context)
  console.log("Team:", props.team)
  console.log("Roles:", props.roles)
})
</script>

<style scoped>
.project-intro {
  gap: 2rem;
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
}

.intro-text .title {
  display: inline-block;
  min-width: 4rem;
  margin: 0;
  opacity: 0.5;
}

@media (max-width: 768px) {
    .intro-text{
        flex-direction: column;
        max-width: 100%;
    }
}

.meta-item h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #666;
}

.meta-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Title Animation */
.title-animation {
  opacity: 0;
  transform: translateY(10px);
  animation: fade-in-up 0.8s forwards;
  animation-delay: 0s;
}

/* Text Animation */
.text-animation {
  opacity: 0;
  transform: translateY(10px);
  animation: fade-in-up 0.8s forwards;
  animation-delay: 0.4s;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .intro-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>