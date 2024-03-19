<template>
    <nuxt-link :to="`/projects/${project.id}`"> 
        <div class="flex items-baseline hover:px-1 slow-transition overlayTitle">
            <p class="px-4">0{{ project.id }}</p>
            <h2>{{ project.title }}</h2>
        </div>
    </nuxt-link>
</template>

<script setup>
    const { project } = defineProps(['project']);   
</script>

<style lang="scss" scoped>
.slow-transition{
    transition: 0.1s ease-in-out;
}

.overlayTitle {
    opacity: 1;
    }

.occlusion-div{
    opacity: 0;
}
.overlayTitle:hover {
        .occlusion-div{
            opacity: 1;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            color: rgba(0, 0, 0, 0.7);
        }
      background-color: rgba(0, 0, 0, 0.7);
      color: #fff;
      opacity: 0.5;
      transition: opacity 0.1s ease;
}

</style>