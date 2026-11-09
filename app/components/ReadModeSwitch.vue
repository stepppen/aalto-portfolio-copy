<script setup lang="ts">
// The one physical control on the site: a two-position slide switch with a red-orange keycap.
// Native <button role="switch">; its name is the visible "Full story" label, so on = full story.
// Toggling keeps this switch at the same place on screen: content above it that appears or
// disappears is compensated by scrolling, so the page never jumps under the reader.
import type { ReadMode } from '~/composables/useReadMode'

const { mode, set } = useReadMode()
const { t } = useLang()
const id = useId()
const root = ref<HTMLElement>()

function choose(next: ReadMode) {
  if (next === mode.value) return
  const before = root.value?.getBoundingClientRect().top ?? 0
  document.documentElement.style.overflowAnchor = 'none'
  set(next)
  const after = root.value?.getBoundingClientRect().top ?? before
  if (after !== before) window.scrollBy({ top: after - before, behavior: 'instant' })
  document.documentElement.style.overflowAnchor = ''
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate?.(8)
}
</script>

<template>
  <div ref="root" class="rm">
    <span :id="`${id}-quick`" class="rm__label" :class="{ 'is-on': mode === 'quick' }" @click="choose('quick')">{{ t('rm.quick') }}</span>
    <button
      type="button"
      role="switch"
      class="rm__switch keyslot"
      :aria-checked="mode === 'full'"
      :aria-labelledby="`${id}-full`"
      @click="choose(mode === 'quick' ? 'full' : 'quick')"
    >
      <span class="rm__cap keycap" aria-hidden="true" />
    </button>
    <span :id="`${id}-full`" class="rm__label" :class="{ 'is-on': mode === 'full' }" @click="choose('full')">{{ t('rm.full') }}</span>
  </div>
</template>

<style scoped>
.rm { display: inline-flex; align-items: center; gap: var(--space-3); user-select: none; }

.rm__label {
  color: var(--ink-muted);
  font-family: var(--font-mono);
  font-size: var(--text-mono);
  cursor: pointer;
  transition: color var(--motion-dur-fast) linear;
}

.rm__label.is-on { color: var(--ink); }

/* Housing: a recessed slot, like a slide switch on a device. Tap target ≥ 44px. */
.rm__switch {
  position: relative;
  width: 5rem;
  height: var(--layout-tap);
  padding: 0;
  border: 0;
  background: none;
  touch-action: manipulation;
}

/* Slot and keycap come from base.css (.keyslot, .keycap), shared with the language switch. */
.rm__switch { --slot-inset: 0.35rem 0; }

.rm__cap { top: 0.55rem; left: 0.4rem; width: 2.2rem; height: 1.45rem; }

[aria-checked="true"] > .rm__cap { transform: translateX(2rem); }

.rm__switch:active .rm__cap { transform: translateY(2px); }

.rm__switch[aria-checked="true"]:active .rm__cap { transform: translate(2rem, 2px); }

.rm__switch:focus-visible { outline-offset: 2px; border-radius: var(--radius-pill); }


</style>
