# Placeholders

Everything below shows on the site as a dashed `todo:` tag. Edit the file named, and the tag disappears.
In YAML, wrap any value containing `: ` or starting with `[` in quotes (`node scripts/check-content.mjs` checks this before every build).
In Markdown bodies, a placeholder is written `:todo[what's missing]`.

**Two languages:** every file has a German twin under `content/de/` (same name, same path). When you fill a placeholder, fill it in both. Placeholders stay in English in the German files on purpose.

## Home: `content/home.yml`, `content/work/*.md` (quote)
- [ ] Check the slogan (`content/site.yml`), the about teaser and the five "How I work" texts. They're my drafts: general opinions, no project facts.
- [ ] Collaborator quotes: removed for launch. To bring them back, add a `quote:` block (text, name, role) to a work file; the card and the case page show it automatically.

## Case studies: `content/work/`
Each has a "What I'd do differently" line waiting for your words.
- **Kymu:** beta/pilot numbers you can share; how you designed the exergames.
- **Calmea:** who used the platform you built; team; design-system scope; dashboard views and the hardest data-vis problem; confirm the data comes from the bed sensor; one lesson from building it. Product facts come from calmea.com; there are no screens, the cover is an illustration.
- **Medical software:** outcome you can share; team; timeframe; tools; the standard(s) followed; an anonymised critical task; user groups and recruiting; session setup and scoring; what made the report useful.
- **Alpha Factory:** team; the idea behind the glyph. (Aiko and Medgate pages: confirmed OK to show.) Visuals are from the Figma brand book and the live sub-site.

## Notes: `content/notes/design-to-code.md`
- [ ] Token tooling; what you built yourself vs. with developers; an anonymised contract example; what a Claude skill does in practice; workshop takeaways; numbers; "What I'd do differently".

## About: `content/pages/about.md`
- [ ] Photos for the photo stack (talks, pitches, presentations): two slots
- [ ] Recognition photos: KMU Innovationstag (you presenting), Creative Economies Forum; links for both if there are pages

## Side projects on Work: `content/work/side/`
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
- [x] Portrait photos (metadata stripped).
