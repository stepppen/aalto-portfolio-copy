<template>
    <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Loading...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const isLoading = ref(true);
const nuxtApp = useNuxtApp();

onMounted(() => {
    // Hide initial loading after a short delay
    setTimeout(() => {
        isLoading.value = false;
    }, 500);
    
    // Listen to route changes to show/hide loader
    nuxtApp.hook('page:start', () => {
        isLoading.value = true;
    });
    
    nuxtApp.hook('page:finish', () => {
        setTimeout(() => {
            isLoading.value = false;
        }, 200); // Small delay for smoother transitions
    });
});
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

p {
    color: #fff;
    font-size: 16px;
    letter-spacing: 1px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>