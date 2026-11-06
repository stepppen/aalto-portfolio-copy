<script setup lang="ts">
import type { NuxtError } from '#app'
const props = defineProps<{ error: NuxtError }>()
const { t, lp } = useLang()
useHead({ title: props.error.statusCode === 404 ? t('error.notFound') : t('error.error') })
</script>

<template>
  <NuxtLayout>
    <section class="container section">
      <p class="t-mono muted">{{ error.statusCode }}</p>
      <h1 class="t-title">{{ error.statusCode === 404 ? t('error.lost') : t('error.broke') }}</h1>
      <p class="t-lead muted" style="margin-top: var(--space-6)">
        <NuxtLink class="link-quiet" :to="lp('/')" @click.prevent="clearError({ redirect: lp('/') })">{{ t('error.home') }}</NuxtLink>
      </p>
    </section>
  </NuxtLayout>
</template>
