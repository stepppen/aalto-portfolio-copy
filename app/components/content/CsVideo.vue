<script setup lang="ts">
// YouTube facade: nothing loads from YouTube until the visitor asks for the video.
const props = defineProps<{ id: string; title: string; poster?: string; caption?: string }>()
const playing = ref(false)
</script>

<template>
  <figure class="cs-video">
    <div class="cs-video__frame">
      <iframe
        v-if="playing"
        :src="`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`"
        :title="title"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
      />
      <button v-else type="button" class="cs-video__play" @click="playing = true">
        <NuxtImg v-if="poster" :src="poster" alt="" sizes="sm:100vw xl:1344px" format="webp" loading="lazy" />
        <span class="cs-video__label">play video: {{ title }}</span>
      </button>
    </div>
    <figcaption v-if="caption" class="t-small muted">{{ caption }} Plays from YouTube.</figcaption>
  </figure>
</template>

<style scoped>
.cs-video { display: grid; gap: var(--space-3); margin: 0; }

.cs-video__frame {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--radius-media);
  background: var(--panel);
}

.cs-video__frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }

.cs-video__play {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
}

.cs-video__play img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

.cs-video__label {
  position: relative;
  padding-inline: var(--space-4);
  background: var(--bg);
  color: var(--ink);
  border-radius: var(--radius-media);
}

.cs-video__play:hover .cs-video__label { color: var(--signal); }
</style>
