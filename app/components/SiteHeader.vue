<script setup lang="ts">
// Header: name left, nav right. On phones the nav lives in a menu behind a round button.
// The button is fixed, so it stays in reach while scrolling; on wider screens it only
// appears once the header has scrolled away. The menu opens as a frosted card under it.
const { data } = await useSite()
const route = useRoute()
const { t, lp } = useLang()
const current = (to: string) => (route.path === lp(to) || route.path.startsWith(`${lp(to)}/`) ? 'page' : undefined)
const home = computed(() => (route.path === lp('/') ? 'page' : undefined))

const open = ref(false)
const scrolled = ref(false)
const button = ref<HTMLButtonElement>()
const menu = ref<HTMLElement>()

function close(focusButton = false) {
  open.value = false
  if (focusButton) button.value?.focus()
}
watch(() => route.fullPath, () => close())

function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && open.value) close(true) }
function onDown(e: PointerEvent) {
  if (!open.value) return
  const target = e.target as Node
  if (!menu.value?.contains(target) && !button.value?.contains(target)) close()
}
function onScroll() {
  scrolled.value = window.scrollY > 160
  if (!scrolled.value && open.value && matchMedia('(width >= 48rem)').matches) close()
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  window.addEventListener('pointerdown', onDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('pointerdown', onDown)
})
</script>

<template>
  <header class="header container">
    <NuxtLink :to="lp('/')" class="header__name">Stepan Vedunov</NuxtLink>
    <nav class="header__wide" :aria-label="t('nav.main')">
      <ul class="header__nav hover-dim t-mono" role="list">
        <li><NuxtLink :to="lp('/about')" class="header__link" :aria-current="current('/about')">{{ t('nav.about') }}</NuxtLink></li>
        <li><NuxtLink :to="lp('/work')" class="header__link" :aria-current="current('/work')">{{ t('nav.work') }}</NuxtLink></li>
        <li v-if="data?.hasNotes"><NuxtLink :to="lp('/notes')" class="header__link" :aria-current="current('/notes')">{{ t('nav.notes') }}</NuxtLink></li>
        <li class="header__lang-item"><LangSwitch /></li>
      </ul>
    </nav>

    <div class="menu" :class="{ 'is-open': open, 'is-scrolled': scrolled }">
      <button
        ref="button"
        type="button"
        class="menu__button"
        :aria-expanded="open"
        aria-controls="site-menu"
        @click="open = !open"
      >
        <span class="menu__icon" aria-hidden="true"><span /><span /></span>
        <span class="sr-only">{{ open ? t('menu.close') : t('menu.open') }}</span>
      </button>
      <nav id="site-menu" ref="menu" class="menu__card" :aria-label="t('nav.main')" :inert="!open || undefined">
        <ul class="menu__list" role="list">
          <li><NuxtLink :to="lp('/')" class="menu__link" :aria-current="home">{{ t('nav.home') }}</NuxtLink></li>
          <li><NuxtLink :to="lp('/work')" class="menu__link" :aria-current="current('/work')">{{ t('nav.work') }}</NuxtLink></li>
          <li><NuxtLink :to="lp('/about')" class="menu__link" :aria-current="current('/about')">{{ t('nav.about') }}</NuxtLink></li>
          <li v-if="data?.hasNotes"><NuxtLink :to="lp('/notes')" class="menu__link" :aria-current="current('/notes')">{{ t('nav.notes') }}</NuxtLink></li>
        </ul>
        <div class="menu__foot"><LangSwitch /></div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
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

/* Wide nav: hidden on phones, where the menu button takes over. */
.header__wide { display: none; }

.header__nav { display: flex; align-items: center; gap: var(--space-1); padding: 0; margin-right: calc(-1 * var(--space-2)); font-size: var(--text-small); white-space: nowrap; list-style: none; }

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

.header__lang-item { margin-left: var(--space-2); }

/* The menu: a fixed round button, top right, lined up with the header. */
.menu {
  --menu-right: max(var(--layout-margin), calc((100vw - var(--layout-max)) / 2 + var(--layout-margin)));
  position: fixed;
  top: var(--space-4);
  right: var(--menu-right);
  z-index: 50;
}

.menu__button {
  display: grid;
  place-items: center;
  width: var(--layout-tap);
  height: var(--layout-tap);
  padding: 0;
  border: 0;
  border-radius: 50%;
  /* Solid, not frosted: a backdrop blur on a fixed button has to be redrawn on every scroll
     frame from whatever moves under it, and that made the page flicker while scrolling. */
  background: var(--panel);
  box-shadow: 0 0 0 1px var(--line), 0 2px 8px color-mix(in srgb, var(--ink) 8%, transparent);
  color: var(--ink);
  cursor: pointer;
  transition: background-color 200ms var(--motion-ease), color 200ms var(--motion-ease), opacity 250ms var(--motion-ease), transform 250ms var(--motion-ease);
}

.menu__button:hover { background: color-mix(in srgb, var(--ink) 8%, var(--panel)); }

.is-open .menu__button { background: var(--ink); color: var(--bg); }

/* Two short lines that cross into an ×. */
.menu__icon { position: relative; display: block; width: 1rem; height: 0.6rem; }

.menu__icon span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5px;
  border-radius: 1px;
  background: currentcolor;
  transition: transform 250ms var(--motion-ease), top 250ms var(--motion-ease), width 250ms var(--motion-ease);
}

.menu__icon span:first-child { top: 0; }

.menu__icon span:last-child { top: calc(100% - 1.5px); left: auto; right: 0; width: 70%; }

.is-open .menu__icon span:first-child { top: calc(50% - 0.75px); transform: rotate(45deg); }

.is-open .menu__icon span:last-child { top: calc(50% - 0.75px); width: 100%; transform: rotate(-45deg); }

/* The card: frosted glass that drops from the button. */
.menu__card {
  position: absolute;
  top: calc(100% + var(--space-2));
  right: 0;
  display: grid;
  gap: var(--space-2);
  min-width: 13.5rem;
  padding: var(--space-3) var(--space-3) var(--space-2);
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  box-shadow: 0 1rem 2.5rem color-mix(in srgb, var(--ink) 12%, transparent);
  transform-origin: top right;
  opacity: 0;
  visibility: hidden;
  transform: scale(0.96) translateY(-0.25rem);
  filter: blur(4px);
  transition: opacity 200ms var(--motion-ease), transform 250ms var(--motion-ease), filter 250ms var(--motion-ease), visibility 0s linear 250ms;
}

.is-open .menu__card {
  opacity: 1;
  visibility: visible;
  transform: none;
  filter: none;
  /* Frosted only while open: a hidden card with a backdrop blur still costs a repaint per scroll frame. */
  backdrop-filter: blur(20px) saturate(1.4);
  transition: opacity 200ms var(--motion-ease), transform 250ms var(--motion-ease), filter 250ms var(--motion-ease), visibility 0s;
}

.menu__list { display: grid; padding: 0; margin: 0; list-style: none; }

.menu__link {
  display: flex;
  align-items: center;
  min-height: var(--layout-tap);
  padding-inline: var(--space-3);
  border-radius: var(--radius-control);
  color: var(--ink-muted);
  font-size: var(--text-heading);
  letter-spacing: var(--tracking-heading);
  text-decoration: none;
}

.menu__link:hover { background: color-mix(in srgb, var(--ink) 5%, transparent); color: var(--ink); }

.menu__link[aria-current="page"] { color: var(--ink); }

.menu__foot { padding: var(--space-2) var(--space-3) 0; border-top: 1px solid var(--line); }

@media (prefers-reduced-motion: reduce) {
  .menu__card, .is-open .menu__card { transform: none; filter: none; }
}

/* Wider screens: the inline nav is back, and the button only shows once the header is gone. */
@media (width >= 48rem) {
  .header__wide { display: block; }

  .menu { visibility: hidden; transition: visibility 0s linear 250ms; }

  .menu.is-scrolled { visibility: visible; transition-delay: 0s; }

  .menu:not(.is-scrolled) .menu__button { opacity: 0; transform: scale(0.8); }
}
</style>
