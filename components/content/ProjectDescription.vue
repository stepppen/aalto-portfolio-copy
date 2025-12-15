<template>
  <div class="glass-card text-animation">
    <p v-if="title" class="card-label">{{ title }}</p>
    <div class="card-content"> 
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped>
.glass-card {
  /* Layout */
  display: flex;
  flex-direction: column; /* Default: Stack (Mobile First approach) */
  gap: 0.5rem;
  height: 100%; /* Stretches to fill grid cell */
  
  /* Visuals */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  
  /* Text defaults */
  color: rgb(255, 255, 255);
  font-weight: 300;
  line-height: 1.6;
}

.card-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  font-weight: 600;
  margin: 0;
  min-width: fit-content;
}

.card-content {
  flex: 1;
}

/* Typography for slot content */
.card-content :deep(p) {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}
.card-content :deep(p:last-child) {
  margin-bottom: 0;
}
.card-content :deep(ul) {
  padding-left: 1.2rem;
  margin: 0.5rem 0;
}

/* Animation */
.text-animation {
  opacity: 0;
  transform: translateY(10px);
  animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.3s;
}

@keyframes fade-in-up {
  to { opacity: 1; transform: translateY(0); }
}

/* DESKTOP LAYOUT (lg and up) */
/* Switch to side-by-side layout only when there is enough room */
@media (min-width: 1024px) {
  .glass-card {
    flex-direction: row; /* Side by side */
    align-items: flex-start;
    gap: 1.5rem;
    padding: 2rem;
  }

  .card-label {
    width: 5rem; /* Fixed width for alignment across multiple cards */
    margin-top: 0.2rem; /* Optical alignment with body text */
  }
}
</style>