// 3D printing tile: a spiral vase that builds itself layer by layer.
// PLACEHOLDER MODEL: procedural vase until Stepan's real print (STL/glTF) replaces it.
// Drag up/down (or ↑/↓) scrubs the layers, sideways (or ←/→) turns it. Home/End: empty/full.
import {
  CircleGeometry, DataTexture, DoubleSide, LatheGeometry, LinearFilter, LinearMipmapLinearFilter, Mesh,
  MeshPhysicalMaterial, Plane, RepeatWrapping, Vector2, Vector3,
} from 'three'
import { mountTile } from './runtime'

const HEIGHT = 2.1
const LAYERS = 120 // visual layer count: exaggerated on purpose so the lines read at tile size

function layerNormalMap() {
  // One layer = one ridge. Tangent-space normals from the derivative of a rounded ridge profile.
  const N = 64
  const data = new Uint8Array(N * 4)
  for (let i = 0; i < N; i++) {
    const t = i / N
    const slope = -Math.sin(t * Math.PI * 2) // d/dt of cos ridge, normalised
    const k = 0.9
    const nx = 0, ny = -slope * k, nz = 1
    const l = Math.hypot(nx, ny, nz)
    data.set([((nx / l) * 0.5 + 0.5) * 255, ((ny / l) * 0.5 + 0.5) * 255, ((nz / l) * 0.5 + 0.5) * 255, 255], i * 4)
  }
  const tex = new DataTexture(data, 1, N)
  tex.wrapS = tex.wrapT = RepeatWrapping
  tex.repeat.set(1, LAYERS)
  tex.magFilter = LinearFilter
  tex.minFilter = LinearMipmapLinearFilter
  tex.generateMipmaps = true
  tex.needsUpdate = true
  return tex
}

export function mountPrint(host: HTMLElement, opts: { poster?: boolean; onStatus?: (t: string) => void; onReady?: () => void } = {}) {
  return mountTile(host, { camera: [0, 2.5, 8.6], target: [0, 1.02, 0], ...opts }, (ctx) => {
    const { pivot, shadow, renderer, reducedMotion, signal } = ctx
    renderer.localClippingEnabled = true

    // Profile: a soft bulb that flares at the lip, then a 7-lobe twist (classic spiral vase).
    const pts: Vector2[] = []
    for (let i = 0; i <= 160; i++) {
      const y = (i / 160) * HEIGHT
      const r = 0.46 + 0.2 * Math.sin(y * 1.45 + 0.25) + 0.13 * Math.pow(y / HEIGHT, 2.2)
      pts.push(new Vector2(r, y))
    }
    const geo = new LatheGeometry(pts, 160)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
      const k = 1 + 0.06 * Math.cos(7 * (Math.atan2(z, x) - y * 0.85))
      pos.setX(i, x * k); pos.setZ(i, z * k)
    }
    geo.computeVertexNormals()

    const clip = new Plane(new Vector3(0, -1, 0), HEIGHT)
    const pla = new MeshPhysicalMaterial({
      color: signal, roughness: 0.46, clearcoat: 0.35, clearcoatRoughness: 0.32,
      normalMap: layerNormalMap(), normalScale: new Vector2(1.4, 1.4),
      side: DoubleSide, clippingPlanes: [clip],
    })
    pla.normalMap!.anisotropy = renderer.capabilities.getMaxAnisotropy() // keeps the lines crisp at grazing angles
    const vase = new Mesh(geo, pla)
    pivot.add(vase)
    // Solid first layers (the base), like a real print.
    const base = new Mesh(new CircleGeometry(0.47, 96), new MeshPhysicalMaterial({ color: signal, roughness: 0.55 }))
    base.rotation.x = -Math.PI / 2
    base.position.y = 0.004
    pivot.add(base)
    shadow.scale.set(2.5, 2.5, 1)

    let h = reducedMotion ? HEIGHT : 0.35
    let rot = -0.5, rotT = -0.5, hold = 0, t = 0
    const clampH = (v: number) => Math.max(0.02, Math.min(HEIGHT, v))
    const apply = () => { clip.constant = h; pivot.rotation.y = rot }

    return {
      drag(dx, dy) { rotT += dx * 0.012; h = clampH(h - dy * 0.01) },
      key(e) {
        if (e.key === 'ArrowUp') h = clampH(h + HEIGHT / 20)
        else if (e.key === 'ArrowDown') h = clampH(h - HEIGHT / 20)
        else if (e.key === 'ArrowLeft') rotT -= Math.PI / 12
        else if (e.key === 'ArrowRight') rotT += Math.PI / 12
        else if (e.key === 'Home') h = 0.02
        else if (e.key === 'End') h = HEIGHT
        else return false
        return true
      },
      status: () => `Layer ${Math.round((h / HEIGHT) * LAYERS)} of ${LAYERS}`,
      update(dt, idle) {
        t += dt
        let moving = false
        if (idle) {
          // Build slowly, hold the finished vase, start again. A gentle turn the whole time.
          if (h < HEIGHT) { h = clampH(h + dt * 0.28); moving = true } else if ((hold += dt) > 3.5) { h = 0.02; hold = 0 }
          rotT += dt * 0.18
          moving = true
        }
        const d = rotT - rot
        rot += d * Math.min(1, dt * 8)
        if (Math.abs(d) > 0.0005) moving = true
        apply()
        return moving
      },
      poster() { h = HEIGHT; rot = rotT = -0.5; apply() },
    }
  })
}
