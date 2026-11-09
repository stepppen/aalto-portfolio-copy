// Electronics tile: a small macro pad with three keys, an LED and a toggle switch.
// PLACEHOLDER MODEL: procedural until Stepan's real board (Blender or KiCad export) replaces it.
// Click/tap a key to press it (the LED changes colour); click the toggle to switch the LED.
// Keyboard: 1, 2, 3 press the keys; Enter or Space flips the toggle; ←/→ turn the pad.
import {
  CanvasTexture, Color, CylinderGeometry, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial,
  RepeatWrapping, SphereGeometry, Vector2, type Object3D,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mountTile, type MountOptions } from './runtime'

/** Faint PCB traces for the top plate, as a bump-like normal map (straight runs and 45° bends). */
function traceNormalMap() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  g.fillStyle = 'rgb(128,128,255)'
  g.fillRect(0, 0, 256, 256)
  g.lineCap = 'round'
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 26; i++) {
    let x = Math.floor(rnd() * 16) * 16 + 8, y = Math.floor(rnd() * 16) * 16 + 8
    g.beginPath(); g.moveTo(x, y)
    for (let s = 0; s < 4; s++) {
      const dir = Math.floor(rnd() * 4), len = 16 + Math.floor(rnd() * 4) * 16
      if (dir === 0) x += len; else if (dir === 1) y += len; else if (dir === 2) { x += len * 0.7; y += len * 0.7 } else { x -= len * 0.7; y += len * 0.7 }
      g.lineTo(x, y)
    }
    g.lineWidth = 3; g.strokeStyle = 'rgb(128,160,240)'; g.stroke()
    g.lineWidth = 1.2; g.strokeStyle = 'rgb(128,100,240)'; g.stroke()
  }
  const t = new CanvasTexture(c)
  t.wrapS = t.wrapT = RepeatWrapping
  return t
}

export function mountMacropad(host: HTMLElement, opts: MountOptions = {}) {
  return mountTile(host, { camera: [0, 2.9, 5.15], target: [0, 0.16, 0], ...opts }, (ctx) => {
    const { pivot, shadow, reducedMotion, signal, invalidate } = ctx

    const shell = new Mesh(
      new RoundedBoxGeometry(2.3, 0.34, 1.25, 6, 0.14),
      new MeshPhysicalMaterial({ color: 0xf2f1ee, roughness: 0.52, clearcoat: 0.12, clearcoatRoughness: 0.5 }),
    )
    shell.position.y = 0.17
    pivot.add(shell)

    const plateMat = new MeshPhysicalMaterial({ color: 0x232524, roughness: 0.62, normalMap: traceNormalMap(), normalScale: new Vector2(0.35, 0.35) })
    plateMat.normalMap!.repeat.set(2.2, 1.1)
    const plate = new Mesh(new RoundedBoxGeometry(2.06, 0.04, 1.0, 4, 0.02), plateMat)
    plate.position.y = 0.355
    pivot.add(plate)

    // Four screws at the corners, and a USB-C port at the back.
    const metal = new MeshStandardMaterial({ color: 0xcfcfcf, metalness: 1, roughness: 0.28 })
    for (const [x, z] of [[-0.96, -0.43], [0.96, -0.43], [-0.96, 0.43], [0.96, 0.43]]) {
      const sc = new Mesh(new CylinderGeometry(0.035, 0.035, 0.02, 20), metal)
      sc.position.set(x, 0.38, z)
      pivot.add(sc)
    }
    const usb = new Mesh(new RoundedBoxGeometry(0.26, 0.08, 0.06, 3, 0.03), metal)
    usb.position.set(-0.55, 0.19, -0.63)
    pivot.add(usb)

    // Keys: two off-white, one in the signal colour.
    const keyMat = (c: Color | number) => new MeshPhysicalMaterial({ color: c, roughness: 0.32, clearcoat: 0.45, clearcoatRoughness: 0.3 })
    const keys = [-0.74, -0.12, 0.5].map((x, i) => {
      const k = new Mesh(new RoundedBoxGeometry(0.52, 0.24, 0.52, 5, 0.09), keyMat(i === 2 ? signal : 0xfafaf8))
      k.position.set(x, 0.49, 0.05)
      k.userData = { press: 0 }
      pivot.add(k)
      return k
    })

    // LED and toggle switch on the right.
    const ledMat = new MeshStandardMaterial({ color: 0x5fe39a, emissive: 0x5fe39a, emissiveIntensity: 2.2 })
    const led = new Mesh(new SphereGeometry(0.075, 24, 16), ledMat)
    led.position.set(0.93, 0.41, -0.3)
    pivot.add(led)
    const toggleBase = new Mesh(new CylinderGeometry(0.12, 0.12, 0.06, 32), metal)
    toggleBase.position.set(0.93, 0.4, 0.2)
    pivot.add(toggleBase)
    const lever = new Group()
    lever.position.set(0.93, 0.43, 0.2)
    pivot.add(lever)
    const stick = new Mesh(new CylinderGeometry(0.026, 0.02, 0.3, 16), metal)
    stick.position.y = 0.15
    lever.add(stick)
    const tip = new Mesh(new SphereGeometry(0.05, 20, 14), keyMat(signal))
    tip.position.y = 0.31
    lever.add(tip)
    shadow.scale.set(3.7, 2.4, 1)

    const colours = [0x5fe39a, 0x58a6ff, 0xffd166, 0xff7ab6]
    let hue = 0, on = true, leverT = -0.45, rot = -0.28, rotT = -0.28, t = 0
    const setLed = () => {
      const c = new Color(colours[hue])
      ledMat.color.copy(c); ledMat.emissive.copy(c)
    }
    const press = (i: number) => { keys[i].userData.press = 1; hue = (hue + 1) % colours.length; setLed(); navigator.vibrate?.(8); invalidate() }
    const flip = () => { on = !on; leverT = on ? -0.45 : 0.45; navigator.vibrate?.(8); invalidate() }
    const toggleParts: Object3D[] = [toggleBase, stick, tip]

    return {
      drag(dx) { rotT += dx * 0.01 },
      tap(ndc) {
        const hit = ctx.pick(ndc, [...keys, ...toggleParts])
        if (!hit) return
        const i = keys.indexOf(hit.object as Mesh)
        if (i >= 0) press(i); else flip()
      },
      key(e) {
        if (e.key === '1' || e.key === '2' || e.key === '3') press(Number(e.key) - 1)
        else if (e.key === 'Enter' || e.key === ' ') flip()
        else if (e.key === 'ArrowLeft') rotT -= Math.PI / 12
        else if (e.key === 'ArrowRight') rotT += Math.PI / 12
        else return false
        return true
      },
      status: () => opts.lang === 'de'
        ? `LED ${on ? 'an' : 'aus'}, ${['grün', 'blau', 'gelb', 'pink'][hue]}`
        : `LED ${on ? 'on' : 'off'}, ${['green', 'blue', 'yellow', 'pink'][hue]}`,
      update(dt, idle) {
        t += dt
        let moving = false
        for (const k of keys) {
          if (k.userData.press > 0.002) { k.userData.press *= Math.pow(0.0015, dt); moving = true } else k.userData.press = 0
          k.position.y = 0.49 - 0.09 * k.userData.press
        }
        // Sprung lever: overshoots a little, like the read-mode switch.
        const dl = leverT - lever.rotation.z
        lever.userData.v = ((lever.userData.v ?? 0) + dl * 220 * dt) * Math.pow(0.0008, dt)
        lever.rotation.z += lever.userData.v * dt
        if (Math.abs(dl) > 0.001 || Math.abs(lever.userData.v) > 0.01) moving = true
        const target = on ? 2.2 : 0.02
        const de = target - ledMat.emissiveIntensity
        ledMat.emissiveIntensity += de * Math.min(1, dt * 12)
        if (Math.abs(de) > 0.01) moving = true
        if (idle) { rotT = -0.28 + Math.sin(t * 0.35) * 0.22; moving = true }
        const d = rotT - rot
        rot += d * Math.min(1, dt * 8)
        if (Math.abs(d) > 0.0005) moving = true
        pivot.rotation.y = rot
        return moving
      },
      poster() { rot = rotT = -0.28; pivot.rotation.y = rot; on = true; ledMat.emissiveIntensity = 2.2; lever.rotation.z = leverT },
    }
  })
}
