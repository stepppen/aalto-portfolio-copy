<template>
    <div class="tab-toggle-container">
      <div class="tab-toggle" :class="{ 'dark-mode': isDarkMode }">
        <div 
          class="tab-option" 
          :class="{ 'active': activeTab === 'home' }"
          @click="navigateTo('/')">
          Home
        </div>
        <div 
          class="tab-option" 
          :class="{ 'active': activeTab === 'about' }"
          @click="navigateTo('/about')">
          About
        </div>
        <div class="tab-slider" :style="sliderPosition"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  const activeTab = ref('home');
  const isDarkMode = ref(true);
  
  // Determine active tab based on current route
  onMounted(() => {
    updateActiveTab();
  });
  
  watch(() => route.path, () => {
    updateActiveTab();
  });
  
  function updateActiveTab() {
    if (route.path === '/about') {
      activeTab.value = 'about';
    } else {
      activeTab.value = 'home';
    }
  }
  
  // Computed property for slider position
  const sliderPosition = computed(() => {
    return {
      transform: activeTab.value === 'about' ? 'translateX(100%)' : 'translateX(0)'
    };
  });
  
  // Navigation function
  function navigateTo(path) {
    router.push(path);
  }
  </script>
  
  <style scoped>
  .tab-toggle-container {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
  }
  
  .tab-toggle {
    position: relative;
    display: flex;
    background-color: rgba(30, 30, 30, 0.3);
    border-radius: 30px;
    padding: 4px;
    width: 200px;
    height: 40px;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;
  }
  
  .tab-option {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100%;
    z-index: 1;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.3s ease;
  }
  
  .tab-option.active {
    color: #000;
  }
  
  .tab-slider {
    position: absolute;
    left: 4px;
    top: 4px;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background-color: white;
    border-radius: 25px;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  
  /* Dark mode styles */
  .tab-toggle.dark-mode {
    background-color: rgba(255, 255, 255, 0.15);
  }
  
  .tab-toggle.dark-mode .tab-option {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .tab-toggle.dark-mode .tab-option.active {
    color: #111;
  }
  
  .tab-toggle.dark-mode .tab-slider {
    background-color: white;
  }
  
  /* Hover effect */
  .tab-option:hover {
    color: rgba(255, 255, 255, 1);
  }
  
  .tab-option.active:hover {
    color: #000;
  }
  
  /* Animation */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .tab-toggle {
    animation: fadeIn 0.5s;
  }
  </style>