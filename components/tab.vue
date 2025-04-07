<template>
  <div class="toggle-container">
    <div class="tab-toggle">
      <div class="nav-button home-button" :class="{ 'active': currentPath === 'home' }" @click="navigateTo('/')">
          Home
      </div>
      <div class="nav-button about-button" :class="{ 'active': currentPath === 'about' } " @click="navigateTo('/about')">
          About
      </div>
      <div class="active-button" :style="sliderPos"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const currentPath = ref('home')

// Navigation function
const navigateTo = (path) => {
  router.push(path)
}

watch(() => route.path, (newPath) => {
  if (newPath === '/about') {
    currentPath.value = 'about'
  } else {
    currentPath.value = 'home'
  }
}, { immediate: true })

const sliderPos = computed(() => {
  return {
    transform: currentPath.value === 'about' ? 'translateX(100%)' : 'translateX(0)'
  }
})
</script>

<style>
.toggle-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.tab-toggle {
  position: relative;
  display: flex;
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 4px;
  width: 200px;
  height: 40px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-toggle:hover {
  background-color: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  z-index: 1;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  border-radius: 25px;
}

.tab-toggle .nav-button.active {
  color: #111;
}

.nav-button:hover {
  color: rgba(255, 255, 255, 1);
}

/* Individual button hover effects */
.nav-button:not(.active):hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.active-button {
  position: absolute;
  left: 4px;
  top: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background-color: white;
  border-radius: 25px;
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tab-toggle {
  animation: fadeIn 0.5s;
}
</style>