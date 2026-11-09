<script setup lang="ts">
// en | de as one keycap switch: the current language is lit, the link goes to the other one.
// Same red-orange cap as the read-mode switch, smaller. The cap slides when the language changes.
const { t, lang, other } = useLang()
</script>

<template>
  <NuxtLink
    :to="other"
    class="lang t-mono"
    :class="`lang--${lang}`"
    :hreflang="lang === 'de' ? 'en' : 'de-CH'"
    :lang="lang === 'de' ? 'en' : 'de-CH'"
  >
    <span class="lang__opt" :class="{ 'is-on': lang === 'en' }">en</span>
    <span class="lang__slot keyslot" aria-hidden="true"><span class="lang__cap keycap" /></span>
    <span class="lang__opt" :class="{ 'is-on': lang === 'de' }">de</span>
    <span class="sr-only">: {{ t('lang.other') }}</span>
  </NuxtLink>
</template>

<style scoped>
.lang {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--layout-tap);
  text-decoration: none;
  user-select: none;
}

.lang__opt { color: var(--ink-muted); transition: color 200ms var(--motion-ease); }

.lang__opt.is-on { color: var(--ink); }

.lang__slot { --slot-inset: 0; display: block; width: 2.6rem; height: 1.5rem; }

.lang__cap { top: 0.2rem; left: 0.2rem; width: 1.3rem; height: 0.95rem; }

.lang--de .lang__cap { transform: translateX(0.9rem); }

.lang:active .lang__cap { transform: translateY(1.5px); }

.lang--de:active .lang__cap { transform: translate(0.9rem, 1.5px); }

.lang:hover .lang__opt:not(.is-on) { color: var(--ink); }

.lang:focus-visible { border-radius: var(--radius-pill); }
</style>
