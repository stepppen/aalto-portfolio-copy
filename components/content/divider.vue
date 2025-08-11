<template>
<div class="pt-12" data-aos="fade-up">
    <h2 class="">
        {{title}}
    </h2>
    <div class="h-px bg-white opacity-30 w-full"></div>
</div>
</template>

<script setup lang="ts">

interface Props{
    title: String
}

defineProps<Props>()
</script>