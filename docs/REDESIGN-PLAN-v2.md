# vedunov.com, v2: "Clean, with a few physical controls" · Phase 1

Status: **plan only.** Nothing is built for this direction yet. Waiting for your OK on §9.

---

## 1. Where things stand

You sent this brief while Phase 5 of the previous direction (WORK/LIFE switch, ASCII) was running. I stopped it and saved everything as commit `2f4a601` on `redesign-2026` in `~/Documents/Private/vedunov-com`. Nothing is pushed.

**Stack (unchanged, already upgraded):** Nuxt 4.6, Nuxt Content 3 (Markdown/YAML with schemas), Nuxt Image (images pre-rendered at build), `@nuxt/fonts` (self-hosted, `font-display: swap`). The site is static (`nuxt generate`), with Netlify serving `dist/` and the `netlify-static` preset writing real 301s and headers. The live site is still the old one on Netlify, built from `main`.

**What carries over to v2** (no point rebuilding it):

| Keep | Change | Cut |
|---|---|---|
| Nuxt 4 + static build, Netlify config, 301s from `/projects/*` | Token values: light only, new names (`--bg`, `--ink`, …) | WORK/LIFE switch, LIFE feed, mode tokens |
| Content model: `work/*.md` with frontmatter (outcome, role, team, tools, context, myRole, results, reflection) | Case-study template → Valdivia layout + read-mode switch | ASCII portrait, ASCII "develop", cover grids |
| All case-study text written so far (Kymu, Calmea, medtech, Alpha Factory, archive) | Design-to-code essay moves from Work to **Notes** | Log, Now, Life entries (except languages/Helsinki → About) |
| Token build (Style Dictionary) + contrast gate + Stylelint "semantic tokens only" | Footer, header, all components restyled | `/colophon` page (becomes the Setup panel) |
| Your photos (metadata stripped), web CV (no phone/DOB) | CV file renamed `Stepan_Vedunov_CV.pdf` | Bracket links, Instrument Serif, local clock |
| OG images, sitemap/robots, canonical, image-size manifest (no layout shift) | OG images re-drawn without ASCII | Every `text-transform: uppercase` |
| QA scripts: axe on every page, keyboard walk, link check, Lighthouse | | |

**Branch:** the brief says to build on a new branch `redesign-2026`, but that name holds the old direction. See D1 in §9.

**Performance lesson from the old Phase 5:** Lighthouse mobile only reached 95+ once fonts were trimmed to the weights actually used (static files, latin subset, no preloads) and component CSS was inlined. The type choice below is made with that in mind.

---

## 2. What I took from the references

**gabrielvaldivia.com** (screenshots taken at 390 and 1440):
- Header: name left in mid-grey, regular weight. Nav right, small and grey. On mobile, a round menu button.
- Headline at about 100 px, weight 400, very tight tracking, two lines, black on white.
- Cards: about 16 px radius, nearly full width, image fills the card. Bottom-left: title (white, about 24 px), one-liner (white, 80%), mono pill tags. Bottom-right: a translucent dark box with the quote and the name in grey. The next card peeks in about 120 px from the right.
  - On mobile, the card stacks image, title, tags and quote, with a full-width white "View work →" button.
- About teaser: photo left (about 25% width, rounded), statement in about 34 px right, two paragraphs, then "Read more ›" in grey.
- Approach: number in grey, title in about 22 px, text right, hairlines between.
- Case study (`/work/kale`):
  - Giant title, about 150 px.
  - Intro paragraph left; a spec block right with labels in small grey mono (Team avatars, Services pills, Date).
  - Full-width hero with no radius.
  - "Hardware" heading left, text right, then media on a light-grey panel (`#F5F5F5`-ish).
- **Their tags and spec labels are all caps. Per your rule, ours won't be.**

**henryheffernan.com:** a black screen with a white double-line box, monospace, "Click start to begin". I'll take **only** the boxed monospace look for the Setup panel. No start screen.

---

## 3. Positioning

Must read in one glance to a corporate recruiter. All of these use only facts you gave.

1. **(recommended)** *Product designer who builds the bridge to code.* Your line. The eyebrow above it carries "Zurich · OWT + Kymu", so it doesn't need to say more.
2. *Product designer for health and enterprise software. I design it, then help build it.* More concrete about domain; longer, three lines on a phone.
3. *UX/UI designer for complex software, from user research to working code.* Uses the job-title words recruiters search for.
4. *Product designer in Zurich. Medical and enterprise software, design to code.* Shortest; two lines at 390 px.

---

## 4. Type

Learned from Phase 5: two variable fonts cost about 100 KB and roughly 5 Lighthouse points on mobile. So: static files, only the weights in use.

- **A (recommended):**
  - Inter Tight 400 for display, which stands in for Inter Display. It's tight by design, so tracking can be −0.03em at 100 px.
  - Inter 400 and 500 for text.
  - Geist Mono 400 for labels, tags and the Setup panel.
  - About 75 KB total, latin only.
- **B:** Geist 400/500 and Geist Mono 400. One family, a little more technical, about 60 KB. Less like Valdivia.

Scale (fluid, `clamp()`):

| Role | Size |
|---|---|
| Display (home headline) | 44 → 104 px |
| Case-study title | 56 → 160 px |
| Statement | 26 → 36 px |
| Heading | 20 → 24 px |
| Body | 17 px |
| Small | 15 px |
| Mono | 13 px |

No uppercase anywhere, including mono labels. Stylelint gets a rule that fails on `text-transform: uppercase`.

---

## 5. Signal colour: three options

Used only on the switch cap and focus rings. Those are non-text UI, so they need **3:1** against what they sit on.

| Option | Hex | on `--bg` #FFF | on `--panel` #F4F4F2 | Feel |
|---|---|---|---|---|
| **A. Hardware orange (recommended)** | `#E8540C` | 3.68 ✓ | 3.34 ✓ | The coloured cap on a Braun/TE switch. Warm, unmistakably "a control". |
| B. Signal red | `#D7261E` | 5.02 ✓ | 4.56 ✓ | Classic emergency/record red. Strongest contrast, but reads as "error" in forms. |
| C. Cobalt | `#2148D8` | 7.04 ✓ | 6.39 ✓ | Calm, corporate-safe. Least "physical", and looks like a link. |

Rejected: pure safety orange `#FF5F00`, which is only 2.77:1 on the panel.

---

## 6. Tokens

```
tokens/primitives.json   white, neutral-50…950, orange-600
tokens/semantic.json     → CSS custom properties on :root (one set: light only)
```

| Semantic token | Value | On `--bg` | On `--panel` | Use |
|---|---|---|---|---|
| `--bg` | `#FFFFFF` | | | Page |
| `--panel` | `#F4F4F2` | | | Media panels, inputs, quote boxes on light |
| `--ink` | `#111111` | **18.9** | **17.2** | Text |
| `--ink-muted` | `#6B6B6B` | **5.33** | **4.84** | Secondary text, name in header, nav, mono labels |
| `--line` | `#E5E5E3` | 1.26 | | Hairline dividers, decorative only |
| `--line-strong` | `#8C8C8C` | **3.36** | **3.05** | Input and switch borders (3:1 for UI) |
| `--signal` | `#E8540C` | **3.68** | **3.34** | Switch cap, focus ring only |
| `--on-media` | `#FFFFFF` on a scrim | ≥ 4.5 | | Card text over photos |

**Card text over images:** a bottom gradient scrim (black at 0 → 60%) behind title and tags, and the quote box at `rgb(0 0 0 / 0.45)` with blur. White on 55% black over a white photo still measures **4.74:1**, so text stays readable over any image.

**Pipeline line for the Setup panel:** "tokens: primitives → semantic → components, compiled and contrast-checked on every build, same pipeline I use at work." That's the only place it's mentioned.

---

## 7. The two controls

### 7.1 Read-mode switch: `Quick read ⇄ Full story` (every case study)

- **Markup:**
  - `<button role="switch" aria-checked="false">` with visible text on both sides ("Quick read", "Full story").
  - The accessible name is "Full story", so "on" means full story.
  - Native button, so Space and Enter work. The tap target is at least 44 px tall.
- **Feel:**
  - The lever travels with a short spring, `cubic-bezier(.34, 1.56, .64, 1)` over about 220 ms.
  - Pressing nudges the whole switch down 1–2 px.
  - `navigator.vibrate(8)` fires where supported, and not under reduced motion.
  - Under `prefers-reduced-motion` the lever jumps with no overshoot.
  - The cap is `--signal`; the housing has a hairline and an inset shadow.
- **Quick read (default):** TL;DR (problem · my role · what I did · outcome), the hero, and 2–3 key visuals, marked `key: true` in the Markdown.
- **Full story:** every section.
  - The extra sections sit in the HTML with `hidden="until-found"`, so they're in the source for SEO.
  - Ctrl+F still finds text in them, and finding it opens Full story automatically (`beforematch` event).
  - Screen readers get them once the switch is on, which is what "collapsed" means for them.
  - With JS off, everything shows, because the `hidden` attribute is added by JS before first paint.
- **Memory:**
  - `localStorage.readMode` (in try/catch) carries the choice across case studies.
  - A pre-paint inline script applies it, so nothing jumps.

### 7.2 Setup panel (easter egg)

- **Opens with:**
  - the **Delete** key (`key === 'Delete'`). It never fires while you type in a field, and never on Backspace, so the contact form is safe.
  - On a Mac keyboard that's fn + delete.
  - Or the small `setup` link in the footer, which is how keyboard and touch users find it.
- **Built as:**
  - A native `<dialog>`, which gives a focus trap, Esc to close and focus return for free.
  - Monospace, inverted (`--ink` background, white text), a double-line box border, one highlighted row in `--signal`.
  - No colours beyond the tokens.
- **Content:** stack · tokens (the one-line pipeline note) · accessibility (WCAG 2.2 AA, axe result) · performance (the last Lighthouse scores, read from a file the QA script writes) · `esc to close`.

### 7.3 "System" text (that's all of it)

- Eyebrow above the headline: `status: ok · Zurich · OWT + Kymu`, in mono, grey, lowercase.
- Footer: `© 2026 · all content loaded`.

---

## 8. What I'd cut, and things in the brief that conflict

1. **"Three physical levers/toggles" vs. "one physical switch (and nothing more)".** The opening sentence says three; the detailed section says one. I'll build **one**, the read-mode switch. A second toggle with no hiring job would be noise.
2. **The 30-second test vs. the proof line at section 5.** On a phone, section 5 is about four screens down, so "proof" isn't in the first viewport. Proposal: a short grey proof line directly under the headline: `SDA Award 2025 · Dezeen · CHF 160k+ raised`. Next to it, an "Email me" link. Section 5 is then dropped as a duplicate. Role, proof and contact all land above the fold at 390 px.
3. **"From" in the mail composer.** A `mailto:` link can't set the sender; the mail app always uses the visitor's account. I'd make it **"Your name"** and add it to the message signature. Otherwise the field promises something it can't do.
4. **Valdivia's work grid with view counts**: cut. Counts are noise for a recruiter.
5. **Collaborator quotes:** shown as visible `[TODO: quote from …]` placeholders while we build, per your rules. **Before launch**, any card still without a real quote should hide its quote box rather than ship a TODO. I'd add a check that fails the production build if a TODO is still in a quote.
6. **Mobile menu:** Valdivia uses a hamburger. With four short items (About · Work · Notes · CV) everything fits in one row at 390 px with 44 px targets, so no hamburger.
7. **Local clock, life feed, log, ASCII, colophon page**: cut. They fail the "signal over noise" rule.

---

## 9. Decisions for you

| # | Decision | My recommendation |
|---|---|---|
| **D1** | Branch name: `redesign-2026` already holds the old direction. | Rename it to `redesign-2026-worklife` (kept, never deleted) and start the new `redesign-2026` from it, since §1's "keep" column is all there. The alternative is a fresh branch from `main`, which redoes about two phases of plumbing. |
| **D2** | Positioning | #1 |
| **D3** | Signal colour | A, hardware orange `#E8540C` |
| **D4** | Type | A: Inter Tight / Inter / Geist Mono |
| **D5** | Proof line under the headline (instead of section 5) + "Email me" | Yes (§8.2) |
| **D6** | "From" → "Your name" | Yes (§8.3) |
| **D7** | One switch, not three | Yes (§8.1) |
| D8 | Alpha Factory moves from featured to archive (as in this brief) | Yes, as written |

---

## 10. Wireframes (low-fi)

`═══ fold ═══` marks the bottom of the first viewport (390×844 phone, 1440×900 desktop).

### 10.1 Home · 1440

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Stepan Vedunov (grey)                                         About   Work   Notes   CV ↓   │
│                                                                                             │
│ status: ok · Zurich · OWT + Kymu                                       (mono, grey, small)  │
│                                                                                             │
│ Product designer who builds                                                                 │
│ the bridge to code.                                     (Inter Tight 400, ~104px, −0.03em)  │
│                                                                                             │
│ SDA Award 2025 · Dezeen · CHF 160k+ raised for Kymu      Email me ›   (grey/link)  │
│                                                                                             │
│ ┌────────────────────────────────────────────────────────────────────────────┐ ┌──────────  │
│ │                                                                            │ │            │
│ │                    Kymu cover (radius 16, fills card)                      │ │  Design-   │
│ │                                                                            │ │  to-code   │
│ │                                                         ┌────────────────┐ │ │  (peeks)   │
│ │ Kymu                                                    │ "[TODO: quote  │ │ │            │
│ │ Home physio as a game for children…                     │  from Elia]"   │ │ │            │
│ │ (health) (service design) (research)  ← mono pills,     │  Elia Salerno  │ │ │            │
│ │                                         sentence case   └────────────────┘ │ │            │
│ └────────────────────────────────────────────────────────────────────────────┘ └──────────  │
═══ fold ════════════════════════════════════════════════════════════════════ ‹  ›  (arrows) ═
│                                                                                             │
│ ┌──────────┐   I design software for places where mistakes are expensive,                   │
│ │  photo   │   and I make sure it survives the trip to code.  [TODO: confirm wording]       │
│ │ (radius) │   Two short paragraphs, first person…                                          │
│ └──────────┘   Read more ›                                                                  │
│                                                                                             │
│ How I work                                                                                  │
│ ─────────────────────────────────────────────────────────────────────────────────────────── │
│ 1   Research with real users      Usability tests with patients and physios at LUKS; …      │
│ ─────────────────────────────────────────────────────────────────────────────────────────── │
│ 2   Systems and tokens            …                                                         │
│ 3   Prototyping in code           …                                                         │
│ 4   Shipping in regulated fields  …                                                         │
│                                                                                             │
│                     Building something? Let's talk.               (centred, ~56px)          │
│              ┌───────────────────────────────────────────────┐                              │
│              │ To       stepan.vedunov@outlook.com    [copy] │                              │
│              │ Your name ______________________________       │                              │
│              │ Subject  ______________________________        │                              │
│              │ Message  ______________________________        │                              │
│              │                                [ Send ]  ← mailto                            │
│              └───────────────────────────────────────────────┘                              │
│ ─────────────────────────────────────────────────────────────────────────────────────────── │
│ © 2026 · all content loaded           ✉  in  gh               setup · CV · sitemap  (mono)  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Home · 390

```
┌──────────────────────────────┐
│ Stepan Vedunov               │
│ About Work Notes CV↓         │ ← one row, 44px targets
│                              │
│ status: ok · Zurich ·        │
│ OWT + Kymu                   │
│                              │
│ Product designer             │
│ who builds the               │ ← ~44px
│ bridge to code.              │
│                              │
│ SDA Award 2025 · Dezeen ·    │ ← role ✓ proof ✓
│ CHF 160k+ raised             │
│ Email me ›                   │ ← contact ✓
│ ┌──────────────────────────┐ │
│ │ Kymu cover               │▐│ ← swipe; next card peeks
═══ fold (844) ══════════════════
│ │ Kymu                     │ │
│ │ Home physio as a game…   │ │
│ │ (health) (research)      │ │
│ │ ┌──────────────────────┐ │ │
│ │ │ "[TODO: quote]"      │ │ │
│ │ └──────────────────────┘ │ │
│ │ [ View case study → ]    │ │
│ └──────────────────────────┘ │
│ ● ○ ○ ○                      │ ← position, not a control
│ photo                        │
│ statement + 2 paragraphs     │
│ How I work 1–4 (stacked)     │
│ Let's talk + composer        │
│ footer                       │
└──────────────────────────────┘
```

### 10.3 Case study · 1440 · **Quick read** (default)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Stepan Vedunov                                                About   Work   Notes   CV ↓   │
│                                                                                             │
│ Kymu                                                              (Inter Tight, ~160px)     │
│                                                                                             │
│ Home physio as a game for children with              Team      (EV)(SV) Elia S., Stepan V.  │
│ neuromuscular conditions. Started as my thesis,      Services  (ux/ui) (research) (brand)   │
│ now a funded research project.                       Date      2025–now                     │
│                                                      Role      Design lead                  │
│                                                                                             │
│  Quick read [■■|   ] Full story        ← switch, orange cap                                 │
═══ fold ════════════════════════════════════════════════════════════════════════════════════ ═
│ TL;DR                                                                                       │
│ Problem      Home exercises are hard to keep up; therapists can't see them.                 │
│ My role      Design lead: research, UX/UI, exergames, brand.                                │
│ What I did   Therapist platform, app, TV interface; tests at LUKS.                          │
│ Outcome      CHF 160k+ raised · clinical pilot · closed beta · SDA Award 2025               │
│                                                                                             │
│ ┌─────────────────────────────── full-width hero ─────────────────────────────────────────┐ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│ ┌──── grey panel: key visual 1 ────┐ ┌──── grey panel: key visual 2 ────┐                    │
│                                                                                             │
│ [ Read the full story ↓ ]   ← same switch, repeated at the end of the quick read            │
│ Next — Design-to-code pipeline →                                                            │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 10.4 Case study · 1440 · **Full story**

```
│ … same header, intro, spec, switch (now ON) …                                               │
│ TL;DR (unchanged)                                                                           │
│ hero                                                                                        │
│ Research              Text column…                                                          │
│ ┌──────────────────────────── grey panel: media ───────────────────────────────────────┐    │
│ Therapist platform    Text…                                                                 │
│ ┌──────────────────────────── grey panel ──────────────────────────────────────────────┐    │
│ App and TV · Exergames · Testing  (same pattern)                                            │
│ Outcome               CHF 160k+ · 1 clinical pilot · closed beta · SDA Award 2025           │
│                       ┌──────────────────────────────────────────┐                          │
│ Quote                 │ "[TODO: quote from a physio or Elia]"     │                          │
│                       └──────────────────────────────────────────┘                          │
│ What I'd do           [TODO: one line, your voice]                                          │
│ differently                                                                                 │
│ Next — Design-to-code pipeline →                                                            │
```

### 10.5 Case study · 390, both modes

```
QUICK READ                         FULL STORY
┌──────────────────────────┐      ┌──────────────────────────┐
│ Stepan Vedunov           │      │ (same top)               │
│ About Work Notes CV↓     │      │                          │
│ Kymu          (~56px)    │      │ Quick read [  |■■] Full  │
│ Home physio as a game…   │      │ TL;DR                    │
│ Team   (EV)(SV)          │      │ hero                     │
│ Services (ux/ui)(brand)  │      │ Research                 │
│ Date   2025–now          │      │ text…                    │
│ Role   Design lead       │      │ grey panel media         │
│ Quick read [■■|  ] Full  │      │ Therapist platform …     │
═══ fold ════════════════  │      │ … all sections …         │
│ TL;DR (4 rows, stacked)  │      │ Outcome · Quote          │
│ hero                     │      │ What I'd do differently  │
│ key visual 1, 2          │      │ Next →                   │
│ [ Read the full story ↓ ]│      └──────────────────────────┘
│ Next →                   │
└──────────────────────────┘
```

---

## 11. Placeholders (as of v2 Phase 1)

New in this brief:
1. `[TODO: quote from Elia]`, Kymu card + case study
2. `[TODO: quote]`, design-to-code card (a colleague at OWT; no client names)
3. `[TODO: quote]`, Calmea card (someone from the lab)
4. `[TODO: quote]`, medical software card (anonymised)
5. `[TODO: about-teaser statement + 2 short paragraphs]`. I'll draft from facts; you approve the wording.
6. `[TODO: hobbies + 2–3 personal photos]`, About › Outside work
7. `[TODO: "what I'd do differently", one line per case]`
8. Team avatars: I only have your photo. Others are initials circles unless you send photos.

Carried over (still open): Kymu beta/pilot numbers and exergame process · pipeline specifics (tooling, a contract example, workshop takeaways, numbers) · Calmea team, context, scope, screens clearance · medtech team, timeframe, standard, user groups, counts · Alpha Factory team, brief, media · log/month dates are no longer needed (Log is cut).
