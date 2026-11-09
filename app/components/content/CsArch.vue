<script setup lang="ts">
// A system architecture drawn in HTML: a row of nodes joined by labelled two-way links, plus
// one node branching off below. Real text, themable, readable at 390px. From Markdown:
//
// ::cs-arch
// ---
// label: …
// caption: …
// nodes:
//   - title: ESP32
//     detail: …
//     link: MQTT          # label on the link to the next node (optional)
//     note: …             # small text under that label (optional)
// branch:
//   from: 2               # index of the node it hangs off
//   title: Frontend
//   detail: …
//   link: HTTPS
//   note: …
// ---
// ::
interface ArchNode { title: string; detail?: string; link?: string; note?: string; accent?: boolean }
interface Branch extends ArchNode { from: number }
const props = defineProps<{ nodes: ArchNode[]; branch?: Branch; caption?: string; label?: string }>()
const { lang } = useLang()
const w = computed(() => (lang.value === 'de' ? { to: 'zum', both: 'in beide Richtungen' } : { to: 'to', both: 'two-way' }))
// Desktop grid: node, link, node, link, … so node i sits in column 2i+1.
const cols = computed(() => props.nodes.map(() => 'minmax(0, 1fr)').join(' 6.5rem '))
const branchCol = computed(() => (props.branch ? props.branch.from * 2 + 1 : 1))
</script>

<template>
  <figure class="arch">
    <div class="arch__board" role="group" :aria-label="label ?? caption" :style="{ '--arch-cols': cols, '--arch-branch': branchCol }">
      <template v-for="(n, i) in nodes" :key="i">
        <div class="arch__node" :class="{ 'arch__node--accent': n.accent }" :style="{ '--col': i * 2 + 1 }">
          <strong class="arch__title"><Txt :text="n.title" /></strong>
          <span v-if="n.detail" class="arch__detail muted"><Txt :text="n.detail" /></span>
        </div>
        <div v-if="i < nodes.length - 1" class="arch__link" :style="{ '--col': i * 2 + 2 }">
          <span v-if="n.link" class="arch__proto t-mono">{{ n.link }}</span>
          <span class="arch__arrow" aria-hidden="true" />
          <span v-if="n.note" class="arch__note muted"><Txt :text="n.note" /></span>
          <span class="sr-only">{{ n.link ? `${n.link}, ` : '' }}{{ w.both }}</span>
        </div>
      </template>
      <template v-if="branch">
        <div class="arch__link arch__link--down">
          <span v-if="branch.link" class="arch__proto t-mono">{{ branch.link }}<span class="arch__to" aria-hidden="true">, {{ w.to }} {{ nodes[branch.from]?.title }}</span></span>
          <span class="arch__arrow" aria-hidden="true" />
          <span v-if="branch.note" class="arch__note muted"><Txt :text="branch.note" /></span>
          <span class="sr-only">{{ w.to }} {{ nodes[branch.from]?.title }}, {{ w.both }}</span>
        </div>
        <div class="arch__node arch__node--branch" :class="{ 'arch__node--accent': branch.accent }">
          <strong class="arch__title"><Txt :text="branch.title" /></strong>
          <span v-if="branch.detail" class="arch__detail muted"><Txt :text="branch.detail" /></span>
        </div>
      </template>
    </div>
    <figcaption v-if="caption" class="t-small muted">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.arch { display: grid; gap: var(--space-4); margin: 0; container-type: inline-size; }

/* Phones: one column, top to bottom. The branch comes last, its link says where it joins. */
.arch__link--down { margin-top: var(--space-4); border-top: 1px dashed var(--line-strong); }

.arch__board {
  display: grid;
  justify-items: stretch;
  padding: var(--space-6);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-card);
  background:
    radial-gradient(circle at 1px 1px, var(--line) 1px, transparent 0) 0 0 / 16px 16px,
    var(--panel);
}

.arch__node {
  display: grid;
  gap: var(--space-1);
  align-content: center;
  padding: var(--space-4);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-media);
  background: var(--bg);
}

.arch__node--accent { border-color: var(--signal); box-shadow: inset 0 0 0 1px var(--signal); }

.arch__title { font-family: var(--font-display); font-size: var(--text-heading); letter-spacing: var(--tracking-heading); line-height: 1.2; }

.arch__detail { font-size: var(--text-small); line-height: 1.4; }

.arch__link {
  display: grid;
  justify-items: center;
  gap: var(--space-1);
  padding-block: var(--space-3);
  text-align: center;
}

.arch__proto { color: var(--signal); }

.arch__note { max-width: 30ch; font-size: var(--text-small); line-height: 1.35; }

/* Two-way arrow: vertical here, horizontal on the wide board. */
.arch__arrow { position: relative; width: 1px; height: 1.75rem; background: var(--signal); }

.arch__arrow::before,
.arch__arrow::after {
  content: "";
  position: absolute;
  left: 50%;
  width: 0.45rem;
  height: 0.45rem;
  border: solid var(--signal);
  border-width: 1px 0 0 1px;
}

.arch__arrow::before { top: 0; transform: translateX(-50%) rotate(45deg); }

.arch__arrow::after { bottom: 0; transform: translateX(-50%) rotate(225deg); }

@container (width >= 44rem) {
  .arch__board {
    grid-template-columns: var(--arch-cols);
    grid-template-rows: auto auto auto;
    align-items: stretch;
    padding: var(--space-6);
  }

  .arch__node { padding: var(--space-3); }

  .arch__title { font-size: var(--text-body); }

  .arch__node, .arch__link { grid-row: 1; grid-column: var(--col); }

  .arch__link { align-content: center; padding: 0 var(--space-1); }

  .arch__link .arch__arrow { width: 100%; height: 1px; }

  .arch__link .arch__arrow::before { top: 50%; left: 0; transform: translateY(-50%) rotate(-45deg); }

  .arch__link .arch__arrow::after { top: 50%; bottom: auto; left: auto; right: 0; transform: translateY(-50%) rotate(135deg); }

  .arch__note { max-width: 12ch; }

  /* The branch hangs straight down from its node. */
  .arch__link--down, .arch__node--branch { grid-column: var(--arch-branch); }

  .arch__link--down { grid-row: 2; padding: var(--space-3) 0; min-width: 0; margin-top: 0; border-top: 0; }

  .arch__link--down .arch__arrow { width: 1px; height: 2rem; }

  .arch__link--down .arch__arrow::before { top: 0; left: 50%; transform: translateX(-50%) rotate(45deg); }

  .arch__link--down .arch__arrow::after { top: auto; bottom: 0; left: 50%; right: auto; transform: translateX(-50%) rotate(225deg); }

  .arch__link--down .arch__note { max-width: 32ch; }

  /* The branch box is wider than its column so its text has room; it starts under its node. */
  .arch__node--branch { grid-row: 3; grid-column: var(--arch-branch) / span 3; }

  .arch__to { display: none; }
}
</style>
