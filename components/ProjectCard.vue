<template>
    <transition name="card-fade">
        <div v-if="cardLoaded" class="container">
        <div class="aspect-[4/3] image-container flex justify-center align-center" @mouseover="hover = true" @mouseleave="hover = false">
            <nuxt-link :to="`/projects/${project.id}`"> 
                    <div class="container object-cover min-w-full h-full">
                        <img :src="project.thumb" alt="project thumbnail" loading="lazy" class="thumb">
                        <div  v-if="hover" class="overlay">
                            <p class="truncate"> {{ project.title }}</p>
                            <p class="truncate"> {{ project.year }}</p>
                        </div>
                    </div>
            </nuxt-link>
        </div>
    </div>
    </transition>
    
</template>

<script setup>
    const { project } = defineProps(['project']);

    let cardLoaded = ref(false);
    let hover = ref(false);

    onMounted(()=>{
        setTimeout(()=>{
            cardLoaded.value = true;
        }, 200)
        
    })
</script>

<style scoped>
.container {
    position: relative;
}
.thumb {
    aspect-ratio: 4/3;
    object-fit: cover;
    max-height: 100vh;
}

.overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      color: #fff;
      opacity: 0;
      transition: opacity 0.1s ease;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
.overlay:hover {
    opacity: 1;
}

.card-fade-enter-active {
      transition: all 0.3s ease-out;
    }
.card-fade-enter-to {
    opacity: 1;
}

.card-fade-enter-from {
    transform: translateY(20px);
    opacity: 0;
}
</style>