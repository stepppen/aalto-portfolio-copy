<script setup lang="ts">
import type { NuxtError } from '#app'
const props = defineProps<{ error: NuxtError }>()
useHead({ title: props.error.statusCode === 404 ? 'Not found' : 'Error' })
</script>

<template>
  <NuxtLayout>
    <section class="container section">
      <p class="t-mono muted">{{ error.statusCode }}</p>
      <h1 class="t-title">{{ error.statusCode === 404 ? 'This page wandered off.' : 'Something broke.' }}</h1>
      <p class="t-lead muted" style="margin-top: var(--space-6)">
        <NuxtLink class="link-quiet" to="/" @click.prevent="clearError({ redirect: '/' })">back home</NuxtLink>
      </p>
    </section>
  </NuxtLayout>
</template>
