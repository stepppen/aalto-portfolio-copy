<template>
    <div class="toggle-container">
        <div class="tab-toggle">
            <div 
                v-for="(tab, index) in TABS"
                :key="tab.key"
                class="nav-button" 
                @click="navigateTo(tab.path)" 
                :class="{ active: currentTab === tab.key }"
            >
                {{ tab.label }}
            </div>
            <div class="active-button" :style="sliderPos"></div>
        </div>
    </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const TABS = [
    { key: 'work', label: 'Work', path: '/' },
    { key: 'about', label: 'About', path: '/about' },
];

const currentTab = ref('work');

const navigateTo = (path) => {
    router.push(path);
};

const mapPathToTab = (path) => {
    if (path === '/') {
        return 'work';
    } else if (path.startsWith('/about')) {
        return 'about';
    }
    return 'work';
};

watch(
    () => route.path,
    (newPath) => {
        currentTab.value = mapPathToTab(newPath);
    }, 
    { immediate: true }
);

const sliderPos = computed(() => {
    const activeIndex = TABS.findIndex(tab => tab.key === currentTab.value);
    const visibleIndex = Math.max(0, activeIndex);

    return {
        width: `calc(${100 / TABS.length}% - 4px)`, 
        transform: `translateX(${visibleIndex * 100}%)`, 
    };
});
</script>

<style scoped>
.toggle-container {
    display: flex;
    justify-content: center;
    margin: 0 1rem;
}

.tab-toggle {
    display: flex;
    position: relative;
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    padding: 4px;
    height: 44px;
    cursor: pointer;
    user-select: none;
    min-width: 200px;
    max-width: 400px;
    width: 100%;
    /* Removed backdrop-filter - this causes iOS flickering */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    animation: smoothFadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.tab-toggle:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-button {
    display: flex;
    flex: 1 1 0%; 
    align-items: center;
    z-index: 1;
    justify-content: center;
    height: 100%;
    color: rgba(255, 255, 255, 0.7);
    border-radius: 25px;
    white-space: nowrap;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    font-size: 1rem;
    font-weight: 300;
}

.nav-button.active {
    color: #111;
    font-weight: 600;
}

.nav-button:hover {
    color: rgb(112, 112, 112);
}

.nav-button:not(.active):hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.active-button {
    position: absolute;
    z-index: 0;
    left: 4px;
    top: 4px;
    height: calc(100% - 8px);
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    border-radius: 25px;
    box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.15),
        0 1px 3px rgba(0, 0, 0, 0.1);
    
    transition: 
        transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes smoothFadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .tab-toggle {
        max-width: 90vw;
        min-width: 200px;
        height: 40px;
    }
    .nav-button {
        font-size: 0.9rem;
    }
}
</style>