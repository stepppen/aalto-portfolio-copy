<template>
  <div class="page-wrapper">
    <BackgroundGradient />
    <div class="page-container">
      <transition name="slide-fade">
        <header class="dynamic-header fixed top-0 left-0 right-0 z-50 overflow-hidden" v-if="showHeader">
          <nav class="dynamic-nav">
            <keep-alive>
              <NavTab key="persistent-tab" />
            </keep-alive>
          </nav>
        </header>
      </transition>
      <main class="main-content">
        <slot />
      </main>
      <transition name="slide-fade">
        <Footer v-if="showFooter" />
      </transition>
    </div>
  </div>
</template>

<script setup>
let showHeader = ref(false);
let showFooter = ref(false);

onMounted(() => {
  setTimeout(() => {
    showHeader.value = true;
  }, 100);
  
  setTimeout(() => {
    showFooter.value = true;
  }, 500);
});
</script>

<style>
:root {
  --header-height: 80px; 
}

.page-wrapper {
  position: relative;
  min-height: 100vh;
}

.page-container {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow: hidden;
  padding-top: var(--header-height);
}

@media (min-width: 1024px) {
  .main-content {
    padding-top: 8rem;
  }
}

.border-white {
  border-radius: 5px;
}
.border-white:hover {
  border: 1px solid rgb(255, 255, 255);
  transition: 0.2s ease-in-out;
}
.border-white:active {
  border: 1px solid rgb(240, 0, 0); 
}
.slow-transition {
  transition: 0.2s ease-in-out;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s ease-out;
}

.slide-fade-enter-to, .slide-fade-leave-from {
  opacity: 1;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  /* backdrop-filter: blur(4px); */
  opacity: 0;
}

.content {
  position: relative;
  z-index: 10;
}
</style>