// Catches the classic YAML trap: an unquoted value containing ": " or starting with "["
// silently becomes a map or a list. Nuxt Content doesn't enforce schemas at runtime, so check here.
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const files = []
const walk = async (d) => { for (const e of await readdir(d, { withFileTypes: true })) e.isDirectory() ? await walk(join(d, e.name)) : /\.(md|ya?ml)$/.test(e.name) && files.push(join(d, e.name)) }
await walk(new URL('../content', import.meta.url).pathname)

let bad = 0
for (const f of files) {
  let text = await readFile(f, 'utf8')
  if (f.endsWith('.md')) text = (text.match(/^---\n([\s\S]*?)\n---/) ?? [, ''])[1]
  let blockIndent = -1 // inside a | or > block scalar: plain text, skip
  text.split('\n').forEach((raw, i) => {
    const indent = raw.match(/^\s*/)[0].length
    if (blockIndent >= 0) { if (!raw.trim() || indent > blockIndent) return; blockIndent = -1 }
    if (/:\s*[|>][-+]?\s*$/.test(raw)) { blockIndent = indent; return }
    if (/^\s*#/.test(raw)) return // comment line
    const line = raw.replace(/\s+#\s.*$/, '')
    const m = line.match(/^\s*(?:-\s+)?(?:[\w-]+:\s+)?(.*)$/)
    const v = m?.[1] ?? ''
    if (!v || /^["'|>]/.test(v) || /^-?\s*$/.test(v)) return
    const isList = /^\s*-\s+/.test(line) && !/^\s*-\s+[\w-]+:\s/.test(line)
    const value = isList ? line.replace(/^\s*-\s+/, '') : v
    if (/^["'|>]/.test(value)) return
    if (/^\[(?!TODO).*\]\s*$/.test(value)) return // intentional flow list
    if (value.includes(': ') || /^\s*(?:-\s+)?[\w-]+:\s+\S.*:$/.test(line.trimEnd()) || /^\s*-\s+(?![\w-]+:(\s|$))\S.*:$/.test(line.trimEnd()) || /^\[(?!.*\]\s*$)/.test(value) || /^\[TODO/.test(value)) {
      bad++
      console.log(`${f.replace(/.*content\//, 'content/')}:${i + 1}  quote this value → ${line.trim()}`)
    }
  })
}
if (bad) { console.error(`\n${bad} unquoted YAML value(s) that may not parse as text.`); process.exit(1) }
console.log('content YAML ok')
