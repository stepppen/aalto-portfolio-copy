// Lighthouse (mobile, default throttling) on every page in the sitemap.
// Needs `npx serve dist -l 4173` running. Reports go to docs/qa/lighthouse/.
import { execFileSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'

const BASE = process.env.BASE ?? 'http://localhost:4173'
const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8')
const paths = [...sitemap.matchAll(/<loc>https:\/\/vedunov\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/')
const runs = process.env.PAGES
  ? process.env.PAGES.split(',').map((x) => x.split(':')) // e.g. PAGES=/:work,/work/kymu:life
  : paths.map((p) => [p, 'work'])
const rows = []
// RUNS=3 takes the median of three runs per page: local Lighthouse varies by a few points run to run.
const RUNS = Number(process.env.RUNS ?? 1)
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]
for (const [p, mode] of runs) {
  const name = `${mode}${p.replace(/\//g, '_') || '_home'}`
  const out = new URL(`../docs/qa/lighthouse/${name}`, import.meta.url).pathname
  const samples = []
  for (let i = 0; i < RUNS; i++) {
    execFileSync('npx', ['lighthouse', `${BASE}${p}`, '--quiet', '--output=json', '--output=html', `--output-path=${out}`,
      '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags=--headless=new'], { stdio: 'ignore' })
    const r = JSON.parse(await readFile(`${out}.report.json`, 'utf8'))
    samples.push({
      ...Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)])),
      lcp: r.audits['largest-contentful-paint'].numericValue, cls: r.audits['cumulative-layout-shift'].numericValue,
    })
  }
  const pick = (k) => median(samples.map((x) => x[k]))
  const row = { page: p, mode, performance: pick('performance'), accessibility: pick('accessibility'), 'best-practices': pick('best-practices'), seo: pick('seo'), lcp: `${(pick('lcp') / 1000).toFixed(1)} s`, cls: pick('cls').toFixed(3) }
  rows.push(row)
  console.log(`${p.padEnd(28)} perf ${row.performance}  a11y ${row.accessibility}  bp ${row['best-practices']}  seo ${row.seo}  LCP ${row.lcp}  CLS ${row.cls}${RUNS > 1 ? `  (median of ${RUNS}: perf ${samples.map((x) => x.performance).join('/')})` : ''}`)
}
const md = [`Median of ${RUNS} run(s) per page.`, '', '| Page | Mode | Performance | Accessibility | Best Practices | SEO | LCP | CLS |', '|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.page} | ${r.mode} | ${r.performance} | ${r.accessibility} | ${r['best-practices']} | ${r.seo} | ${r.lcp} | ${r.cls} |`)].join('\n')
if (!process.env.PAGES) {
  // Lowest score per category across all pages → the Setup panel (app/assets/qa.json).
  const qaFile = new URL('../app/assets/qa.json', import.meta.url)
  const qa = JSON.parse(await readFile(qaFile, 'utf8'))
  const min = (k) => Math.min(...rows.map((r) => r[k]))
  qa.lighthouse = { performance: min('performance'), accessibility: min('accessibility'), 'best-practices': min('best-practices'), seo: min('seo'), pages: rows.length }
  qa.measured = new Date().toISOString().slice(0, 10)
  await writeFile(qaFile, JSON.stringify(qa, null, 2) + '\n')
}
if (!process.env.PAGES) await writeFile(new URL('../docs/qa/lighthouse/README.md', import.meta.url), `# Lighthouse (mobile)\n\nLocal run against the static build. Full HTML reports are next to this file.\n\n${md}\n`)
