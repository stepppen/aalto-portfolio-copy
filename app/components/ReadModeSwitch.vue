<script setup lang="ts">
// The one physical control on the site: a two-position hardware switch.
// Native <button role="switch">; its name is the visible "Full story" label, so on = full story.
const { mode, set } = useReadMode()
const id = useId()

function toggle() {
  set(mode.value === 'quick' ? 'full' : 'quick')
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate?.(8)
}
</script>

<template>
  <div class="rm">
    <span :id="`${id}-quick`" class="rm__label" :class="{ 'is-on': mode === 'quick' }" @click="set('quick')">Quick read</span>
    <button
      type="button"
      role="switch"
      class="rm__switch"
      :aria-checked="mode === 'full'"
      :aria-labelledby="`${id}-full`"
      @click="toggle"
    >
      <span class="rm__lever" aria-hidden="true"><span class="rm__cap" /></span>
    </button>
    <span :id="`${id}-full`" class="rm__label" :class="{ 'is-on': mode === 'full' }" @click="set('full')">Full story</span>
  </div>
</template>

<style scoped>
.rm { display: inline-flex; align-items: center; gap: var(--space-3); user-select: none; }

.rm__label { color: var(--ink-muted); font-size: var(--text-small); cursor: pointer; transition: color var(--motion-dur-fast) linear; }

.rm__label.is-on { color: var(--ink); }

/* Housing: a small recessed slot, like a slide switch on a device. Tap target ≥ 44px. */
.rm__switch {
  position: relative;
  width: 4.25rem;
  height: var(--layout-tap);
  padding: 0;
  border: 0;
  background: none;
  touch-action: manipulation;
}

.rm__switch::before {
  content: "";
  position: absolute;
  inset: 0.5rem 0;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-pill);
  background: var(--panel);
  box-shadow: inset 0 1px 2px color-mix(in srgb, var(--ink) 22%, transparent);
}

/* Lever: travels with a short spring (slight overshoot), dips 1.5px while pressed. */
.rm__lever {
  position: absolute;
  top: 0.75rem;
  left: 0.3rem;
  width: 1.9rem;
  height: calc(var(--layout-tap) - 1.5rem);
  border-radius: var(--radius-pill);
  background: linear-gradient(to bottom, var(--bg), var(--panel));
  box-shadow:
    0 1px 0 var(--bg) inset,
    0 1px 2px color-mix(in srgb, var(--ink) 30%, transparent),
    0 2px 6px color-mix(in srgb, var(--ink) 14%, transparent);
  display: grid;
  place-items: center;
  transition: transform var(--motion-dur-switch) var(--motion-spring);
}

.rm__cap {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--signal);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--signal) 22%, transparent);
}

[aria-checked="true"] > .rm__lever { transform: translateX(1.75rem); }

.rm__switch:active .rm__lever { transform: translateY(1.5px); }

.rm__switch[aria-checked="true"]:active .rm__lever { transform: translate(1.75rem, 1.5px); }

.rm__switch:focus-visible { outline-offset: 2px; border-radius: var(--radius-pill); }

@media (forced-colors: active) {
  .rm__lever { background: ButtonText; }
}
</style>
