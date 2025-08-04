<template>
    <span class="info-tag" data-aos="fade-up">
        <span v-if="title" class="title"> {{ title }}</span>
        <div>
            <slot></slot>
        </div>
    </span>
</template>

<script setup lang="ts">
interface Props {
    title?: string
}
defineProps<Props>()
</script>

<style scoped>
.info-tag{
    display: inline-flex;
    gap: 6px;
    max-width: 50%;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(4px);
    border-radius: 1.5rem;
    padding: 1rem 1.5rem;
    font-size: 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: default;
}
.title {
    font: "Space Grotesk", sans-serif;
    font-weight: 400;
    margin-right: 0.4rem;
    font-size: 0.9rem;
    color: white;
    opacity: 0.5;
}

@media (max-width: 768px) {
    .info-tag{
        flex-direction: column;
        max-width: 100%;
    }
}
</style>