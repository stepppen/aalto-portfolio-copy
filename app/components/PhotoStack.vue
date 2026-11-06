<script setup lang="ts">
// A loose stack of photos, like prints on a desk. Click the stack (or the button) and the top
// one slides off and tucks in at the back. Placeholders render as blank prints with a todo.
type Photo = { src?: string; alt?: string; todo?: string }
const props = defineProps<{ photos: Photo[] }>()

const order = ref(props.photos.map((_, i) => i))
const leaving = ref<number | null>(null)
// Fixed, hand-picked tilts so the stack looks the same on every load (and on the server).
const tilt = [-2.5, 3, -4, 2, -1.5, 4]
const pos = (i: number) => order.value.indexOf(i)

function next() {
  if (leaving.value !== null || props.photos.length < 2) return
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const top = order.value[0]
  leaving.value = top
  setTimeout(() => {
    order.value = [...order.value.slice(1), top]
    leaving.value = null
  }, reduce ? 0 : 260)
}
</script>

<template>
  <div class="stack">
    <div class="stack__deck" @click="next">
      <figure
        v-for="(p, i) in photos"
        :key="i"
        class="stack__card"
        :class="{ 'is-leaving': leaving === i, 'is-top': pos(i) === 0 }"
        :style="{ '--tilt': `${pos(i) === 0 ? 0 : tilt[pos(i) % tilt.length]}deg`, '--depth': pos(i), zIndex: photos.length - pos(i) }"
        :aria-hidden="pos(i) === 0 ? undefined : 'true'"
      >
        <NuxtImg
          v-if="p.src"
          :src="p.src"
          :alt="p.alt ?? ''"
          sizes="sm:80vw md:40vw xl:420px"
          densities="x1 x2"
          format="webp"
          :preload="i === 0"
          :loading="i === 0 ? 'eager' : 'lazy'"
        />
        <div v-else class="stack__todo"><Txt :text="p.todo" /></div>
      </figure>
    </div>
    <div class="stack__bar t-mono muted">
      <span aria-live="polite">{{ order[0] + 1 }} / {{ photos.length }}</span>
      <button type="button" class="stack__next" @click="next">next photo<span aria-hidden="true">&nbsp;↻</span></button>
    </div>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: var(--space-3); width: min(100%, 26rem); }

.stack__deck { position: relative; aspect-ratio: 3 / 4; cursor: pointer; }

.stack__card {
  position: absolute;
  inset: 0;
  margin: 0;
  overflow: hidden;
  border-radius: var(--radius-card);
  background: var(--panel);
  border: 6px solid var(--bg);
  box-shadow: 0 1px 2px color-mix(in srgb, var(--ink) 12%, transparent), 0 8px 24px color-mix(in srgb, var(--ink) 10%, transparent);
  transform: rotate(var(--tilt)) translateY(calc(var(--depth) * 4px));
  transition:
    transform 420ms var(--motion-spring),
    opacity 260ms var(--motion-ease),
    filter 260ms var(--motion-ease);
}

.stack__card img { width: 100%; height: 100%; object-fit: cover; }

.stack__card.is-leaving {
  transform: translate(70%, -4%) rotate(12deg);
  opacity: 0;
  filter: blur(6px);
}

.stack__todo { display: grid; place-items: center; height: 100%; padding: var(--space-6); text-align: center; }

.stack__bar { display: flex; justify-content: space-between; align-items: center; padding-inline: var(--space-1); }

.stack__next {
  min-height: var(--layout-tap);
  padding: 0;
  border: 0;
  background: none;
  color: var(--ink-muted);
  font: inherit;
}

.stack__next:hover { color: var(--ink); }

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .stack__deck:hover .stack__card.is-top:not(.is-leaving) { transform: rotate(-1deg) translateY(-4px); }
}

@media (prefers-reduced-motion: reduce) {
  .stack__card { transition: none; }
}
</style>
