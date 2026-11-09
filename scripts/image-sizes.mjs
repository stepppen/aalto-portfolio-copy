// Intrinsic sizes of every image in public/, so components can reserve the right space
// (aspect-ratio) before the image loads: no layout shift. → app/assets/image-sizes.json
import sharp from 'sharp'
import { readdir, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const PUB = fileURLToPath(new URL('../public', import.meta.url))
const sizes = {}
const walk = async (d) => {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const f = join(d, e.name)
    if (e.isDirectory()) { if (!['og', 'ascii'].includes(e.name)) await walk(f); continue }
    if (!/\.(webp|jpe?g|png|gif|svg|avif)$/i.test(e.name)) continue
    try { const m = await sharp(f).metadata(); sizes['/' + relative(PUB, f)] = [m.width, m.pageHeight ?? m.height] } catch { /* not an image sharp can read */ }
  }
}
await walk(PUB)
await writeFile(fileURLToPath(new URL('../app/assets/image-sizes.json', import.meta.url)), JSON.stringify(sizes, null, 0) + '\n')
console.log(`image sizes → ${Object.keys(sizes).length} images`)
