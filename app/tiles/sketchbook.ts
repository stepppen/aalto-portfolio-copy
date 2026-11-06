// Drawing tile: an open sketchbook. Click or tap (or Enter/Space) to turn the page, drag sideways
// to turn the book. The spreads are drawn procedurally (watercolour washes and fineliner lines)
// as stand-ins until real scans exist; the tile shows its "placeholder" flag until then.
import {
  BoxGeometry, CanvasTexture, FrontSide, BackSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry,
  SRGBColorSpace, type Texture,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mountTile, type MountOptions } from './runtime'

const PW = 1.2 // page width
const PD = 1.66 // page depth (portrait)
const SPREADS = 4
const PAPER = '#f3eee3'
const WASH = ['#e2421b', '#2f6f73', '#c9a25c', '#5a7fa8', '#9a6b8f', '#6f8f5a']

// Seeded random, so every load (and the poster image) draws the same pages.
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
}

function pageTexture(n: number): Texture {
  const r = rng(n * 7919 + 13)
  const c = document.createElement('canvas')
  c.width = 512
  c.height = Math.round((512 * PD) / PW)
  const g = c.getContext('2d')!
  g.fillStyle = PAPER
  g.fillRect(0, 0, c.width, c.height)
  // Paper grain.
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(0,0,0,${0.012 + r() * 0.02})`
    g.fillRect(r() * c.width, r() * c.height, 1, 1)
  }
  // Watercolour: overlapping soft blobs, multiplied, with a darker rim like pooled pigment.
  g.globalCompositeOperation = 'multiply'
  const blobs = 2 + Math.floor(r() * 3)
  for (let b = 0; b < blobs; b++) {
    const col = WASH[Math.floor(r() * WASH.length)]
    const cx = c.width * (0.2 + r() * 0.6), cy = c.height * (0.2 + r() * 0.55), rad = 60 + r() * 110
    for (let k = 0; k < 7; k++) {
      const x = cx + (r() - 0.5) * rad, y = cy + (r() - 0.5) * rad * 0.8, rr = rad * (0.45 + r() * 0.5)
      const gr = g.createRadialGradient(x, y, rr * 0.2, x, y, rr)
      gr.addColorStop(0, col + '3a')
      gr.addColorStop(0.85, col + '55')
      gr.addColorStop(1, col + '00')
      g.fillStyle = gr
      g.beginPath()
      g.arc(x, y, rr, 0, Math.PI * 2)
      g.fill()
    }
  }
  g.globalCompositeOperation = 'source-over'
  // Fineliner: a loose horizon, a few contour lines and some hatching.
  g.strokeStyle = '#1b1b1b'
  g.lineCap = 'round'
  g.lineWidth = 1.4
  const hy = c.height * (0.45 + r() * 0.25)
  g.beginPath()
  for (let x = 30; x <= c.width - 30; x += 6) {
    const y = hy + Math.sin(x * 0.02 + n) * 10 + Math.sin(x * 0.07 + n * 3) * 4
    x === 30 ? g.moveTo(x, y) : g.lineTo(x, y)
  }
  g.stroke()
  for (let l = 0; l < 3; l++) {
    const cx = c.width * (0.25 + r() * 0.5), cy = hy - 40 - r() * 120, w = 50 + r() * 80, h = 30 + r() * 70
    g.beginPath()
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.2) {
      const j = 1 + (r() - 0.5) * 0.08
      const x = cx + Math.cos(a) * w * j, y = cy + Math.sin(a) * h * j
      a === 0 ? g.moveTo(x, y) : g.lineTo(x, y)
    }
    g.stroke()
  }
  g.lineWidth = 1
  const hx = c.width * (0.2 + r() * 0.4)
  for (let i = 0; i < 16; i++) {
    g.beginPath()
    g.moveTo(hx + i * 7, hy + 14)
    g.lineTo(hx + i * 7 + 18, hy + 54 + r() * 10)
    g.stroke()
  }
  // A page number, bottom outside corner.
  g.fillStyle = '#1b1b1b99'
  g.font = '18px ui-monospace, Menlo, monospace'
  g.fillText(String(n + 1), n % 2 ? c.width - 44 : 28, c.height - 26)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  return t
}

export function mountSketchbook(host: HTMLElement, opts: MountOptions = {}) {
  return mountTile(host, { camera: [0, 4.3, 4.6], target: [0, 0, 0.1], ...opts }, (ctx) => {
    const { pivot, shadow, invalidate } = ctx
    const pages = Array.from({ length: SPREADS * 2 }, (_, i) => pageTexture(i))
    const mat = (map: Texture, side = FrontSide) => new MeshStandardMaterial({ map, roughness: 0.95, side })

    // Hard cover, a page block on each side, and the two visible pages on top.
    const cover = new Mesh(new RoundedBoxGeometry(PW * 2 + 0.12, 0.05, PD + 0.1, 2, 0.02), new MeshStandardMaterial({ color: 0x24282c, roughness: 0.7 }))
    cover.position.y = -0.03
    const blockMat = new MeshStandardMaterial({ color: 0xece6d8, roughness: 0.95 })
    const blockL = new Mesh(new BoxGeometry(PW - 0.02, 0.06, PD - 0.02), blockMat)
    const blockR = blockL.clone()
    blockL.position.set(-PW / 2, 0.03, 0)
    blockR.position.set(PW / 2, 0.03, 0)
    const flat = new PlaneGeometry(PW - 0.02, PD - 0.02)
    const left = new Mesh(flat, mat(pages[0]))
    const right = new Mesh(flat, mat(pages[1]))
    left.rotation.x = right.rotation.x = -Math.PI / 2
    left.position.set(-PW / 2, 0.061, 0)
    right.position.set(PW / 2, 0.061, 0)

    // The sheet being turned: hinged at the spine, front and back drawn separately.
    const hinge = new Group()
    hinge.position.y = 0.062
    const front = new Mesh(flat, mat(pages[1]))
    const back = new Mesh(flat, mat(pages[2], BackSide))
    for (const m of [front, back]) { m.rotation.x = -Math.PI / 2; m.position.x = PW / 2 }
    hinge.add(front, back)
    hinge.visible = false
    pivot.add(cover, blockL, blockR, left, right, hinge)
    shadow.scale.set(3.4, 2.6, 1)

    let spread = 0, flip = -1, rot = -0.25, rotT = -0.25, t = 0
    const tex = (i: number) => pages[((i % pages.length) + pages.length) % pages.length]
    const setMap = (m: Mesh, map: Texture) => { (m.material as MeshStandardMaterial).map = map; (m.material as MeshStandardMaterial).needsUpdate = true }

    function turn() {
      if (flip >= 0) return
      setMap(front, tex(spread * 2 + 1))
      setMap(back, tex(spread * 2 + 2))
      setMap(right, tex(spread * 2 + 3))
      hinge.rotation.z = 0
      hinge.visible = true
      flip = 0
      invalidate()
    }

    return {
      drag(dx) { rotT += dx * 0.01 },
      tap() { turn() },
      key(e) {
        if (e.key === 'Enter' || e.key === ' ') turn()
        else if (e.key === 'ArrowLeft') rotT -= Math.PI / 12
        else if (e.key === 'ArrowRight') rotT += Math.PI / 12
        else return false
        return true
      },
      // While a page is turning, announce the spread it's turning to.
      status: () => {
        const n = (flip >= 0 ? (spread + 1) % SPREADS : spread) + 1
        return opts.lang === 'de' ? `Doppelseite ${n} von ${SPREADS}` : `Spread ${n} of ${SPREADS}`
      },
      update(dt, idle) {
        t += dt
        let moving = false
        if (flip >= 0) {
          flip = Math.min(1, flip + dt * (ctx.reducedMotion ? 10 : 1.6))
          const e = flip < 0.5 ? 2 * flip * flip : 1 - (-2 * flip + 2) ** 2 / 2
          hinge.rotation.z = e * Math.PI
          hinge.position.y = 0.062 + Math.sin(e * Math.PI) * 0.06
          if (flip >= 1) {
            spread = (spread + 1) % SPREADS
            setMap(left, tex(spread * 2))
            hinge.visible = false
            flip = -1
          }
          moving = true
        }
        if (idle && flip < 0) { rotT = -0.25 + Math.sin(t * 0.3) * 0.15; moving = true }
        const d = rotT - rot
        rot += d * Math.min(1, dt * 8)
        if (Math.abs(d) > 0.0005) moving = true
        pivot.rotation.y = rot
        return moving
      },
      poster() { rot = rotT = -0.25; pivot.rotation.y = rot },
      dispose() { pages.forEach((p) => p.dispose()) },
    }
  })
}

