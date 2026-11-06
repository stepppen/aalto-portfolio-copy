# Placeholders

Everything below shows on the site as a dashed `todo:` tag. Edit the file named, and the tag disappears.
In YAML, wrap any value containing `: ` or starting with `[` in quotes (`node scripts/check-content.mjs` checks this before every build).
In Markdown bodies, a placeholder is written `:todo[what's missing]`.

## Home: `content/home.yml`, `content/work/*.md` (quote)
- [ ] Check the slogan (`content/site.yml`), the about teaser and the five "How I work" texts. They're my drafts: general opinions, no project facts.
- [ ] Collaborator quotes on the three featured cards: Kymu (Elia, and Elia's role), Calmea (someone at the lab), Alpha Factory (someone at OWT)

## Case studies: `content/work/`
Each has a "What I'd do differently" line waiting for your words.
- **Kymu:** beta/pilot numbers you can share; how you designed the exergames.
- **Calmea:** the problem and for whom; team; design-system scope; dashboard views and the hardest data-vis problem; data source; one lesson from building it; cover, key visuals, screens (if cleared).
- **Medical software:** outcome you can share; team; timeframe; tools; the standard(s) followed; an anonymised critical task; user groups and recruiting; session setup and scoring; what made the report useful.
- **Alpha Factory** (now a featured case): team; the brief; the logo idea; guideline scope; cover, logo, guideline pages, a sub-site screenshot (also the three quick-read visuals).

## Notes: `content/notes/design-to-code.md`
- [ ] Token tooling; what you built yourself vs. with developers; an anonymised contract example; what a Claude skill does in practice; workshop takeaways; numbers; "What I'd do differently".

## About: `content/pages/about.md`
- [ ] Photos for the photo stack (talks, pitches, presentations): two slots
- [ ] Recognition photos: KMU Innovationstag (you presenting), Creative Economies Forum; links for both if there are pages
- [ ] Two personal photos for Outside work

## Side-project tiles: `content/tiles/`
- [ ] Your real 3D print (STL/glTF) and its filament colour
- [ ] Your macro pad / board model (Blender or KiCad export) and a reference photo
- [ ] Books in `3.books.yml`: title, author, one line each
- [ ] 2–3 drawing scans (for the drawing tile)
- [ ] LLM drawing robot CAD export (for its live tile)

## Done
- [x] CV: web version without phone, date of birth or grades at `public/Stepan_Vedunov_CV.pdf`. Source: `~/Documents/Private/Stepan_Vedunov_CV_2026_EN_web.docx`.
- [x] Portrait photos (metadata stripped).
