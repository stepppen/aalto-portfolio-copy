<script setup lang="ts">
// Renders content text and turns any "[TODO: …]" into a visible placeholder tag (shown as "todo: …").
const props = defineProps<{ text?: unknown }>()
const asText = (t: unknown) => { if (import.meta.dev && typeof t !== 'string' && t != null) console.warn('[Txt] non-string', JSON.stringify(t)); return typeof t === 'string' ? t : t == null ? '' : String(t) }
const parts = computed(() =>
  asText(props.text).split(/(\[TODO:[^\]]*\])/g).filter(Boolean).map((p) => ({
    todo: p.startsWith('[TODO:'),
    value: p.startsWith('[TODO:') ? `todo:${p.slice(6, -1)}` : p, // shown lowercase: no caps in the UI
  })),
)
</script>

<template>
  <template v-for="(p, i) in parts" :key="i">
    <span v-if="p.todo" class="todo">{{ p.value }}</span>
    <template v-else>{{ p.value }}</template>
  </template>
</template>
