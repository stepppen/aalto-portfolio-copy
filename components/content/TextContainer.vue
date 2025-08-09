<template>
    <span class="info-tag">
        <p v-if="title" class="title"> {{ title }}</p>
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
    max-width: 100%;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(4px);
    border-radius: 1.5rem;
    padding: 1rem 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: default;
}
.info-tag .title {
  display: inline-block;
  min-width: 4.5rem;
  margin: 0;
  opacity: 0.5;
}

@media (max-width: 768px) {
    .info-tag{
        flex-direction: column;
        max-width: 100%;
    }
}
</style>