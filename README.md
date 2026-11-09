# vedunov.com

Personal site of Stepan Vedunov. Nuxt 4 + Nuxt Content, prerendered static, deployed on Netlify.

```bash
npm install
npm run dev        # builds tokens, then http://localhost:3000
npm run generate   # tokens → contrast gate → static build in dist/
npm run lint:css   # component contract: semantic tokens only
```

## WORK / LIFE

The header switch sets `<html data-mode="work|life">`. That's all it does: each mode is a set of
semantic design tokens.

- `tokens/primitives.json`: raw values (never emitted to CSS)
- `tokens/semantic.base.json`: shared semantic tokens (type scale, spacing, motion)
- `tokens/semantic.work.json` / `semantic.life.json`: the two mode sets
- `tokens/build.mjs`: Style Dictionary → `app/assets/css/tokens.css` (+ `@property` colours for the 400 ms tween)
- `scripts/check-contrast.mjs`: fails the build if any text/background pair drops below WCAG AA
- `.stylelintrc.json`: fails lint if a component uses a raw colour or font stack

The initial mode is `?mode=` → saved choice → WORK. The system colour scheme doesn't pick it.

Plan and decisions: `docs/REDESIGN-PLAN.md`. Screenshots per phase: `docs/screenshots/`.
