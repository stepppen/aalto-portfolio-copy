# Add-on plan: removals, personal data, side-project tiles

Status: **plan only.** Waiting for your OK before changing code (add-on §7.1).

State: branch `redesign-2026`, last commit `c01cd7b` (v2 foundations: tokens, type, header, footer, Setup panel). Nothing pushed.

---

## 1. What in the current build conflicts with the add-on, and the fix

| # | Conflict | Where | Fix |
|---|---|---|---|
| 1 | **Grade in the home proof line** | `content/site.yml` → `proof` (and the home meta description built from it) | Replace with: `SDA Bachelor Design Award 2025 · Dezeen School Shows · CHF 160k+ raised for Kymu · BA Interaction Design, ZHdK`. |
| 2 | Grade in `education` | `content/site.yml` | Drop the grade sentence. It isn't rendered in v2, but it would be easy to reuse by mistake. |
| 3 | **Age and grade on About** | `content/pages/about.md`: facts "Age", "Studied" with the grade, and the story sentence about the final grade | Remove the age fact. "Studied" becomes "BA Interaction Design, ZHdK". Rewrite the sentence without the grade. |
| 4 | Grade in OG images | `public/og/home.png`, `about.png` (generated from text in `scripts/og.mjs`) | Change the text and regenerate. |
| 5 | **Grade in the web CV** | `public/Stepan_Vedunov_CV.pdf` mentions the grade twice (profile and education) | Same method as the phone number and date of birth: edit a copy of your Word file, remove both mentions, re-export. **Your call:** a CV is usually where grades belong, but the add-on says "anywhere". My default is to remove them from the web CV only; your original stays as is. |
| 6 | **Age and grades in the repo itself** | Old plan docs (`docs/REDESIGN-PLAN.md`, `-v2.md`), and earlier commits on this branch (screenshots, Lighthouse reports, page content) | Redact the docs. The branch has never been pushed, so before the first push I'd **rewrite this branch's history into a few clean commits**, so none of it ever reaches GitHub. The old `redesign-2026-worklife` branch is local only; I'd leave it unpushed and say so. |
| 7 | LLM drawing robot is in the archive | `content/work/archive/3.llm-drawing-robot.md` | It becomes a side-project tile. Its case page stays at `/work/llm-drawing-robot` and the tile links to it, so no old URL breaks. |
| 8 | "TODO" placeholder tags are in capitals | `.todo` tags render "TODO: …" | Render them as `todo: …` in the UI. The `[TODO: …]` markers in your content files stay as they are (that's your convention for editing). |
| 9 | Signal colour is "switch and focus rings only" | Setup panel text, token comment | Add the side-project tiles. |
| 10 | QA script still loops over the old WORK/LIFE modes | `scripts/qa.mjs` | Single pass per width. |

**Already fine (no change):**
- No dark mode, no theme switch, no `prefers-color-scheme` handling. v2 is light only.
- No fader or slider, and no other controls.
- Nav is About · Work · (Notes) · CV, and Notes stays hidden until a note exists.
- No caps in CSS, enforced by Stylelint. The Setup panel is in sentence case.

---

## 2. Work page structure

1. **Case studies:** Kymu, design-to-code pipeline, Calmea and medical software as large cards (the home card style, but stacked).
2. **Side projects and things I make:** square tiles. Two columns on phones, three on desktop. Each has a title, and a grey category line under the tile.
3. **Earlier work:** a compact list of Alpha Factory brand, Volkswagen HMI, VR learning tool and ZVV ticket machine.

About › Outside work gets one paragraph (electronics at home, 3D printing, drawing, reading) linking to the tiles, plus 1–2 personal photos.

---

## 3. Per tile: live WebGL or scrubbable render

Rule of thumb: a tile is **live WebGL** only if its interaction needs it, meaning state changes, free rotation, or content from a YAML file. Otherwise it's a **pre-rendered image sequence** or plain HTML. That's cheaper and closer to photoreal.

| Tile | Approach | Why | What I need from you |
|---|---|---|---|
| **3D printing** (print builds layer by layer; drag ↕ scrubs layers, ↔ rotates) | **Live WebGL.** Your real print as glTF; a clipping plane at the current layer height with a cap, plus a layer-line normal map. Physical material (PLA: roughness ~0.45, a little clearcoat). | It's a two-axis scrub (height × angle). As frames that would be about 90 × 36 = 3,000 images, far too heavy. Live is the only sane way. | The model of something you actually printed (STL, OBJ or Blender file), and the filament colour. |
| **Electronics** (macro pad: pressable keys, LEDs, toggle in signal orange) | **Live WebGL.** Your board as glTF; PCB traces as a baked normal plus colour map. Keys move on press, LEDs are emissive, the toggle animates with the same spring as the read-mode switch. | State changes per key and LED can't be pre-rendered without combinatorial blow-up. | The board model (Blender, or a KiCad 3D export) and a photo for colour reference. |
| **Reading** (book stack; hover slides a book out, shows title and why you liked it) | **Live WebGL, procedural books.** Books are boxes. That isn't a placeholder; it's the right geometry. Spines are drawn from your YAML titles onto a canvas texture, with a paper/cloth roughness map. | Titles come from a file you edit, so the spines can't be baked into a render. | `content/books.yml`: titles, authors, one line each. I won't invent any. |
| **Drawing** (sketchbook tilts with the pointer; dragging leaves a short fading ink stroke) | **No WebGL.** A real scan of your page in a CSS 3D tilt, a soft shadow, and a 2D canvas for the fading ink. | It's a flat object. A photo/scan beats any shader for "real paper", and it costs about 0 KB of library. | 2–3 scans or photos of real drawings. |
| **LLM drawing robot** (plotter arm draws a line drawing; click for a new one) | **Live WebGL** if you can export the CAD model (it exists: the old project has a CAD assembly); otherwise it waits. The arm follows simple path drawings. | The drawing is generated each time, so it can't be pre-rendered. | A glTF/STEP export of the robot from Fusion 360. |

**Launch set (3–4):** printing, electronics and reading, plus drawing when scans exist. The robot goes fifth, when its model is ready. Until then:
- Tiles without real assets show a **clearly labelled procedural placeholder**, for example a stand-in vase with the label "placeholder model".
- Nothing ships to `main` with a placeholder model.

**Look (all live tiles):**
- Light grey panel (`#efefef`, 20 px radius) with the object centred at about 50% of the tile.
- Lighting from `RoomEnvironment` through `PMREMGenerator`, ACES filmic tone mapping, and one soft key light.
- A blurred radial contact-shadow texture under the object, and no visible ground.
- Camera at about 30° FOV, three-quarter view, slightly elevated.
- No bloom and no post-processing.
- `#efefef` becomes a token `--tile` (it's a new primitive, `neutral-100`).

I'll check each tile against a Guglieri tile of the same size, side by side, before moving on (add-on §7.3).

---

## 4. Performance budget

| Item | Budget | How |
|---|---|---|
| Library | **three.js only**, ≤ 170 KB gzip, its own chunk | Dynamically imported on `/work` only, and only when the tile grid comes within about one screen of the viewport. Home, case studies and About never load it. OGL is smaller but has no physical material or PMREM, which this quality bar needs. |
| WebGL contexts | **1** | One shared renderer on a single fixed canvas; each tile draws into its own scissor rectangle. No context limits, one GPU upload. |
| Models | ≤ 300 KB each (meshopt + WebP/KTX2 textures) | `gltf-transform` in a build script. Low poly, with detail in normal maps. |
| Posters | ≤ 35 KB each, AVIF/WebP | Rendered from the same scenes by a build script. They're what you see first, what you see with no WebGL, and what `prefers-reduced-motion` sees until you interact. |
| Rendering | Pixel ratio ≤ 2 | Renders only while a tile is on screen and either interacting or in its short idle motion; otherwise the loop sleeps (no frames at rest). |
| Work page Lighthouse (mobile) | ≥ 95 in all four | The tiles are below the fold, so they don't affect the largest paint. three.js parses after the page is idle, so no long tasks on load. I'll report bundle size and Lighthouse after each tile, as you asked. |

**Accessibility:**
- Canvas is `aria-hidden`.
- Each tile is a focusable element with a text title, a one-line description and keyboard controls: arrow keys scrub/rotate the print, Enter/Space press keys and toggle the switch, arrow keys move between books.
- Touch works for every interaction (pointer events).
- No idle motion under reduced motion.
- With no WebGL, the poster shows, and the description says what you'd see.

---

## 5. New placeholders

1. 3D print model + filament colour
2. Macro pad / board model (+ reference photo)
3. `content/books.yml`: titles, authors, one line each
4. 2–3 drawing scans
5. LLM robot CAD export (glTF/STEP)
6. 1–2 personal photos for About › Outside work
7. One line on each hobby, in your words (I'll only use the four you named)

---

## 6. Decisions for you

| # | Decision | My default |
|---|---|---|
| A1 | Remove grades from the web CV too (§1.5) | Yes |
| A2 | Rewrite this unpushed branch's history before the first push, so age/grades in old commits never reach GitHub (§1.6) | Yes |
| A3 | Launch tiles: printing, electronics, reading (+ drawing with scans); robot later | Yes |
| A4 | Placeholder tags shown as lowercase `todo:` | Yes |
