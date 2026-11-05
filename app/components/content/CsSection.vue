<script setup lang="ts">
// A case-study section: small heading left, text right; media inside breaks out to full width
// on grey panels. In quick read it's collapsed (rm-extra), still in the HTML.
defineProps<{ title: string; n?: string }>()
</script>

<template>
  <section class="cs-section rm-extra" :aria-label="title">
    <h2 class="t-heading">{{ title }}</h2>
    <div class="cs-flow">
      <slot />
    </div>
  </section>
</template>
