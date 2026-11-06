// WCAG 2.2 contrast gate for every semantic text/background pair.
// Fails the build (exit 1) if any pair drops below its threshold.
import { readFile } from 'node:fs/promises'

const tokens = JSON.parse(await readFile(new URL('../tokens/dist.json', import.meta.url), 'utf8'))

// [foreground, background, minimum ratio, why]
const PAIRS = [
  ['ink', 'bg', 4.5, 'body text'],
  ['ink', 'panel', 4.5, 'text on grey panels and inputs'],
  ['ink-muted', 'bg', 4.5, 'secondary text, nav, mono labels'],
  ['ink-muted', 'panel', 4.5, 'secondary text on panels'],
  ['line-strong', 'bg', 3, 'input and switch borders'],
  ['line-strong', 'panel', 3, 'borders on panels'],
  ['signal', 'bg', 3, 'switch cap, focus ring'],
  ['signal', 'panel', 3, 'focus ring on panels'],
  ['switch', 'bg', 3, 'read-mode switch keycap'],
  ['switch', 'panel', 3, 'switch keycap in its slot'],
  ['ink', 'tile', 4.5, 'text on side-project tiles'],
  ['signal', 'tile', 3, 'orange parts and focus ring on tiles'],
  ['on-media', '#737373', 4.5, 'card text on the scrim, worst case (55% black over white)'],
]
const lum = (hex) => {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

let failed = 0
const val = (k) => (k.startsWith('#') ? k : tokens[k])
for (const [fg, bg, min, why] of PAIRS) {
  const r = ratio(val(fg), val(bg))
  const ok = r >= min
  if (!ok) failed++
  console.log(`${ok ? '✓' : '✗'} ${fg.padEnd(12)} on ${bg.padEnd(8)} ${r.toFixed(2).padStart(5)} : 1  (min ${min}, ${why})`)
}
if (failed) {
  console.error(`\n${failed} pair(s) below WCAG AA.`)
  process.exit(1)
}
