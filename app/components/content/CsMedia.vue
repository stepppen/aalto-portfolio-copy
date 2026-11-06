<script setup lang="ts">
const props = withDefaults(defineProps<{ src?: string; alt?: string; caption?: string; todo?: string; ratio?: string; contain?: boolean; develop?: boolean; hero?: boolean }>(), { ratio: '16 / 10' })
const external = computed(() => props.src?.startsWith('http'))
</script>

<template>
  <figure class="cs-media">
    <NuxtImg
      v-if="src && !external"
      :src="src"
      :alt="alt ?? ''"
      sizes="sm:100vw md:100vw lg:100vw xl:1344px"
      densities="x1 x2"
      format="webp"
      loading="lazy"
      decoding="async"
      :class="{ contain }"
      :style="{ aspectRatio: contain ? ratio : imageRatio(src) }"
    />
    <div v-else class="cs-media__todo" :style="{ aspectRatio: ratio }">
      <Txt :text="todo ? `[TODO: ${todo}]` : '[TODO: media]'" />
    </div>
    <figcaption v-if="caption" class="t-small muted">{{ caption }}</figcaption>
  </figure>
</template>
