<script setup lang="ts">
const { data } = await useSite()
const route = useRoute()
const { t, lp, lang, other } = useLang()
const current = (to: string) => (route.path === lp(to) || route.path.startsWith(`${lp(to)}/`) ? 'page' : undefined)
</script>

<template>
  <header class="header container">
    <NuxtLink :to="lp('/')" class="header__name">Stepan Vedunov</NuxtLink>
    <nav :aria-label="t('nav.main')">
      <ul class="header__nav hover-dim t-mono" role="list">
        <li><NuxtLink :to="lp('/about')" class="header__link" :aria-current="current('/about')">{{ t('nav.about') }}</NuxtLink></li>
        <li><NuxtLink :to="lp('/work')" class="header__link" :aria-current="current('/work')">{{ t('nav.work') }}</NuxtLink></li>
        <li v-if="data?.hasNotes"><NuxtLink :to="lp('/notes')" class="header__link" :aria-current="current('/notes')">{{ t('nav.notes') }}</NuxtLink></li>
        <li class="header__lang-item">
          <!-- One button-like link: the current language is lit, the other is where it goes. -->
          <NuxtLink
            :to="other"
            class="lang"
            :class="`lang--${lang}`"
            :hreflang="lang === 'de' ? 'en' : 'de-CH'"
            :lang="lang === 'de' ? 'en' : 'de-CH'"
          >
            <span class="lang__opt" :class="{ 'is-on': lang === 'en' }">en</span>
            <span class="lang__slot keyslot" aria-hidden="true"><span class="lang__cap keycap" /></span>
            <span class="lang__opt" :class="{ 'is-on': lang === 'de' }">de</span>
            <span class="sr-only">: {{ t('lang.other') }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0 var(--space-4);
  padding-block: var(--space-4);
}

.header__name {
  display: inline-flex;
  align-items: center;
  min-height: var(--layout-tap);
  color: var(--ink-muted);
  font-size: var(--text-heading);
  letter-spacing: var(--tracking-heading);
  text-decoration: none;
}

.header__name:hover { color: var(--ink); }

.header__nav { display: flex; gap: var(--space-1); padding: 0; margin-right: calc(-1 * var(--space-2)); list-style: none; }

.header__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--layout-tap);
  min-height: var(--layout-tap);
  padding-inline: var(--space-2);
  color: var(--ink-muted);
  text-decoration: none;
}

.header__link:hover, .header__link[aria-current="page"] { color: var(--ink); }

.header__nav { font-size: var(--text-small); align-items: center; white-space: nowrap; }

@media (width < 30rem) {
  .header__nav { font-size: var(--text-mono); gap: 0; }

  .header__link { padding-inline: var(--space-1); }

  .header__lang-item { margin-left: var(--space-1); }
}

.header__lang-item { margin-left: var(--space-2); }

/* Language switch: the same red-orange keycap as the read-mode switch, smaller.
   The header stays mounted across pages, so the cap slides over when the language changes. */
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
