# QA report (Phase 5)

Branch `redesign-2026`, static build in `dist/`, served locally. Measured 2026-11-06.
Re-run with: `npm run generate`, `npx serve dist -l 4173`, then the commands below.

## Lighthouse, mobile (`RUNS=3 node scripts/lighthouse.mjs`, median of 3 per page)

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| / | 96 | 100 | 100 | 100 | 2.4 s | 0 |
| /work | 98 | 100 | 100 | 100 | 2.2 s | 0 |
| /about | 96 | 100 | 100 | 100 | 2.3 s | 0 |
| /notes | 97 | 100 | 100 | 100 | 2.1 s | 0 |
| /notes/design-to-code | 98 | 100 | 100 | 100 | 2.0 s | 0 |
| /work/kymu | 96 | 100 | 100 | 100 | 2.3 s | 0 |
| /work/calmea | 95 | 100 | 100 | 100 | 2.4 s | 0 |
| /work/medtech-usability | 95 | 100 | 100 | 100 | 2.4 s | 0 |
| /work/alpha-factory | 96 | 100 | 100 | 100 | 2.3 s | 0 |
| /work/volkswagen-hmi | 96 | 100 | 100 | 100 | 2.4 s | 0 |
| /work/vr-learning-tool | 98 | 100 | 100 | 100 | 2.0 s | 0 |
| /work/llm-drawing-robot | 98 | 100 | 100 | 100 | 2.0 s | 0 |
| /work/ticket-machine-zvv | 96 | 100 | 100 | 100 | 2.3 s | 0.001 |

Single runs vary by about ±3 points on this machine, which is why these are medians. Total blocking time is 0 ms everywhere. The `/work` tiles load three.js (131 KB gzip) only after the visitor scrolls or interacts, so it isn't part of page load.

## Accessibility

- **axe-core** (WCAG 2.2 A/AA + best practices), every page at 390 and 1440 px: **0 issues** (`node scripts/qa.mjs axe`).
- **Screen-reader structure** (`node scripts/qa.mjs ax`):
  - one H1 per page, no skipped heading levels, named landmarks
  - every control has a name, no image without alt
  - the read-mode switch is announced as "Full story, switch, off/on"
  - collapsed Full story sections are not exposed until switched on, and Ctrl+F finds them (`hidden="until-found"`)
- **Keyboard** (`PAGE=… node scripts/qa.mjs keyboard`):
  - every stop has a visible focus ring (the signal orange) and a target of at least 24 px; tap targets are 44 px
  - skip link first
  - card row reachable by Tab, arrows are buttons
  - Space toggles the switch, and focus stays on it
  - Delete opens Setup with focus inside it; Esc closes it and returns focus
- **Contrast:** every token pair is checked on each build (`scripts/check-contrast.mjs`); the lowest is the signal colour on panels at 3.34:1 (non-text, needs 3:1).
- **Reduced motion:** the switch jumps with no overshoot and no vibration; tiles have no idle motion; smooth scrolling is off.

## Switch feel

Measured frame by frame:
- The lever travels 28 px with a spring (`cubic-bezier(.34, 1.56, .64, 1)`, 220 ms).
- It peaks at 30.7 px (about 10% overshoot) at about 125 ms and settles by about 200 ms.
- It dips 1.5 px while pressed, and `navigator.vibrate(8)` fires where supported.

## 30-second test (390 × 844)

The first viewport shows:
- **who:** the name, "product designer · Zurich" and the headline "I design products and stay for the build."
- **next steps:** "email me ›" (jumps to the composer) and "see the work ›"
- the top of the first project card

No grades, age or birth date anywhere on the site, in its metadata, the Setup panel or the CV.

## No all-caps

Stylelint fails on `text-transform: uppercase` and small caps. A scan of the built pages found only proper names and codes (CPUX-F, GPT-3.5, ID.4, the `#E8540C` hex value in Setup).

## Links and redirects

- 413 internal links and assets resolve (`node scripts/qa.mjs links`).
- External links all resolve in a browser. LinkedIn (999) and Dezeen (403) block scripted checks: LinkedIn shows its sign-in wall, and Dezeen redirects to `/schoolshows/…` behind a bot check.
- Real 301s in `dist/_redirects` (Netlify), plus an HTML fallback page for each:
  - `/projects/kymu`, `/vr-learning-tool`, `/volkswagen-hmi`, `/llm-drawing-robot`, `/ticket-machine-zvv` → `/work/…`
  - `/playground` → `/`
  - `/cv.pdf` → `/Stepan_Vedunov_CV.pdf`
  - `/work/design-to-code` → `/notes/design-to-code`
- `sitemap.xml` lists the 13 real pages (no redirect stubs); `robots.txt` points to it. Canonical URLs, OG and Twitter tags, and an OG image per page.

## Remaining placeholders

See [PLACEHOLDERS.md](PLACEHOLDERS.md).

## German version (`/de`)

- Every page also exists under `/de` (Swiss High German, `lang="de-CH"`), with `hreflang` links between the two and 26 URLs in the sitemap.
- axe: 0 issues on every German page at 390 and 1440 px.
- Lighthouse mobile, median of 5: `/de` 95, `/de/about` 95 (same as `/about`). Other German pages, single run: 95–98.
- Client-side switching checked headlessly: the header switch keeps you on the same page in the other language, and the nav, titles, `lang` and `hreflang` all follow.

## Performance fix (2026-11-07)

Home and Work had slipped to 94 after the German version and the highlights. Measured cause: the three web fonts (56 KB at top priority) were competing with the first image; with fonts stripped both pages scored 97. Fix: titles now use Inter with tighter tracking (`--tracking-display: -0.075em`) instead of loading Inter Tight as a third font, and the first card image on Home and Work is sized for phones at WebP quality 65. After: every page 95–97 (median of 3), both languages.
