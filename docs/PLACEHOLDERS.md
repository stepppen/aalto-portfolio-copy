# Placeholders

Everything below shows on the site as a dashed `TODO:` tag. Edit the file named, and the tag disappears.
In YAML, wrap any value containing `: ` or starting with `[` in quotes. `node scripts/check-content.mjs` (runs before every build) catches it if you forget.
In Markdown bodies, a placeholder is written `:todo[what's missing]`.

## Decisions waiting on you
- [x] **CV PDF.** Web version without phone, date of birth or grades is at `public/cv.pdf`. Source: `~/Documents/Private/Stepan_Vedunov_CV_2026_EN_web.docx`. To update, edit that file, export as PDF and replace `public/cv.pdf`.
- [ ] **Email.** Confirm `stepan.vedunov@outlook.com` (`content/site.yml`). It's also on your CV, so I assume yes.
- [ ] **LIFE portrait.** Both photos are professional. A more casual photo would suit LIFE better (`media/portrait/life.jpg`, then `npm run ascii`).
- [ ] **Calmea screens.** Are they cleared to show?

## Home — `content/site.yml`, `content/now.yml`, `content/life/`, `content/log/`
- [ ] `lifeIntro`: one-line LIFE intro
- [ ] Now: learning, reading
- [ ] Life entries: Helsinki (one line about the city), something you make (+ photo), a side project, a hobby (+ photo), another place
- [ ] Log dates: Kymu funding per grant, LUKS pilot, closed beta, Calmea spin-off; months for BA, SDA Award, KMU Innovationstag, Creative Economies Forum, CPUX-F
- [ ] Log: two life entries (`0000-life-todo-*.yml`)

## Case studies — `content/work/`
Every featured case has a `reflection` ("What I'd do differently") waiting for your words.

- **Kymu:** beta/pilot numbers you can share; how you designed the exergames.
- **Design-to-code pipeline:** token tooling; what you built yourself vs. with developers; one anonymised contract example; what a skill does in practice; workshop takeaways; numbers (components under contract, workshops).
- **Calmea:** team; what it measures and for whom; design system scope; dashboard views and the hardest data-vis problem; data source; one lesson from building it; cover and screens (if cleared).
- **Medtech usability:** team; timeframe; tools; standard(s) followed; an anonymised critical task; user groups and recruiting; session setup and scoring; what made the report useful; participant/task counts.
- **Alpha Factory:** team; the brief; the logo idea; what the guidelines cover; cover, logo, guideline pages and a sub-site screenshot.

## About — `content/pages/about.md`
- [ ] A paragraph that isn't about work
- [ ] "What I'm like to work with"
- [ ] Two more photos (outside work, a place/hobby/thing you made)
