<script setup lang="ts">
// A flow diagram built from HTML, not an image: real text, readable at 390px, and it
// follows the WORK/LIFE tokens like everything else. Used from Markdown with YAML props:
//
// ::cs-diagram
// ---
// caption: …
// steps:
//   - title: Figma variables
//     detail: …
//     items: [App A, App B]   # optional fan-out
// ---
// ::
interface Step { title: string; detail?: string; items?: string[]; accent?: boolean }
defineProps<{ steps: Step[]; caption?: string; label?: string }>()
</script>

<template>
  <figure class="diagram">
    <ol class="diagram__steps" role="list" :aria-label="label ?? caption">
      <li v-for="(s, i) in steps" :key="i" class="diagram__step" :class="{ 'diagram__step--accent': s.accent }">
        <span class="diagram__n t-mono muted">{{ String(i + 1).padStart(2, '0') }}</span>
        <strong class="diagram__title"><Txt :text="s.title" /></strong>
        <span v-if="s.detail" class="diagram__detail t-small muted"><Txt :text="s.detail" /></span>
        <ul v-if="s.items?.length" class="diagram__items" role="list">
          <li v-for="it in s.items" :key="it" class="t-mono">{{ it }}</li>
        </ul>
      </li>
    </ol>
    <figcaption v-if="caption" class="t-small muted">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.diagram { display: grid; gap: var(--space-4); margin: 0; }

.diagram__steps {
  display: grid;
  gap: var(--space-6);
  padding: var(--space-6);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-card);
  list-style: none;
  background:
    radial-gradient(circle at 1px 1px, var(--line) 1px, transparent 0) 0 0 / 16px 16px,
    var(--panel);
}

.diagram__step {
  position: relative;
  display: grid;
  gap: var(--space-1);
  align-content: start;
  padding: var(--space-4);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-media);
  background: var(--bg);
}

.diagram__step--accent { border-color: var(--signal); box-shadow: inset 0 0 0 1px var(--signal); }

/* Arrow to the next step: down on mobile, right on desktop. */
.diagram__step:not(:last-child)::after {
  content: "↓";
  position: absolute;
  left: 50%;
  bottom: calc(-1 * var(--space-6));
  transform: translate(-50%, 15%);
  color: var(--signal);
  font-family: var(--font-mono);
}

.diagram__title { font-weight: 600; }

.diagram__items { display: flex; flex-wrap: wrap; gap: var(--space-2); padding: 0; margin-top: var(--space-2); list-style: none; }

.diagram__items li {
  padding: 0.15em 0.5em;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-media);
  text-transform: none;
  letter-spacing: 0;
}

@media (width >= 64rem) {
  .diagram__steps { grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: var(--space-8); }

  .diagram__step:not(:last-child)::after {
    content: "→";
    left: auto;
    right: calc(-1 * var(--space-8));
    bottom: auto;
    top: 50%;
    width: var(--space-8);
    text-align: center;
    transform: translateY(-50%);
  }
}
</style>
