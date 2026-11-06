// Reading tile: a small stack of books, spines toward you, titles from content/tiles/3.books.yml.
// Books are simple boxes on purpose: that's the right geometry, not a placeholder. The titles are
// placeholders until Stepan fills in the YAML (never invented).
// Hover or tap a book to slide it out and read why it's there. Keyboard: ↑/↓ pick a book, Esc puts it back.
import {
  BoxGeometry, CanvasTexture, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, PlaneGeometry,
  SRGBColorSpace, type Color, type Object3D,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mountTile, type MountOptions } from './runtime'

interface Book { title: string; author?: string; why?: string }

const COVERS = [0x2f5a4c, 0xe8e1d3, 'signal', 0x2f3b4a, 0xc9a25c] as const
const isTodo = (s?: string) => !s || /^\[TODO/i.test(s)
const clean = (s?: string) => (isTodo(s) ? 'todo: ' + (s ?? '').replace(/^\[TODO:\s*|\]$/gi, '') : s!)

function spineTexture(book: Book, w: number, h: number, bg: string, ink: string) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = Math.max(64, Math.round((1024 * h) / w))
  const g = c.getContext('2d')!
  g.fillStyle = bg
  g.fillRect(0, 0, c.width, c.height)
  g.fillStyle = ink
  g.textBaseline = 'middle'
  const title = isTodo(book.title) ? 'todo: title' : book.title
  let size = c.height * 0.42
  g.font = `500 ${size}px Inter, system-ui, sans-serif`
  while (g.measureText(title).width > c.width * 0.62 && size > 10) { size -= 2; g.font = `500 ${size}px Inter, system-ui, sans-serif` }
  g.fillText(title, c.width * 0.06, c.height / 2)
  if (book.author && !isTodo(book.author)) {
    g.globalAlpha = 0.7
    g.font = `400 ${c.height * 0.28}px Inter, system-ui, sans-serif`
    const aw = g.measureText(book.author).width
    g.fillText(book.author, c.width * 0.94 - aw, c.height / 2)
  }
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  return t
}

export function mountBooks(host: HTMLElement, opts: MountOptions = {}) {
  const books = ((opts.data?.books as Book[] | undefined) ?? []).slice(0, 5)
  return mountTile(host, { camera: [0, 2.2, 5.6], target: [0, 0.34, 0], ...opts }, (ctx) => {
    const { pivot, shadow, signal, invalidate, setCaption } = ctx
    const pageMat = new MeshStandardMaterial({ color: 0xf2ede2, roughness: 0.92 })
    const stack: Group[] = []
    let y = 0
    books.forEach((book, i) => {
      const w = [1.72, 1.56, 1.46, 1.62, 1.5][i], h = [0.3, 0.24, 0.2, 0.26, 0.22][i], d = [1.2, 1.08, 1.0, 1.12, 1.04][i]
      const coverHex = COVERS[i % COVERS.length]
      const cover = coverHex === 'signal' ? signal.clone() : (coverHex as number)
      const coverMat = new MeshPhysicalMaterial({ color: cover, roughness: 0.62, clearcoat: 0.12, clearcoatRoughness: 0.6 })
      const g = new Group()
      const top = new Mesh(new RoundedBoxGeometry(w, 0.035, d, 2, 0.014), coverMat)
      top.position.y = h / 2
      const bottom = top.clone(); bottom.position.y = -h / 2
      const spine = new Mesh(new RoundedBoxGeometry(w, h + 0.03, 0.05, 2, 0.02), coverMat)
      spine.position.z = d / 2 - 0.02
      const pages = new Mesh(new BoxGeometry(w - 0.06, h - 0.03, d - 0.08), pageMat)
      pages.position.z = -0.02
      // Title on the spine, drawn from the YAML.
      const dark = typeof cover === 'number' ? [0x2f5a4c, 0x2f3b4a].includes(cover) : true
      const hex = '#' + (typeof cover === 'number' ? cover.toString(16).padStart(6, '0') : (cover as Color).getHexString())
      const label = new Mesh(
        new PlaneGeometry(w * 0.96, h * 0.86),
        new MeshStandardMaterial({ map: spineTexture(book, w * 0.96, h * 0.86, hex, dark ? '#f2ede2' : '#1a1a1a'), roughness: 0.7 }),
      )
      label.position.z = d / 2 + 0.006
      g.add(top, bottom, spine, pages, label)
      g.position.y = y + h / 2 + 0.02
      g.rotation.y = [0.04, -0.1, 0.14, -0.06, 0.09][i]
      g.userData = { book, out: 0, outT: 0 }
      y += h + 0.04
      pivot.add(g)
      stack.push(g)
    })
    shadow.scale.set(3.1, 2.5, 1)

    let selected = -1, rot = -0.18, rotT = -0.18, t = 0
    const select = (i: number) => {
      selected = i
      stack.forEach((b, j) => (b.userData.outT = j === i ? 0.4 : 0))
      if (i < 0) setCaption(null)
      else {
        const b = stack[i].userData.book as Book
        setCaption(`${clean(b.title)}${b.author && !isTodo(b.author) ? `${opts.lang === 'de' ? ' von' : ' by'} ${b.author}` : ''}. ${clean(b.why)}`)
      }
      invalidate()
    }
    const bookOf = (o: Object3D | undefined) => { while (o && !stack.includes(o as Group)) o = o.parent ?? undefined; return o ? stack.indexOf(o as Group) : -1 }

    return {
      drag(dx) { rotT += dx * 0.01 },
      hover(ndc) { const i = ndc ? bookOf(ctx.pick(ndc, stack)?.object) : -1; if (i !== selected) select(i) },
      tap(ndc) { const i = bookOf(ctx.pick(ndc, stack)?.object); select(i === selected ? -1 : i) },
      key(e) {
        if (e.key === 'ArrowUp') select(Math.min(stack.length - 1, selected + 1))
        else if (e.key === 'ArrowDown') select(selected <= 0 ? 0 : selected - 1)
        else if (e.key === 'Escape') select(-1)
        else if (e.key === 'ArrowLeft') rotT -= Math.PI / 12
        else if (e.key === 'ArrowRight') rotT += Math.PI / 12
        else return false
        return true
      },
      status: () => opts.lang === 'de'
        ? (selected < 0 ? 'Kein Buch ausgewählt' : `Buch ${selected + 1} von ${stack.length}`)
        : (selected < 0 ? 'No book selected' : `Book ${selected + 1} of ${stack.length}`),
      update(dt, idle) {
        t += dt
        let moving = false
        for (const b of stack) {
          const d = b.userData.outT - b.userData.out
          b.userData.out += d * Math.min(1, dt * 10)
          b.position.z = b.userData.out
          if (Math.abs(d) > 0.0005) moving = true
        }
        if (idle && selected < 0) { rotT = -0.18 + Math.sin(t * 0.3) * 0.2; moving = true }
        const d = rotT - rot
        rot += d * Math.min(1, dt * 8)
        if (Math.abs(d) > 0.0005) moving = true
        pivot.rotation.y = rot
        return moving
      },
      poster() { rot = rotT = -0.18; pivot.rotation.y = rot },
    }
  })
}
