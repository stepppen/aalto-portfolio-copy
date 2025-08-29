<template>
  <div class="toggle-container">
    <div class="tab-toggle" :class="{ 'projects-mode': currentPath === 'projects' }">
      <!-- Home -->
      <div
        class="nav-button home-button"
        :class="{ active: currentPath === 'home' }"
        @click="navigateTo('/')"
      >
        Home
      </div>

      <!-- Projects (smooth transition) -->
      <div
        class="nav-button projects-button"
        :class="{ 
          active: currentPath === 'projects',
          visible: currentPath === 'projects'
        }"
        @click="navigateTo('/projects')"
      >
        Projects
      </div>

      <!-- About -->
      <div
        class="nav-button about-button"
        :class="{ active: currentPath === 'about' }"
        @click="navigateTo('/about')"
      >
        About
      </div>

      <!-- Active indicator -->
      <div class="active-button" :style="sliderPos"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const currentPath = ref("home")

// Navigation function
const navigateTo = (path) => {
  router.push(path)
}

// Compute active indicator size & position with smooth transitions
const sliderPos = computed(() => {
  const isProjectsVisible = currentPath.value === 'projects'
  
  let visibleIndex = 0
  let tabCount = 2 // home + about
  
  if (isProjectsVisible) {
    tabCount = 3 // home + projects + about
    
    if (currentPath.value === 'home') visibleIndex = 0
    else if (currentPath.value === 'projects') visibleIndex = 1
    else if (currentPath.value === 'about') visibleIndex = 2
  } else {
    // Only home and about visible
    if (currentPath.value === 'home') visibleIndex = 0
    else if (currentPath.value === 'about') visibleIndex = 1
  }

  return {
    width: `calc(${100 / tabCount}% - 4px)`,
    transform: `translateX(${visibleIndex * 100}%)`,
  }
})

// Watch the route and update active tab
watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/about") {
      currentPath.value = "about"
    } else if (newPath.startsWith("/projects/")) {
      currentPath.value = "projects"
    } else {
      currentPath.value = "home"
    }
  },
  { immediate: true }
)
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
  max-width: 250px;
  padding: 4px;
  height: 40px;
  cursor: pointer;
  user-select: none;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  /* Smooth width transition when projects appears/disappears */
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.tab-toggle:hover {
  background-color: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  z-index: 1;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 25px;
  white-space: nowrap;
  
  /* Smooth transitions for all properties */
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* Default state for home and about */
  flex: 1;
  opacity: 1;
  transform: scaleX(1);
}

/* Projects button - hidden by default */
.nav-button.projects-button {
  flex: 0;
  padding: 0;
  opacity: 0;
  transform: scaleX(0);
  overflow: hidden;
}

/* Projects button - visible state */
.nav-button.projects-button.visible {
  flex: 1;
  padding: 0 1rem;
  opacity: 1;
  transform: scaleX(1);
}

/* Active state */
.tab-toggle .nav-button.active {
  color: #111;
  font-weight: 600;
}

.nav-button:hover {
  color: rgba(255, 255, 255, 1);
}

.nav-button:not(.active):hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Enhanced active indicator with smoother animation */
.active-button {
  position: absolute;
  left: 4px;
  top: 4px;
  height: calc(100% - 8px);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 25px;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.1);
  
  /* Ultra smooth sliding with perfect timing */
  transition: 
    transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Container scaling when projects mode is active */
.tab-toggle.projects-mode {
  min-width: 140px;
  max-width: 400px;
}

/* Subtle entrance animation - much smoother */
.tab-toggle {
  animation: smoothFadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes smoothFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Enhanced responsive behavior */
@media (max-width: 768px) {
  .nav-button {
    padding: 0 1.5rem;
    font-size: 13px;
  }
  
  .tab-toggle.projects-mode {
    min-width: 300px;
    max-width: 400px;
  }
}
</style>