<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoaded = ref(false)
const isPlaying = ref(false)
const video = ref<any>(null)

function stateChange(event: any) {
  // event.data "1" means the video is playing (per the YouTube API)
  isPlaying.value = event.data === 1
}

function handleReady(event: any) {
  isLoaded.value = true
}

interface Props {
  id: string,
  caption: string
}
const props = defineProps<Props>()

onMounted(() => {
  setTimeout(() => {
    if (!isLoaded.value) {
      isLoaded.value = true
    }
  }, 3000)
})
</script>

<template>
  <div class="my-4">
    <div class="flex items-center justify-center">
      <div class="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-2xl w-full max-w-full mx-auto">
        <!-- YouTube player with native UI -->
        <ScriptYouTubePlayer
          ref="video"
          :video-id="props.id"
          @ready="handleReady"
          @state-change="stateChange"
          :player-options="{ host: 'https://www.youtube.com', enablejsapi: 1, controls: 1 }"
          class="w-full h-full v-fade"
          data-aos="fade-up"
        >
        </ScriptYouTubePlayer>
      </div>
      
    </div>
    <!-- Display the caption if provided -->
    <figcaption v-if="props.caption" class="mt-2 text-center text-gray-600 text-sm">
      {{ props.caption }}
    </figcaption>
  </div>
</template>

<style scoped>
figcaption {
  margin-top: 0.5rem;
  text-align: center;
  color: #ffffff;
  opacity: 0.5;
  font-size: 0.9rem;
}
</style>