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
      :loading="hero ? 'eager' : 'lazy'"
      :preload="hero ? { fetchPriority: 'high' } : undefined"
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

<style scoped>
.cs-media { display: grid; gap: var(--space-3); margin: 0; }

.cs-media :deep(img) {
  width: 100%;
  border-radius: var(--radius-media);
  background: var(--panel);
}

.cs-media :deep(img.contain) { object-fit: contain; }

.cs-media__todo {
  display: grid;
  place-items: center;
  padding: var(--space-6);
  border-radius: var(--radius-media);
  background: var(--panel);
  text-align: center;
}

figcaption { max-width: 60ch; }
</style>
