// Open Graph images (1200×630), one per page, in the WORK palette.
// Run locally (`npm run og`) and commit public/og/: rendering text needs the system fonts
// on this Mac (Helvetica Neue, Menlo), which a Linux CI box doesn't have.
import sharp from 'sharp'
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = (p) => fileURLToPath(new URL(p, import.meta.url))
// Values from tokens/dist.json, so OG images match the site.
const T = JSON.parse(await readFile(here('../tokens/dist.json'), 'utf8'))
const C = { bg: T.bg, ink: T.ink, muted: T['ink-muted'], accent: T.signal, line: T.line }
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const wrap = (text, max) => {
  const lines = []; let line = ''
  for (const w of text.split(/\s+/)) {
    if ((line + ' ' + w).trim().length > max) { lines.push(line.trim()); line = w } else line += ' ' + w
  }
  if (line.trim()) lines.push(line.trim())
  return lines
}

function card({ eyebrow, title, body, withPortrait }) {
  const titleLines = wrap(title, withPortrait ? 16 : 24).slice(0, 3)
  const titleSize = titleLines.length > 2 ? 68 : 84
  const bodyLines = wrap(body, withPortrait ? 38 : 56).slice(0, 3)
  const titleY = 230
  const bodyY = titleY + titleLines.length * titleSize * 1.02 + 30
  const ascii = ''
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${C.bg}"/>
  <text x="72" y="96" font-family="Menlo, monospace" font-size="22" letter-spacing="1" fill="${C.muted}">${esc(eyebrow)}</text>
  <g font-family="Helvetica Neue, Helvetica, sans-serif" font-weight="700" font-size="${titleSize}" letter-spacing="-2.5" fill="${C.ink}">
    ${titleLines.map((l, i) => `<text x="68" y="${titleY + i * titleSize * 1.02}">${esc(l)}</text>`).join('')}
  </g>
  <g font-family="Helvetica Neue, Helvetica, sans-serif" font-size="30" fill="${C.muted}">
    ${bodyLines.map((l, i) => `<text x="72" y="${bodyY + i * 40}">${esc(l)}</text>`).join('')}
  </g>
  ${ascii}
  <line x1="72" y1="548" x2="1128" y2="548" stroke="${C.ink}" stroke-width="2"/>
  <circle cx="80" cy="585" r="6" fill="${C.accent}"/>
  <text x="98" y="593" font-family="Menlo, monospace" font-size="22" fill="${C.ink}">status: ok</text>
  <text x="1128" y="593" text-anchor="end" font-family="Menlo, monospace" font-size="22" fill="${C.ink}">vedunov.com</text>
</svg>`)
}

const pages = [
  { slug: 'home', eyebrow: 'Stepan Vedunov · Zurich', title: 'Product designer who builds the bridge to code.', body: 'SDA Bachelor Design Award 2025 · Dezeen School Shows · CHF 160k+ raised for Kymu', withPortrait: true },
  { slug: 'about', eyebrow: 'About', title: "Hi, I'm Stepan.", body: 'Product designer in Zurich. OWT 80% · Kymu 20%.', withPortrait: true },
  { slug: 'colophon', eyebrow: 'Colophon', title: 'How this works', body: 'The status: ok switch swaps one set of design tokens for another. Nothing else.' },
]
const files = []
const walk = async (d) => { for (const e of await readdir(d, { withFileTypes: true })) e.isDirectory() ? await walk(join(d, e.name)) : e.name.endsWith('.md') && files.push(join(d, e.name)) }
await walk(here('../content/work'))
for (const f of files) {
  const fm = ((await readFile(f, 'utf8')).match(/^---\n([\s\S]*?)\n---/) ?? [, ''])[1]
  const get = (k) => (fm.match(new RegExp(`^${k}:\\s*(.*)$`, 'm'))?.[1] ?? '').replace(/^"|"$/g, '')
  const archive = get('tier') === 'archive'
  pages.push({ slug: basename(f, '.md').replace(/^\d+\./, ''), eyebrow: `${archive ? 'Archive' : 'Case study'} · ${get('org') || 'Stepan Vedunov'}`, title: get('title'), body: get('outcome') })
}

await mkdir(here('../public/og'), { recursive: true })
for (const p of pages) {
  await sharp(card(p)).png({ compressionLevel: 9, palette: true }).toFile(here(`../public/og/${p.slug}.png`))
  console.log(`og → public/og/${p.slug}.png`)
}
