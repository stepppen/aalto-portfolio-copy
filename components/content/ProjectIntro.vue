<template>
  <div class="min-md:mt-12 mb-12 project-intro">
    <h1 class="mb-4">{{ props.title }}</h1>
    <div class="min-md:pt-16 intro-content">
      <div class="intro-meta">
        <TagsContainer 
              :tags="tags"
              :should-animate="true"
              delay="0.2s"
              justify="center"
            />
      </div>
      <div class="intro-text">
        <div>
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
  team: Array,
  roles: Array
}

const props = defineProps<Props>()

const tags = computed(() => [
  { text: props.year, emoji: "📅" },
  { text: props.context, emoji: "🎓" },
  { text: props.team, emoji: "👥" },
  { text: props.roles, emoji: "🛠️" },
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
  /* grid-template-columns: 1fr 2fr; */
  gap: 2rem;

}

.intro-meta {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.intro-text{
  display: inline-flex;
  flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(4px);
    border-radius: 2rem;
    padding: 1rem 1.5rem;
    font-size: 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: default;
  justify-content: center;

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

@media (max-width: 768px) {
  .intro-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>