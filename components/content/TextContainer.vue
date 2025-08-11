<template>
    <div class="info-tag">
        <p v-if="title" class="title"> {{ title }}</p>
        <div>
            <slot></slot>
        </div>
    </div>
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
    margin: 12px 0;
    max-width: 100%;
    height: auto;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(4px);
    border-radius: 1.5rem;
    padding: 1rem 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: default;
}
.info-tag .title {
  display: inline-block;
  width: auto;
  margin-right: 0.5rem;
  opacity: 0.5;
  white-space: nowrap;
}

@media (max-width: 768px) {
    .info-tag{
        flex-direction: column;
        max-width: 100%;
    }
}
</style>