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
for (const [p, mode] of runs) {
  const name = `${mode}${p.replace(/\//g, '_') || '_home'}`
  const out = new URL(`../docs/qa/lighthouse/${name}`, import.meta.url).pathname
  execFileSync('npx', ['lighthouse', `${BASE}${p}`, '--quiet', '--output=json', '--output=html', `--output-path=${out}`,
    '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags=--headless=new'], { stdio: 'ignore' })
  const r = JSON.parse(await readFile(`${out}.report.json`, 'utf8'))
  const s = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]))
  const lcp = r.audits['largest-contentful-paint'].displayValue
  const cls = r.audits['cumulative-layout-shift'].displayValue
  rows.push({ page: p, mode, ...s, lcp, cls })
  console.log(`${mode.padEnd(4)} ${p.padEnd(28)} perf ${s.performance}  a11y ${s.accessibility}  bp ${s['best-practices']}  seo ${s.seo}  LCP ${lcp}  CLS ${cls}`)
}
const md = ['| Page | Mode | Performance | Accessibility | Best Practices | SEO | LCP | CLS |', '|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.page} | ${r.mode} | ${r.performance} | ${r.accessibility} | ${r['best-practices']} | ${r.seo} | ${r.lcp} | ${r.cls} |`)].join('\n')
if (!process.env.PAGES) await writeFile(new URL('../docs/qa/lighthouse/README.md', import.meta.url), `# Lighthouse (mobile)\n\nLocal run against the static build. Full HTML reports are next to this file.\n\n${md}\n`)
