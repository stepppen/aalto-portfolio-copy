<template>
    <div class="flex">
        <a :href="src">{{ text }}</a>
        <MdiIcon icon="mdiArrowTopRight" size="24px"/>
    </div>
</template>

<script setup lang="ts">
interface Props{
    text: string,
    src: string
}

defineProps<Props>()

</script>