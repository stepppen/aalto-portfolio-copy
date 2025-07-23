<template>
    <div class="projects-container">
        <Head>
            <Title>Archive</Title>
        </Head>
        
        <!-- Main content positioned next to sidebar -->
        <div class="main-content">
            
            <div class='adaptive-grid'>
                <div v-for="p in project" :key="p.slug" class="project-item">
                    <ProjectCard :project="p"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import jsonData from '~/assets/projects/projects.json'; // Make sure path is correct

const project = ref(jsonData);
const sidebarWidth = ref(200); // Default value

onMounted(() => {
    // Get actual sidebar width after mount
    setTimeout(() => {
        const computed = getComputedStyle(document.documentElement)
            .getPropertyValue('--sidebar-width')
            .trim();
        if (computed) {
            sidebarWidth.value = parseInt(computed);
        }
    }, 150);
});

useHead({
    title: 'Projects',
    meta: [
        {name: 'description', content: 'Vedunov Projects'}
    ]
});
</script>

<style lang="scss" scoped>
.projects-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
}

.main-content {
    padding: 2rem;
    position: relative;
    margin-left: var(--sidebar-width, 200px); /* Position content after sidebar */
    width: calc(100% - var(--sidebar-width, 200px)); /* Fill remaining width */
}

.projects-title {
    font-size: 2rem;
    margin-bottom: 2rem;
}

.adaptive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .main-content {
        margin-left: 0;
        width: 100%;
        padding: 1rem;
    }
    
    .projects-title {
        font-size: 1.75rem;
        margin-bottom: 1.5rem;
    }
    
    .adaptive-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }
}

.project-item {
    break-inside: avoid;
    margin-bottom: 1.5rem;
    transition: transform 0.2s ease-in-out;
    
    &:hover {
        transform: translateY(-4px);
    }
}
</style>