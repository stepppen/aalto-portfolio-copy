// After `nuxt generate`: write sitemap.xml and robots.txt from the prerendered pages.
// Redirect stubs (old /projects/*, /playground) and the SPA fallbacks are left out.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = 'https://vedunov.com'
const OUT = fileURLToPath(new URL('../dist', import.meta.url))
const urls = []
const walk = async (dir, rel = '') => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!/^(_|ascii|og|photos|covers|__)/.test(e.name)) await walk(join(dir, e.name), `${rel}/${e.name}`); continue }
    if (e.name !== 'index.html') continue
    const html = await readFile(join(dir, e.name), 'utf8')
    if (/http-equiv="refresh"/i.test(html)) continue
    urls.push({ loc: SITE + (rel || '/'), lastmod: (await stat(join(dir, e.name))).mtime.toISOString().slice(0, 10) })
  }
}
await walk(OUT)
urls.sort((a, b) => a.loc.length - b.loc.length || a.loc.localeCompare(b.loc))
await writeFile(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`)
await writeFile(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`sitemap → ${urls.length} URLs`)
