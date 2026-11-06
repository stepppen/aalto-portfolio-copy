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

.header__nav { font-size: var(--text-small); align-items: center; }

.header__lang-item { margin-left: var(--space-2); }

/* Language switch: a small pill with a sliding highlight under the current language. */
.lang {
  position: relative;
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  min-height: var(--layout-tap);
  padding: 0 var(--space-1);
  text-decoration: none;
  isolation: isolate;
}

.lang::before {
  content: "";
  position: absolute;
  inset: 0.55rem var(--space-1);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-pill);
  z-index: -2;
}

.lang::after {
  content: "";
  position: absolute;
  top: 0.55rem;
  bottom: 0.55rem;
  left: var(--space-1);
  width: calc(50% - var(--space-1));
  border-radius: var(--radius-pill);
  background: var(--ink);
  z-index: -1;
  transition: transform 320ms var(--motion-spring);
}

.lang--de::after { transform: translateX(100%); }

.lang__opt {
  padding: 0 0.7em;
  color: var(--ink-muted);
  text-align: center;
  transition: color 200ms var(--motion-ease);
}

.lang__opt.is-on { color: var(--bg); }

.lang:hover .lang__opt:not(.is-on) { color: var(--ink); }
</style>
