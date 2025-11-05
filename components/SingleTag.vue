<template>
    <div class="info-tag" v-if="text">
        <MdiIcon v-if="iconName" :icon="iconName" class="icon" size="24px"/>
        <p>
            {{ text }}
        </p>
    </div>
</template>


<script setup lang="ts">

interface Props {
  text: string
  iconName?: string
}
defineProps<Props>()


</script>


<style scoped>
.info-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(4px);
    border-radius: 1.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: default;
}

@media (max-width: 768px) {
    .icon{
        margin-right: 0.25rem;
        width: 0.95rem;
    }
    .info-tag{
        gap: 3px;
        padding: 0.25rem 0.75rem;
    }
    p{
        font-size: 1rem;
    }

}
</style>