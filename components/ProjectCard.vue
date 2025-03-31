<template>
    <transition name="card-fade">
        <div v-if="cardLoaded" class="container grid-item">
        <div class="image-container flex justify-center align-center" @mouseover="hover = true" @mouseleave="hover = false">
            <nuxt-link :to="`/projects/${project.id}`"> 
                    <div class="container object-cover min-w-full h-full grid-item">
                        <img :src="project.preview" alt="project thumbnail" loading="lazy" class="rounded new-img">
                        <div>
                            <p class="truncate"> {{ project.title }}</p>
                            <p class="truncate opacity-50"> {{ project.year }}</p>
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

.grid-item {
    margin-bottom: 8px;
    break-inside: avoid;
    /* padding-top: 4px; */
  /* width: 600px; */
  /* margin-bottom: auto; */
}

.new-img{
    object-fit: cover;
  width: 100%;
  /* height: 400px; */
  margin-bottom: auto;
  transition: opacity 0.3s ease-out;

}

.new-img:active{
    border: 1px solid rgb(190 18 60);
}
.new-img:hover {
    border: 1px solid rgb(255, 255, 255);
    
}
.border {
    object-fit: cover;
  width: 100%;
  /* height: 400px; */
  margin-bottom: auto;
    transition: opacity 0.3s ease-out;
}
.overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      opacity: 0;
      transition: opacity 0.3s ease-out;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
.overlay:hover {
    border: 1px solid rgb(255, 255, 255);
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