// Poster tile (Plakativ): a wooden print crate with a few posters standing in it, like flipping
// through prints in a shop. Hover or tap a poster to lift it out; drag sideways to turn the crate.
// Keyboard: ↑/↓ pick a poster, Esc puts it back. The prints are procedural stand-ins (bold shapes,
// no artist's work is reproduced) until real ones are added; the tile shows its placeholder flag.
import {
  BoxGeometry, CanvasTexture, Group, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, type Object3D, type Texture,
} from 'three'
import { mountTile, type MountOptions } from './runtime'

const W = 1.1, H = 1.55, N = 5
const PALETTES = [
  ['#f1ebdf', '#e2421b', '#1b1b1b'],
  ['#2f6f73', '#f3d9a4', '#f1ebdf'],
  ['#1b1b1b', '#f1ebdf', '#e2421b'],
  ['#f3d9a4', '#2f3b4a', '#e2421b'],
  ['#e9e4f0', '#5a7fa8', '#1b1b1b'],
]

function posterTexture(i: number): Texture {
  const [bg, a, b] = PALETTES[i % PALETTES.length]
  const c = document.createElement('canvas')
  c.width = 512
  c.height = Math.round((512 * H) / W)
  const g = c.getContext('2d')!
  const w = c.width, h = c.height
  g.fillStyle = bg
  g.fillRect(0, 0, w, h)
  g.fillStyle = a
  g.strokeStyle = a
  // Five different bold compositions.
  if (i % 5 === 0) { g.beginPath(); g.arc(w / 2, h * 0.38, w * 0.3, 0, Math.PI * 2); g.fill(); g.fillStyle = b; g.fillRect(w * 0.1, h * 0.62, w * 0.8, h * 0.06) }
  if (i % 5 === 1) { for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(w / 2, h * 0.7, w * (0.45 - k * 0.07), Math.PI, 0); g.lineWidth = 16; g.stroke() } }
  if (i % 5 === 2) { for (let k = 0; k < 9; k++) g.fillRect(0, h * 0.1 + k * h * 0.07, w * (0.25 + ((k * 37) % 60) / 100), h * 0.035) }
  if (i % 5 === 3) { g.beginPath(); g.moveTo(w * 0.15, h * 0.7); g.lineTo(w * 0.5, h * 0.12); g.lineTo(w * 0.85, h * 0.7); g.closePath(); g.fill(); g.fillStyle = b; g.beginPath(); g.arc(w * 0.5, h * 0.55, w * 0.12, 0, Math.PI * 2); g.fill() }
  if (i % 5 === 4) { for (let x = 0; x < 4; x++) for (let y = 0; y < 5; y++) { g.fillStyle = (x + y) % 2 ? a : b; g.beginPath(); g.arc(w * (0.2 + x * 0.2), h * (0.14 + y * 0.12), w * 0.07, 0, Math.PI * 2); g.fill() } }
  // A small print line at the bottom, like a poster's credit.
  g.fillStyle = b
  g.font = '22px ui-monospace, Menlo, monospace'
  g.fillText('plakativ', w * 0.1, h * 0.92)
  g.fillText(`no. ${String(i + 1).padStart(2, '0')}`, w * 0.72, h * 0.92)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  return t
}

export function mountPosters(host: HTMLElement, opts: MountOptions = {}) {
  return mountTile(host, { camera: [0, 2.5, 5.4], target: [0, 0.75, 0], ...opts }, (ctx) => {
    const { pivot, shadow, invalidate } = ctx
    const textures = Array.from({ length: N }, (_, i) => posterTexture(i))

    // The crate: a floor and four low walls in light wood.
    const wood = new MeshStandardMaterial({ color: 0xcfae84, roughness: 0.8 })
    const cw = W + 0.3, cd = 1.5, ch = 0.55, th = 0.05
    const crate = new Group()
    const floor = new Mesh(new BoxGeometry(cw, th, cd), wood)
    floor.position.y = th / 2
    const side = new BoxGeometry(th, ch, cd)
    const l = new Mesh(side, wood), r = new Mesh(side, wood)
    l.position.set(-cw / 2 + th / 2, ch / 2, 0)
    r.position.set(cw / 2 - th / 2, ch / 2, 0)
    const end = new BoxGeometry(cw, ch * 0.75, th)
    const f = new Mesh(end, wood), b = new Mesh(end, wood)
    f.position.set(0, (ch * 0.75) / 2, cd / 2 - th / 2)
    b.position.set(0, (ch * 0.75) / 2, -cd / 2 + th / 2)
    crate.add(floor, l, r, f, b)
    pivot.add(crate)

    // Posters standing in the crate, leaning back a little, front one closest to you.
    const board = new BoxGeometry(W, H, 0.012)
    const edge = new MeshStandardMaterial({ color: 0xf1ebdf, roughness: 0.9 })
    const posters: Group[] = []
    for (let i = 0; i < N; i++) {
      const g = new Group()
      const art = new MeshStandardMaterial({ map: textures[i], roughness: 0.85 })
      const sheet = new Mesh(board, [edge, edge, edge, edge, art, edge])
      sheet.position.y = H / 2
      g.add(sheet)
      g.position.set(0, th, cd / 2 - 0.2 - i * 0.24)
      g.rotation.x = -0.16
      g.userData = { lift: 0, liftT: 0 }
      crate.add(g)
      posters.push(g)
    }
    shadow.scale.set(2.6, 2.4, 1)

    let selected = -1, rot = -0.3, rotT = -0.3, t = 0
    const select = (i: number) => {
      selected = i
      posters.forEach((p, j) => (p.userData.liftT = j === i ? 0.75 : 0))
      invalidate()
    }
    const posterOf = (o: Object3D | undefined) => { while (o && !posters.includes(o as Group)) o = o.parent ?? undefined; return o ? posters.indexOf(o as Group) : -1 }

    return {
      drag(dx) { rotT += dx * 0.01 },
      hover(ndc) { const i = ndc ? posterOf(ctx.pick(ndc, posters)?.object) : -1; if (i !== selected) select(i) },
      tap(ndc) { const i = posterOf(ctx.pick(ndc, posters)?.object); select(i === selected ? -1 : i) },
      key(e) {
        if (e.key === 'ArrowUp') select(Math.min(N - 1, selected + 1))
        else if (e.key === 'ArrowDown') select(selected <= 0 ? 0 : selected - 1)
        else if (e.key === 'Escape') select(-1)
        else if (e.key === 'ArrowLeft') rotT -= Math.PI / 12
        else if (e.key === 'ArrowRight') rotT += Math.PI / 12
        else return false
        return true
      },
      status: () => opts.lang === 'de'
        ? (selected < 0 ? 'Kein Plakat ausgewählt' : `Plakat ${selected + 1} von ${N}`)
        : (selected < 0 ? 'No poster selected' : `Poster ${selected + 1} of ${N}`),
      update(dt, idle) {
        t += dt
        let moving = false
        for (const p of posters) {
          const d = p.userData.liftT - p.userData.lift
          p.userData.lift += d * Math.min(1, dt * 9)
          p.position.y = 0.05 + p.userData.lift
          if (Math.abs(d) > 0.0005) moving = true
        }
        if (idle && selected < 0) { rotT = -0.3 + Math.sin(t * 0.3) * 0.18; moving = true }
        const d = rotT - rot
        rot += d * Math.min(1, dt * 8)
        if (Math.abs(d) > 0.0005) moving = true
        pivot.rotation.y = rot
        return moving
      },
      poster() { rot = rotT = -0.3; pivot.rotation.y = rot },
      dispose() { textures.forEach((x) => x.dispose()) },
    }
  })
}
