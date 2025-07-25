<template>
    <div class="object-cover min-w-full rounded-2xl">
        <slot />
    </div>
    <!-- <transition name="fade-img">
        <div v-if="imageDisplayed" class="imageDisplayed">
            <div v-show="showImage" class="aspect-[4/3] flex justify-center align-center overflow-hidden">
                <div class="object-cover min-w-full rounded-2xl">
                    <slot />
                </div>
            </div>
        </div>
    </transition> -->
</template>

<!-- <script>
const showImage = ref(false);
let imageDisplayed = ref(false);

onMounted(() => {
      setTimeout(() => {
        imageDisplayed.value = true;
        
      }, 200);
    });
watch(() => project, () => {
  showImage.value = true;
}, { immediate: true });

</script>
<style>
.fade-img-enter-active {
      transition: all 0.3s ease-out;
    }
.fade-img-enter-to {
    opacity: 1;
}

.fade-img-enter-from {
    transform: translateY(20px);
    opacity: 0;
}
</style> -->