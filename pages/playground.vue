<template>
    <div class="page-container">
        <header class="header-section">
            <h1 class="page-title">Playground</h1>
            <p class="page-description">
                A collection of external tools, useful resources, and interesting personal experiments that I often use or reference.
            </p>
        </header>

        <div class="playground-grid">
            <PlaygroundCard 
                v-for="item in playgroundItems" 
                :key="item.title"
                :item="item"
            />
        </div>
        
        <div class="bottom-spacer"></div>
    </div>
</template>

<script setup>
// Mock data structure: replace with your actual data
const playgroundItems = ref([
    {
        title: "Nuxt UI Pro Template",
        meta: {
            preview: "/images/playground/nuxt-ui-pro.webp", // Mock path
            description: "A comprehensive UI component library built on Tailwind CSS, highly configurable and integrated with Nuxt 3.",
            link: "https://ui.nuxt.com/",
            tags: ["Vue", "Nuxt", "UI/UX", "Tailwind"],
            type: "Tool",
            aspectRatio: "16:9",
        }
    },
    {
        title: "D3.js Data Visualization",
        meta: {
            preview: "/images/playground/d3-chart.webp", // Mock path
            description: "A low-level JavaScript library for powerful, custom data visualization on the web using SVG and Canvas.",
            link: "https://d3js.org/",
            tags: ["JavaScript", "Visualization", "SVG"],
            type: "Library",
            aspectRatio: "4:3",
        }
    },
    {
        title: "Glassmorphism Generator",
        meta: {
            preview: "/images/playground/glassmorphism.webp", // Mock path
            description: "Online tool to quickly generate CSS for the trendy glassmorphism effect using blur and transparency.",
            link: "https://hype4.academy/tools/glassmorphism-generator",
            tags: ["CSS", "Design", "Tool"],
            type: "Design",
            aspectRatio: "3:2",
        }
    },
    {
        title: "Design Principles Repository",
        meta: {
            preview: "/images/playground/design-principles.webp", // Mock path
            description: "A curated collection of design principles, laws, and cognitive biases for product designers and developers.",
            link: "https://www.designprinciples.com/",
            tags: ["UX", "Theory", "Resource"],
            type: "Resource",
            aspectRatio: "16:9",
        }
    },
    // Add more items here...
]);
</script>

<style scoped>
/* Page Layout Styles */
.page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 4rem 1.5rem;
}

.header-section {
    padding-bottom: 4rem;
    max-width: 800px;
}

.page-title {
    font-size: 3rem;
    font-weight: 700;
    color: #ededed;
    margin-bottom: 0.5rem;
    letter-spacing: -0.04em;
}

.page-description {
    font-size: 1.25rem;
    color: #888888;
    line-height: 1.6;
}

/* Masonry Grid (Container for the cards) */
.playground-grid {
    /* Using CSS Grid for modern Masonry layout */
    display: grid;
    grid-gap: 2rem;
    
    /* Dynamic column setup based on screen size */
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    
    /* This makes the grid behave like masonry by allowing items to span rows */
    grid-auto-rows: 1px; /* Important for masonry effect with row-span */
    padding-bottom: 4rem;
}

/* Card in the Grid (Needed for CSS Grid-based Masonry) */
.playground-grid > :deep(.playground-card-wrapper) {
    /* The break-inside: avoid is for columns, but we use span for grid */
    grid-row-end: span 2; 
    /* The height of the cards determines how many rows they span */
}

.bottom-spacer {
    height: 8rem;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
    .page-container {
        padding: 2rem 1rem;
    }
    .page-title {
        font-size: 2.5rem;
    }
    .page-description {
        font-size: 1rem;
    }
    .playground-grid {
        grid-template-columns: 1fr; /* Single column on small devices */
        grid-gap: 1.5rem;
    }
    .playground-grid > :deep(.playground-card-wrapper) {
        grid-row-end: unset;
    }
}
</style>