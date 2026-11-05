<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <SiteHeader />
  <main id="main" tabindex="-1">
    <slot />
  </main>
  <SiteFooter />
  <SetupPanel />
</template>
