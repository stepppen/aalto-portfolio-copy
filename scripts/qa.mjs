// QA against the static build (dist/), served locally:
//   node scripts/qa.mjs axe        → axe-core (WCAG 2.2 A/AA) on every page at 390 and 1440
//   node scripts/qa.mjs keyboard   → Tab order on the home page, with focus visibility check
//   node scripts/qa.mjs links      → every internal link/asset resolves; external links answer
// Pages come from dist/sitemap.xml. Uses headless Chrome over CDP; no extra test framework.
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const BASE = process.env.BASE ?? 'http://localhost:4173'
const task = process.argv[2] ?? 'axe'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8')
const paths = [...sitemap.matchAll(/<loc>https:\/\/vedunov\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/')

const PORT = 9300 + (process.pid % 600)
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${tmpdir()}/qa-${process.pid}`, 'about:blank'], { stdio: 'ignore' })
let target
for (let i = 0; i < 50 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page') } catch { await sleep(200) } }
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0
const pending = new Map()
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); pending.delete(m.id) })
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, (m) => r(m.result ?? m)); ws.send(JSON.stringify({ id, method, params })) })
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value
const open = async (url, width) => {
  await send('Emulation.setDeviceMetricsOverride', { width, height: width < 768 ? 844 : 900, deviceScaleFactor: 1, mobile: width < 768 })
  await send('Page.navigate', { url })
  await sleep(1500)
}

let failures = 0
if (task === 'axe') {
  const axeSrc = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8')
  for (const width of [390, 1440]) for (const p of paths) {
    await open(`${BASE}${p}`, width)
    await evaluate(axeSrc)
    const res = await evaluate(`axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] } }).then(r => r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, help: v.help, target: v.nodes.slice(0,3).map(n => n.target.join(' ')) })))`)
    const tag = `${String(width).padStart(4)} ${p}`
    if (!res?.length) { console.log(`✓ ${tag}`); continue }
    failures += res.length
    console.log(`✗ ${tag}`)
    for (const v of res) console.log(`    ${v.impact} ${v.id} ×${v.n}: ${v.help}\n      ${v.target.join('\n      ')}`)
  }
}

if (task === 'keyboard') {
  for (const width of [390, 1440]) {
    await open(`${BASE}/`, width)
    console.log(`\nTab order, home, ${width}px:`)
    const seen = []
    for (let i = 0; i < 40; i++) {
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      const f = await evaluate(`(() => { const e = document.activeElement; const s = getComputedStyle(e); const r = e.getBoundingClientRect();
        const visibleFocus = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 || !!e.closest('.work__row:has(:focus-visible)');
        return { tag: e.tagName, text: (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\\s+/g,' ').slice(0, 50), role: e.getAttribute('role'), visibleFocus, w: Math.round(r.width), h: Math.round(r.height) } })()`)
      const small = f.w < 24 || f.h < 24
      if (!f.visibleFocus || small) failures++
      seen.push(f)
      console.log(`  ${String(i + 1).padStart(2)} ${f.visibleFocus ? '✓' : '✗ no visible focus'} ${small ? `✗ target ${f.w}×${f.h}` : ''} ${f.tag}${f.role ? `[${f.role}]` : ''} "${f.text}"`)
      if (f.tag === 'BODY') break
    }
    // The read-mode switch lives on case studies (Phase 4); checked there.
  }
}

if (task === 'links') {
  const checked = new Map()
  const external = new Set()
  for (const p of paths) {
    await open(`${BASE}${p}`, 1440)
    const urls = await evaluate(`[...new Set([...document.querySelectorAll('a[href], img[src], link[rel=icon], link[rel=canonical]')].map(e => e.href || e.src).concat([...document.querySelectorAll('img[srcset]')].flatMap(i => i.srcset.split(',').map(s => new URL(s.trim().split(' ')[0], location.href).href))))]`)
    for (const u of urls) {
      if (u.startsWith('mailto:') || u.startsWith('tel:')) continue
      const url = new URL(u)
      if (url.hostname === 'vedunov.com') { checked.set(u, checked.get(u) ?? 'canonical (prod host)'); continue }
      if (url.origin !== new URL(BASE).origin) { external.add(url.href); continue }
      if (checked.has(url.pathname)) continue
      const r = await fetch(BASE + url.pathname, { redirect: 'manual' })
      checked.set(url.pathname, r.status)
      if (r.status >= 400) { failures++; console.log(`✗ ${r.status} ${url.pathname}  (on ${p})`) }
    }
  }
  console.log(`internal: ${[...checked.values()].filter((s) => typeof s === 'number').length} checked`)
  for (const u of external) {
    let s
    try { s = (await fetch(u, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (link check)' }, signal: AbortSignal.timeout(10000) })).status } catch (e) { s = e.name }
    const ok = typeof s === 'number' && s < 400
    if (!ok) failures++
    console.log(`${ok ? '✓' : '✗'} ${s} ${u}`)
  }
}

ws.close()
chrome.kill('SIGKILL')
console.log(`\n${failures ? `✗ ${failures} issue(s)` : '✓ no issues'}`)
process.exit(failures ? 1 : 0)
