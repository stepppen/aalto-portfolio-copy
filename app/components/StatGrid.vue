<script setup lang="ts">
// Panel cards for numbers that matter: big value, mono label, an optional line of detail.
// Used for the home highlights and for the outcome of each case study.
// Internal links go through lp() so they stay in the current language; external ones open the source.
type Stat = { value: string; label: string; detail?: string; href?: string }
withDefaults(defineProps<{ items: Stat[]; compact?: boolean }>(), { compact: false })
const { lp } = useLang()
const external = (href?: string) => !!href && /^https?:/.test(href)
</script>

<template>
  <ul class="stats" :class="{ 'stats--compact': compact }" role="list">
    <li v-for="h in items" :key="h.value + h.label">
      <component
        :is="!h.href ? 'div' : external(h.href) ? 'a' : resolveComponent('NuxtLink')"
        :href="external(h.href) ? h.href : undefined"
        :to="h.href && !external(h.href) ? lp(h.href) : undefined"
        :rel="external(h.href) ? 'noopener' : undefined"
        class="stats__card"
      >
        <span class="stats__value"><Txt :text="h.value" /></span>
        <span class="stats__label t-mono"><Txt :text="h.label" /><span v-if="h.href" class="stats__arrow" aria-hidden="true">&nbsp;{{ external(h.href) ? '↗' : '→' }}</span></span>
        <span v-if="h.detail" class="stats__detail muted">{{ h.detail }}</span>
      </component>
    </li>
  </ul>
</template>

<style scoped>
.stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--layout-gutter); padding: 0; list-style: none; }

.stats > li { display: grid; }

.stats__card {
  display: grid;
  align-content: start;
  gap: var(--space-2);
  padding: var(--space-6);
  border-radius: var(--radius-card);
  background: var(--panel);
  color: inherit;
  text-decoration: none;
  transition: background-color 200ms var(--motion-ease);
}

a.stats__card:hover { background: color-mix(in srgb, var(--ink) 6%, var(--panel)); }

.stats__value {
  font-family: var(--font-display);
  font-size: var(--text-statement);
  letter-spacing: var(--tracking-display);
  line-height: 1.05;
}

.stats__label { color: var(--ink); }

.stats__arrow { display: inline-block; transition: transform var(--motion-dur-fast) var(--motion-ease); }

a.stats__card:hover .stats__arrow { transform: translateX(3px); }

.stats__detail { font-size: var(--text-small); line-height: 1.45; }

@media (width < 30rem) {
  .stats__card { padding: var(--space-4); }
}

@media (width >= 64rem) {
  .stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }

  .stats__card { padding: var(--space-8); min-height: 13rem; }

  /* In a case study the cards sit in the right-hand column: two across, same height. */
  .stats--compact { grid-template-columns: repeat(2, minmax(0, 1fr)); }

  .stats--compact .stats__card { padding: var(--space-6); min-height: 9rem; }
}
</style>
