// Renders each live tile's poster from its own scene (/work?poster=1), at 2× for retina,
// into public/tiles/<scene>.webp. Run after changing a tile scene: `npm run posters`
// (needs the dev server on :3000 and Google Chrome). Posters are committed.
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import sharp from 'sharp'

const BASE = process.env.BASE ?? 'http://localhost:3000'
const PORT = 9300 + (process.pid % 600)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${tmpdir()}/posters-${process.pid}`, 'about:blank'], { stdio: 'ignore' })
let target
for (let i = 0; i < 50 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page') } catch { await sleep(200) } }
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0
const pending = new Map()
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m.result); pending.delete(m.id) })
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })) })
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value

await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false })
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await send('Page.navigate', { url: `${BASE}/work?poster=1` })
await sleep(2500)
await evaluate(`document.querySelector('.work__tiles').scrollIntoView({ block: 'center' })`)
for (let i = 0; i < 40; i++) { if (await evaluate(`[...document.querySelectorAll('.tile__stage.is-interactive')].every((t) => t.dataset.posterReady)`)) break; await sleep(250) }
const shots = await evaluate(`[...document.querySelectorAll('.tile__stage.is-interactive')].map((t) => [t.closest('figure').dataset.scene, t.querySelector('canvas')?.toDataURL('image/png')])`)
await mkdir(new URL('../public/tiles', import.meta.url), { recursive: true })
for (const [scene, url] of shots) {
  if (!url) { console.log(`✗ ${scene}: no canvas`); continue }
  const out = new URL(`../public/tiles/${scene}.webp`, import.meta.url).pathname
  await sharp(Buffer.from(url.split(',')[1], 'base64')).webp({ quality: 82, alphaQuality: 90 }).toFile(out)
  const m = await sharp(out).metadata()
  console.log(`poster → public/tiles/${scene}.webp (${m.width}×${m.height})`)
}
ws.close()
chrome.kill('SIGKILL')
