# Annette Rhee — Portfolio

Astro (static) + GSAP 3 (ScrollTrigger, SplitText, ScrambleText, CustomEase) + Lenis + OGL.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/ (deploy to Vercel or Netlify as-is)
```

## Editing content

All copy lives in `src/data/resume.ts`. Every section renders from it.

Links (LinkedIn, email) are in `person` at the top of that file.

## Images

Until real images exist, each project gets a generated typographic cover. To use a real image:
drop the file into `public/assets/` (replacing the placeholder of the same name), then set the
matching `image` field in `src/data/resume.ts`, e.g. `image: '/assets/ld-social-1.png'`.

| File | Used for | Expected size |
| --- | --- | --- |
| `literature-diversified-logo.png` | Literature Diversified (feature cover) | 1600 × 1000 |
| `ld-social-1.png` | Literature Diversified (alt cover) | 1600 × 1000 |
| `cvusd-newsletter.png` | Conejo Valley USD cover | 1600 × 1000 |
| `cvusd-brochure.png` | Conejo Valley USD (alt) | 1600 × 1000 |
| `jta-event.jpg` | Joy To All cover | 1600 × 1000 |
| `japan-1.jpg` | Recognition: Japan story card (`recognition.japan.image`) | 1200 × 1500 (4:5) |
| `archery.jpg` | Interests hover preview (`skills.interests[0].image`) | 1600 × 1000 |
| `portrait.jpg` | Info page portrait (`portrait` in `src/pages/info.astro`) | 1200 × 1500 |

The placeholder files are neutral gradients made by `node scripts/make-placeholders.mjs`, which also
makes the two animated favicon frames (`public/favicon-1.png`, `favicon-2.png`).

## Structure

- `src/pages/index.astro`, `src/pages/info.astro`
- `src/components/`: Header, Footer, Clock, Transition, WorkRow (feature + gallery variants), Stat, Label, Cover, Arrow, ArrowLink
- `src/scripts/`: lenis, intro, transition, reveals (splits, clip reveals, feature grow, numbers band, parallax), cursorPreview, parallax, hovers, clock, favicon, heroShader, ui (menu, accordion, anchors, header)
- `src/styles/global.css`: tokens (milky palette), type, grid, grain, covers
