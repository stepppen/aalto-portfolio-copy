// Screenshots with real device emulation (headless Chrome won't shrink a window below ~500px).
// Usage: node scripts/screenshot.mjs <outDir> <url> <width>[,<width>...] [name]
// Needs Google Chrome installed; no npm dependency (Chrome DevTools Protocol over WebSocket).
// Env: HOVER=<css selector> hovers that element and captures the viewport around it.
// Stills are taken with prefers-reduced-motion so no transition is caught half-way.
// FRAMES=150,350,800 (ms) keeps motion on and captures the viewport at those times after load.
import { spawn } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'

const [outDir, url, widthsArg, name = 'shot'] = process.argv.slice(2)
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9300 + (process.pid % 600) // a fresh port per run, so we never attach to a stale browser
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--hide-scrollbars', `--user-data-dir=${tmpdir()}/cdp-shot-${process.pid}`, 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let target
for (let i = 0; i < 50 && !target; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page') } catch { await sleep(200) }
}
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0
const pending = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (process.env.PROBE && m.method === 'Runtime.exceptionThrown') console.log('EXCEPTION', m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text)
  if (process.env.PROBE && m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) console.log('CONSOLE', m.params.type, m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300))
  pending.get(m.id)?.(m.result); pending.delete(m.id)
})
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })) })

await mkdir(outDir, { recursive: true })
// INITJS="localStorage.setItem('readMode','full')" runs before any page script (e.g. to capture Full story).
if (process.env.INITJS) { await send('Page.enable'); await send('Page.addScriptToEvaluateOnNewDocument', { source: process.env.INITJS }) }
if (process.env.PROBE) await send('Runtime.enable')
for (const w of widthsArg.split(',').map(Number)) {
  const mobile = w < 768
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: mobile ? 844 : 900, deviceScaleFactor: 1, mobile })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: process.env.FRAMES ? 'no-preference' : 'reduce' }] })
  await send('Page.navigate', { url })
  if (process.env.SCROLLTEXT) {
    // SCROLLTEXT="Personal projects" scrolls the first element with that exact text to the top, then captures.
    await send('Runtime.evaluate', { expression: `(() => { const t = [...document.querySelectorAll('*')].find((e) => e.children.length === 0 && e.textContent.trim() === ${JSON.stringify(process.env.SCROLLTEXT)}); t?.scrollIntoView({ block: 'start' }); window.scrollBy(0, -40) })()` })
    await sleep(1500)
    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    const file = `${outDir}/${name}-${w}-section.png`
    await writeFile(file, Buffer.from(data, 'base64'))
    console.log(file)
    continue
  }
  if (process.env.KEY) {
    // KEY=Delete presses a key on the page, then captures the viewport (e.g. to check a dialog).
    await send('Runtime.evaluate', { expression: `window.dispatchEvent(new KeyboardEvent('keydown', { key: ${JSON.stringify(process.env.KEY)}, bubbles: true }))` })
    await sleep(400)
    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    const file = `${outDir}/${name}-${w}-${process.env.KEY.toLowerCase()}.png`
    await writeFile(file, Buffer.from(data, 'base64'))
    console.log(file)
    continue
  }
  if (process.env.PROBE) {
    for (let i = 0; i < 25; i++) {
      const { result: r } = await send('Runtime.evaluate', { expression: process.env.PROBE, returnByValue: true, awaitPromise: true })
      console.log(i * 100, JSON.stringify(r.value))
      await sleep(100)
    }
    continue
  }
  if (process.env.FRAMES) {
    let last = 0
    for (const ms of process.env.FRAMES.split(',').map(Number)) {
      await sleep(ms - last); last = ms
      const { data } = await send('Page.captureScreenshot', { format: 'png' })
      const file = `${outDir}/${name}-${w}-${ms}ms.png`
      await writeFile(file, Buffer.from(data, 'base64'))
      console.log(file)
    }
    continue
  }
  await sleep(2500)
  if (process.env.HOVER) {
    const { result: pos } = await send('Runtime.evaluate', { returnByValue: true, expression: `(() => { const e = document.querySelector(${JSON.stringify(process.env.HOVER)}); e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return JSON.stringify([r.x + r.width * 0.2, r.y + r.height / 2]) })()` })
    const [hx, hy] = JSON.parse(pos.value)
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: hx, y: hy })
    await sleep(400)
    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    const file = `${outDir}/${name}-${w}-hover.png`
    await writeFile(file, Buffer.from(data, 'base64'))
    console.log(file)
    continue
  }
  const { result } = await send('Runtime.evaluate', { expression: 'JSON.stringify([document.documentElement.scrollWidth, innerWidth, document.documentElement.scrollHeight])', returnByValue: true })
  const [sw, iw, sh] = JSON.parse(result.value)
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: Math.min(sh, 2400), scale: 1 } })
  const file = `${outDir}/${name}-${w}.png`
  await writeFile(file, Buffer.from(data, 'base64'))
  console.log(`${file}  viewport ${iw}px, scrollWidth ${sw}px${sw > iw ? '  ✗ HORIZONTAL OVERFLOW' : ''}`)
}
ws.close()
chrome.kill('SIGKILL')
