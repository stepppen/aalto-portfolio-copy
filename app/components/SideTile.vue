<script setup lang="ts">
// A side-project tile. Static poster first; the live 3D scene (if any) loads only when the tile
// comes near the viewport, and the poster stays if WebGL isn't available.
import type { TilesCollectionItem } from '@nuxt/content'

const props = defineProps<{ tile: TilesCollectionItem; posterMode?: boolean; eager?: boolean }>()
import type { MountOptions } from '~/tiles/runtime'

type Mount = (el: HTMLElement, o: MountOptions) => () => void
// Each scene is its own chunk; three.js is shared between them and loads with the first one.
const scenes: Record<string, () => Promise<Mount>> = {
  print: () => import('~/tiles/print').then((m) => m.mountPrint),
  macropad: () => import('~/tiles/macropad').then((m) => m.mountMacropad),
  books: () => import('~/tiles/books').then((m) => m.mountBooks),
}

const stage = ref<HTMLElement>()
const live = ref(false)
const status = ref('')
const caption = ref<string | null>(null)
const id = useId()
let unmount = () => {}
let stopWatching = () => {}
onBeforeUnmount(() => { stopWatching(); unmount() })

function webgl() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}

// The live scene starts when the tile is on screen AND the visitor has done something
// (scrolled, touched, pressed a key) or the page has been idle for a while. Until then the
// poster shows the same object, so loading the page never pays for WebGL setup.
onMounted(() => {
  const load = props.tile.scene ? scenes[props.tile.scene] : undefined
  if (!load || !stage.value || !webgl()) return
  let onScreen = false, engaged = !!props.posterMode, started = false
  const start = async () => {
    if (started || !onScreen || !engaged) return
    started = true
    stopWatching()
    const mount = await load()
    unmount = mount(stage.value!, {
      poster: props.posterMode,
      data: props.tile as unknown as Record<string, unknown>,
      onStatus: (t) => (status.value = t),
      onCaption: (t) => { caption.value = t; if (t) status.value = t },
      onReady: () => (live.value = true),
    })
  }
  const engage = () => { engaged = true; start() }
  const events = ['scroll', 'pointerdown', 'keydown', 'touchstart', 'wheel'] as const
  events.forEach((ev) => window.addEventListener(ev, engage, { passive: true, once: true }))
  stage.value.addEventListener('pointerenter', engage, { once: true })
  stage.value.addEventListener('focus', engage, { once: true })
  const idle = window.setTimeout(engage, 6000)
  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; start() }, { rootMargin: '200px 0px' })
  io.observe(stage.value)
  stopWatching = () => { io.disconnect(); clearTimeout(idle); events.forEach((ev) => window.removeEventListener(ev, engage)) }
})
</script>

<template>
  <figure class="tile" :data-scene="tile.scene">
    <component
      :is="tile.href && !tile.scene ? resolveComponent('NuxtLink') : 'div'"
      ref="stage"
      :to="tile.href && !tile.scene ? tile.href : undefined"
      class="tile__stage"
      :class="{ 'is-live': live, 'is-interactive': !!tile.scene }"
      :tabindex="tile.scene ? 0 : undefined"
      :role="tile.scene ? 'group' : undefined"
      :aria-label="tile.scene ? `${tile.title}, interactive 3D` : undefined"
      :aria-describedby="`${id}-desc`"
    >
      <NuxtImg
        v-if="tile.poster && imageRatio(tile.poster) && !posterMode"
        :src="tile.poster"
        :alt="tile.scene ? '' : tile.description"
        class="tile__poster"
        sizes="sm:50vw md:33vw xl:440px"
        densities="x1 x2"
        format="webp"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : undefined"
        :preload="eager ? { fetchPriority: 'high' } : undefined"
      />
      <span v-if="tile.placeholder && tile.scene" class="tile__flag t-mono">placeholder model</span>
      <p v-if="caption" class="tile__caption" aria-hidden="true">{{ caption }}</p>
    </component>
    <figcaption>
      <p class="tile__title">
        <NuxtLink v-if="tile.href" :to="tile.href" class="tile__link">{{ tile.title }}</NuxtLink>
        <template v-else>{{ tile.title }}</template>
      </p>
      <p class="tile__category">{{ tile.category }}</p>
      <p :id="`${id}-desc`" class="sr-only">{{ tile.description }} {{ tile.scene ? tile.instructions : '' }}</p>
      <p v-if="tile.placeholder" class="tile__todo"><Txt :text="tile.placeholder" /></p>
    </figcaption>
    <p v-if="tile.scene" class="sr-only" role="status" aria-live="polite">{{ status }}</p>
  </figure>
</template>

<style scoped>
.tile { margin: 0; display: grid; align-content: start; gap: var(--space-3); }

.tile__stage {
  position: relative;
  display: block;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius-tile);
  background: var(--tile);
}

.tile__stage.is-interactive { cursor: grab; touch-action: pan-y; user-select: none; }

.tile__stage.is-interactive:active { cursor: grabbing; }

.tile__poster { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity var(--motion-dur-fast) linear; }

/* Once the live scene has drawn, the poster steps aside (it would double up with a half-built print). */
.tile__stage.is-live .tile__poster { opacity: 0; }

/* The live canvas sits on the poster; the poster stays underneath as the fallback. */
.tile__stage :deep(.tile__canvas) { position: absolute; inset: 0; width: 100%; height: 100%; }

.tile__flag {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  z-index: 1;
  padding: 0.1em 0.6em;
  border-radius: var(--radius-pill);
  background: var(--bg);
  color: var(--ink-muted);
}

.tile__caption {
  position: absolute;
  left: var(--space-3);
  right: var(--space-3);
  bottom: var(--space-3);
  z-index: 1;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-media);
  background: var(--bg);
  font-size: var(--text-small);
  line-height: 1.35;
  pointer-events: none;
}

.tile__title { font-size: var(--text-small); font-weight: 500; line-height: 1.3; }

.tile__link { text-decoration: none; }

.tile__link:hover { text-decoration: underline; }

.tile__category { font-size: var(--text-small); color: var(--ink-muted); line-height: 1.3; }

.tile__todo { margin-top: var(--space-1); }

.tile figcaption { padding-inline: var(--space-1); }
</style>
