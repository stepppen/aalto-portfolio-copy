# Placeholders

Everything below shows on the site as a dashed `todo:` tag. Edit the file named, and the tag disappears.
In YAML, wrap any value containing `: ` or starting with `[` in quotes (`node scripts/check-content.mjs` checks this before every build).
In Markdown bodies, a placeholder is written `:todo[what's missing]`.

**Two languages:** every file has a German twin under `content/de/` (same name, same path). When you fill a placeholder, fill it in both. Placeholders stay in English in the German files on purpose.

## Home: `content/home.yml`, `content/work/*.md` (quote)
- [ ] Check the slogan (`content/site.yml`), the about teaser and the five "How I work" texts. They're my drafts: general opinions, no project facts.
- [ ] Collaborator quotes: removed for launch. To bring them back, add a `quote:` block (text, name, role) to a work file; the card and the case page show it automatically.

## Case studies: `content/work/`
- **Kymu:** anything from the LUKS pilot you can share. Facts from the 2026 grant deck (adult rehab, grants shown as CHF 100k+, 30+ protocols, 20+ testers); which exercises each of the three games trains. The closed beta is no longer mentioned.
- **Calmea:** who used the platform you built; the hardest data-vis problem; one lesson from building it. The architecture is drawn from your board (the first, MVP option).
- **Alpha Factory:** the idea behind the glyph. (Aiko and Medgate pages: confirmed OK to show.) Brand-book visuals are the clean versions you sent; type and icons are cropped from the Figma export.

## Notes: `content/notes/design-to-code.md`
- [ ] Token tooling; what you built yourself vs. with developers; an anonymised contract example; what a Claude skill does in practice; workshop takeaways; numbers; "What I'd do differently".

## About: `content/pages/about.md`
- [x] KMU Innovationstag photo (from the Kymu LinkedIn post; credit the photographer if needed) and links for both events

## Side projects on Work: `content/work/side/` (a card only, no page)
- [ ] **AI to Eye:** a photo of the installation or the robots (I didn't take Scientifica's photo without asking); team credits; tools; what the robots do and how you built them.

## 3D tiles on About: `content/tiles/`
- [ ] Your real 3D print (STL/glTF) and its filament colour
- [ ] Your macro pad / board model (Blender or KiCad export) and a reference photo
- [ ] Books in `3.books.yml`: title, author, one line each
- [ ] 2–3 sketchbook scans (the sketchbook tile draws stand-in pages until then)
- [ ] Plakativ: 3–5 posters you're happy to show (the crate has drawn stand-ins until then)
- [ ] LLM drawing robot CAD export (for its live tile)

## Done
- [x] CV: web version without phone, date of birth or grades at `public/Stepan_Vedunov_CV.pdf`. Source: `~/Documents/Private/Stepan_Vedunov_CV_2026_EN_web.docx`.
- [x] Portrait photos and the stage photo (metadata stripped). About shows three photos of you.
- [ ] Visitor stats: create a free Cloudflare Web Analytics site for vedunov.com, copy its token, and add it in Netlify as the environment variable `NUXT_PUBLIC_CF_ANALYTICS_TOKEN`, then redeploy. Cookie-free, so no banner.
- [ ] focusTerra table photo (`content/work/side/2.focusterra-table.md`, cover)
- [x] Contact form: sends through Netlify Forms. After the first deploy, turn on form detection and an email notification in Netlify (Forms).
