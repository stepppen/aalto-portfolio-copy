<template>
    <div class="info-tag" v-if="text">
        <MdiIcon v-if="iconName" :icon="iconName" class="icon" size="1.5rem"/>
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
const props = defineProps<Props>()


</script>


<style scoped>
.info-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(4px);
    border-radius: 2rem;
    padding: 0.5rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: default;
}

@media (max-width: 768px) {
    .icon{
        /* width: 1.5rem; */
        margin: 0.25rem;
    }

}
</style>