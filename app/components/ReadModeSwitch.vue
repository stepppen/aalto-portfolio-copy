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
      class="rm__switch"
      :aria-checked="mode === 'full'"
      :aria-labelledby="`${id}-full`"
      @click="choose(mode === 'quick' ? 'full' : 'quick')"
    >
      <span class="rm__cap" aria-hidden="true" />
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

.rm__switch::before {
  content: "";
  position: absolute;
  inset: 0.3rem 0;
  border-radius: var(--radius-control);
  background: linear-gradient(to bottom, color-mix(in srgb, var(--ink) 14%, var(--panel)), var(--panel));
  box-shadow:
    inset 0 2px 3px color-mix(in srgb, var(--ink) 35%, transparent),
    inset 0 -1px 0 var(--bg),
    0 1px 0 var(--bg);
}

/* Keycap: lit top, shaded side underneath, ridges to grip. Travels with a short spring and
   sinks onto its side while pressed. */
.rm__cap {
  position: absolute;
  top: 0.45rem;
  left: 0.3rem;
  width: 2.3rem;
  height: 1.55rem;
  border-radius: 5px;
  background:
    repeating-linear-gradient(to right, transparent 0 3px, color-mix(in srgb, var(--switch-edge) 55%, transparent) 3px 4px) center / 0.9rem 0.7rem no-repeat,
    linear-gradient(to bottom, var(--switch-hi), var(--switch) 55%);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--bg) 55%, transparent),
    0 3px 0 var(--switch-edge),
    0 5px 8px color-mix(in srgb, var(--ink) 30%, transparent);
  transition:
    transform var(--motion-dur-switch) var(--motion-spring),
    box-shadow 90ms linear;
}

[aria-checked="true"] > .rm__cap { transform: translateX(2.1rem); }

.rm__switch:active .rm__cap {
  transform: translateY(2px);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--bg) 40%, transparent),
    0 1px 0 var(--switch-edge),
    0 2px 3px color-mix(in srgb, var(--ink) 30%, transparent);
}

.rm__switch[aria-checked="true"]:active .rm__cap { transform: translate(2.1rem, 2px); }

.rm__switch:focus-visible { outline-offset: 2px; border-radius: var(--radius-control); }

@media (forced-colors: active) {
  .rm__cap { background: ButtonText; }
}
</style>
