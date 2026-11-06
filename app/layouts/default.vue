<script setup lang="ts">
const { t } = useLang()
</script>

<template>
  <a href="#main" class="skip-link">{{ t('skip') }}</a>
  <SiteHeader />
  <main id="main" tabindex="-1">
    <slot />
  </main>
  <SiteFooter />
  <SetupPanel />
</template>
