<script setup lang="ts">
const { data } = await useSite()
const route = useRoute()
const current = (to: string) => (route.path === to || route.path.startsWith(`${to}/`) ? 'page' : undefined)
</script>

<template>
  <header class="header container">
    <NuxtLink to="/" class="header__name">Stepan Vedunov</NuxtLink>
    <nav aria-label="Main">
      <ul class="header__nav hover-dim t-mono" role="list">
        <li><NuxtLink to="/about" class="header__link" :aria-current="current('/about')">About</NuxtLink></li>
        <li><NuxtLink to="/work" class="header__link" :aria-current="current('/work')">Work</NuxtLink></li>
        <li v-if="data?.hasNotes"><NuxtLink to="/notes" class="header__link" :aria-current="current('/notes')">Notes</NuxtLink></li>
        <li>
          <a :href="data?.site.cv" class="header__link" download="Stepan_Vedunov_CV.pdf" type="application/pdf">CV<span class="sr-only"> (PDF download)</span></a>
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

.header__nav { font-size: var(--text-small); }
</style>
