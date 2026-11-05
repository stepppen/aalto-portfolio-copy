// Shared runtime for the side-project tiles: the only place WebGL is used on the site.
// - three.js is imported here, and this module is itself imported dynamically, so it only
//   loads on /work and only when the tile grid comes near the viewport.
// - One renderer per tile (≤ 4 on the page), created on approach, rendering only while the
//   tile is on screen and something is moving. Off-screen or at rest, no frames are drawn.
// - Studio look: RoomEnvironment through PMREM, ACES filmic tone mapping, one soft key light,
//   a blurred radial contact shadow, ~30° camera. No post-processing.
// Named imports only, so the bundler can drop the parts of three.js we don't use.
import {
  ACESFilmicToneMapping, CanvasTexture, Color, DirectionalLight, Group, Mesh, MeshBasicMaterial,
  PMREMGenerator, PerspectiveCamera, PlaneGeometry, Raycaster, SRGBColorSpace, Scene, Vector2, WebGLRenderer,
  type Intersection, type Material, type Object3D, type Texture,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export interface TileInput {
  /** Drag deltas in CSS px (pointer or touch). */
  drag?: (dx: number, dy: number) => void
  /** A press that didn't move: x/y in normalised device coords (-1..1). */
  tap?: (ndc: Vector2) => void
  hover?: (ndc: Vector2 | null) => void
  /** Keyboard. Return true if the key was handled. */
  key?: (e: KeyboardEvent) => boolean
}

export interface TileScene extends TileInput {
  /** Advance by dt seconds. `idle` is false under reduced motion and during/just after input. Return true while still animating. */
  update: (dt: number, idle: boolean) => boolean
  /** Put the scene in its "poster" state (deterministic frame for the static image). */
  poster?: () => void
  /** Short text for screen readers after keyboard input, e.g. "Layer 120 of 240". */
  status?: () => string
  dispose?: () => void
}

export interface TileContext {
  scene: Scene
  camera: PerspectiveCamera
  pivot: Group
  shadow: Mesh
  renderer: WebGLRenderer
  reducedMotion: boolean
  signal: Color
  /** Ask for a frame (after input or a state change). */
  invalidate: () => void
  pick: (ndc: Vector2, objects: Object3D[]) => Intersection | undefined
}

let shadowTexture: Texture | null = null
function contactShadow() {
  if (shadowTexture) return shadowTexture
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  gr.addColorStop(0, 'rgba(0,0,0,0.30)')
  gr.addColorStop(0.35, 'rgba(0,0,0,0.16)')
  gr.addColorStop(0.7, 'rgba(0,0,0,0.04)')
  gr.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = gr
  g.fillRect(0, 0, 256, 256)
  shadowTexture = new CanvasTexture(c)
  shadowTexture.colorSpace = SRGBColorSpace
  return shadowTexture
}

const nextTask = () => new Promise<void>((r) => setTimeout(r, 0))

export function mountTile(
  host: HTMLElement,
  opts: { camera: [number, number, number]; target: [number, number, number]; poster?: boolean; onStatus?: (text: string) => void; onReady?: () => void },
  build: (ctx: TileContext) => TileScene,
): () => void {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power', preserveDrawingBuffer: !!opts.poster })
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.outputColorSpace = SRGBColorSpace
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  canvas.className = 'tile__canvas'
  host.appendChild(canvas)

  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  scene.environment = pmrem.fromScene(room, 0.04).texture
  scene.environmentIntensity = 0.62 // less ambient, so the key light can shape the form
  room.dispose?.()
  const key = new DirectionalLight(0xffffff, 2.1) // one soft key, high and to the left
  key.position.set(-3.2, 4.2, 2.6)
  scene.add(key)

  const camera = new PerspectiveCamera(30, 1, 0.1, 50)
  camera.position.set(...opts.camera)
  camera.lookAt(...opts.target)

  const pivot = new Group()
  scene.add(pivot)
  const shadow = new Mesh(
    new PlaneGeometry(1, 1),
    new MeshBasicMaterial({ map: contactShadow(), transparent: true, depthWrite: false, toneMapped: false }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.001
  scene.add(shadow)

  // Loop and visibility state (declared first: size() below already asks for a frame).
  let raf = 0, last = 0, visible = false, ready = false

  const signal = new Color(getComputedStyle(host).getPropertyValue('--signal').trim() || '#E8540C')
  const ray = new Raycaster()
  let dirty = true
  const ctx: TileContext = {
    scene, camera, pivot, shadow, renderer, reducedMotion, signal,
    invalidate: () => { dirty = true; wake() },
    pick: (ndc, objects) => { ray.setFromCamera(ndc, camera); return ray.intersectObjects(objects, true)[0] },
  }
  const tile = build(ctx)

  // ---- Size ----
  const size = () => {
    const w = host.clientWidth
    renderer.setSize(w, w, false)
    canvas.style.width = canvas.style.height = '100%'
    camera.aspect = 1
    camera.updateProjectionMatrix()
    ctx.invalidate()
  }
  size()
  const ro = new ResizeObserver(size)
  ro.observe(host)

  // ---- Visibility: render only on screen ----
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake() })
  io.observe(host)

  // ---- Input ----
  let lastInput = -Infinity
  const touched = () => { lastInput = performance.now(); ctx.invalidate() }
  const ndcOf = (x: number, y: number) => {
    const b = host.getBoundingClientRect()
    return new Vector2(((x - b.left) / b.width) * 2 - 1, -((y - b.top) / b.height) * 2 + 1)
  }

  // Mouse and pen: drag anywhere. (Touch is handled separately so page scrolling still works.)
  let down = false, lx = 0, ly = 0, moved = 0
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    down = true; lx = e.clientX; ly = e.clientY; moved = 0
    host.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    if (down) {
      const dx = e.clientX - lx, dy = e.clientY - ly
      lx = e.clientX; ly = e.clientY; moved += Math.abs(dx) + Math.abs(dy)
      tile.drag?.(dx, dy); touched()
    } else if (tile.hover) { tile.hover(ndcOf(e.clientX, e.clientY)); ctx.invalidate() }
  }
  const onUp = (e: PointerEvent) => {
    if (e.pointerType === 'touch' || !down) return
    down = false
    if (moved < 6 && tile.tap) { tile.tap(ndcOf(e.clientX, e.clientY)); touched() }
  }
  const onLeave = () => { if (tile.hover) { tile.hover(null); ctx.invalidate() } }

  // Touch: a sideways drag is ours (vertical stays page scroll, via touch-action: pan-y);
  // press and hold for 250 ms, and vertical drags are ours too. A quick tap is a tap.
  let tx = 0, ty = 0, tMode: 'none' | 'x' | 'xy' = 'none', holdTimer = 0, tMoved = 0
  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return
    const t = e.touches[0]; tx = t.clientX; ty = t.clientY; tMode = 'none'; tMoved = 0
    clearTimeout(holdTimer)
    holdTimer = window.setTimeout(() => { if (tMoved < 8) { tMode = 'xy'; navigator.vibrate?.(8) } }, 250)
  }
  const onTouchMove = (e: TouchEvent) => {
    const t = e.touches[0]; const dx = t.clientX - tx, dy = t.clientY - ty
    tMoved += Math.abs(dx) + Math.abs(dy)
    if (tMode === 'none' && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) tMode = 'x'
    if (tMode === 'none') return
    e.preventDefault()
    tx = t.clientX; ty = t.clientY
    tile.drag?.(dx, tMode === 'xy' ? dy : 0); touched()
  }
  const onTouchEnd = (e: TouchEvent) => {
    clearTimeout(holdTimer)
    if (tMode === 'none' && tMoved < 8 && tile.tap) {
      const t = e.changedTouches[0]; tile.tap(ndcOf(t.clientX, t.clientY)); touched()
    }
    tMode = 'none'
  }
  const onKey = (e: KeyboardEvent) => { if (tile.key?.(e)) { e.preventDefault(); touched(); if (tile.status) opts.onStatus?.(tile.status()) } }

  host.addEventListener('pointerdown', onDown)
  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerup', onUp)
  host.addEventListener('pointerleave', onLeave)
  host.addEventListener('touchstart', onTouchStart, { passive: true })
  host.addEventListener('touchmove', onTouchMove, { passive: false })
  host.addEventListener('touchend', onTouchEnd)
  host.addEventListener('keydown', onKey)

  // ---- Loop: runs only while visible and something changes ----
  function frame(now: number) {
    raf = 0
    const dt = Math.min(0.05, (now - (last || now)) / 1000)
    last = now
    const idle = !reducedMotion && now - lastInput > 2500
    const animating = tile.update(dt, idle)
    if (dirty || animating) { renderer.render(scene, camera); dirty = false }
    if (visible && (animating || dirty)) raf = requestAnimationFrame(frame)
    else last = 0
  }
  function wake() { if (ready && !raf && visible) raf = requestAnimationFrame(frame) }

  // Compile shaders off the main thread where the GPU driver allows it, then start drawing.
  let disposed = false
  ;(async () => {
    await nextTask()
    try { await renderer.compileAsync(scene, camera) } catch { /* older drivers: compile on first frame */ }
    if (disposed) return
    if (opts.poster) { tile.poster?.(); renderer.render(scene, camera); host.dataset.posterReady = '1' }
    ready = true
    renderer.render(scene, camera) // first frame before the poster steps aside: no blank flash
    host.dataset.live = '1'
    opts.onReady?.()
    wake()
  })()

  return () => {
    disposed = true
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); clearTimeout(holdTimer)
    host.removeEventListener('pointerdown', onDown); host.removeEventListener('pointermove', onMove)
    host.removeEventListener('pointerup', onUp); host.removeEventListener('pointerleave', onLeave)
    host.removeEventListener('touchstart', onTouchStart); host.removeEventListener('touchmove', onTouchMove)
    host.removeEventListener('touchend', onTouchEnd); host.removeEventListener('keydown', onKey)
    tile.dispose?.()
    scene.traverse((o) => { const m = o as Mesh; m.geometry?.dispose(); const mat = m.material as Material | Material[] | undefined; (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose()) })
    pmrem.dispose(); renderer.dispose(); canvas.remove()
  }
}
