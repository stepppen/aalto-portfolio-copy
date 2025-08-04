<script setup lang="ts">
const isLoaded = ref(false)
const isPlaying = ref(false)
const video = ref<any>(null)

function stateChange(event: any) {
  isPlaying.value = event.data === 1
}

async function play() {
  if (video.value?.player?.playVideo) {
    try {
      await video.value.player.playVideo()
    } catch (error) {
      console.error("Play error:", error)
    }
  } else {
    console.warn("Player not ready")
  }
}

interface Props {
  id: string,
  caption: string
}
defineProps<Props>()
</script>

<template>
    <div class="my-16">
      <div class="flex items-center justify-center">
        <div class="aspect-w-16 aspect-h-9 overflow-hidden rounded-2xl w-full max-w-full mx-auto">
          <ScriptYouTubePlayer
            ref="video"
            :video-id="id"
            @ready="isLoaded = true"
            @state-change="stateChange"
            :player-options="{ host: 'https://www.youtube.com' }"
            class="w-full h-full v-fade"
            data-aos="fade-up"
          >
            <div v-if="!isLoaded">
              <div class="bg-slate-500 h-full w-full">

              </div>
            </div>
          </ScriptYouTubePlayer>
        </div>
      </div>
      <figcaption v-if="caption">{{ caption }}</figcaption>
    </div>
</template>

<style>
figcaption {
  margin-top: 0.5rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}
</style>
