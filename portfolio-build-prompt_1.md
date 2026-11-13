# Build brief: Annette Rhee portfolio (inspired by art-yakushev.com)

Paste this whole file into Claude Code as the task. Build a short, clean, heavily animated portfolio for a design and marketing student. The reference is https://www.art-yakushev.com/ (Awwwards Site of the Day, Portfolio Honors). Match its feel and motion, not its content. Do NOT copy its images, videos, logos or text.

Every section must be filled from the resume content below. Leave out any section from the reference that has no matching resume content. Do not invent clients, awards or numbers.

---

## 1. Stack (chosen to reproduce the reference's motion exactly)

The reference runs on static HTML + GSAP 3 (ScrollTrigger, SplitText, ScrambleText) + Lenis. Use the same animation engine, wrapped in a static site framework so pages share components.

* **Astro** (latest), static output (`output: 'static'`). Pages: `src/pages/index.astro`, `src/pages/info.astro`.
  * Components: `Header.astro`, `Footer.astro`, `Clock.astro`, `Transition.astro`, `WorkRow.astro`, `Stat.astro`, `Label.astro`.
  * All resume content in `src/data/resume.ts`; every section renders from it.
  * Astro ships zero framework JS, so GSAP and Lenis fully own the DOM (no React re-renders breaking SplitText or ScrollTrigger).
* **GSAP** 3.13+ (all plugins free): `ScrollTrigger`, `SplitText`, `ScrambleTextPlugin`, `CustomEase`. This is the exact engine the reference uses.
* **Lenis** for smooth scroll (the reference's own library and settings).
* **OGL** (tiny WebGL library) for the hero's generative shader background. Fallback to a CSS gradient if WebGL is unavailable or reduced motion is on.
* Page navigation: keep full page loads with the custom blur transition, exactly like the reference. Do NOT use Astro's ClientRouter / View Transitions, because the reference's feel comes from its own overlay, and full loads avoid stale ScrollTrigger and Lenis instances.
* Animation code lives in `src/scripts/` as plain TS modules (`lenis.ts`, `intro.ts`, `transition.ts`, `reveals.ts`, `cursorPreview.ts`, `parallax.ts`, `hovers.ts`, `clock.ts`, `favicon.ts`), imported by a single `<script>` in the base layout. Each page init runs after `document.fonts.ready`.
* Styling: one global CSS file with custom properties plus scoped component styles. No Tailwind.
* Fonts self hosted via `@fontsource` packages (Inter Tight, Instrument Serif) and preloaded.
* Deploy: Vercel or Netlify static.

## 2. What the reference site actually does (measured from its live code)

Reproduce these numbers exactly.

**Smooth scroll (Lenis)**
```js
const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.7, smoothTouch: false });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
history.scrollRestoration = 'manual';
```
Stop Lenis when the mobile menu is open; restart and `ScrollTrigger.refresh()` when it closes.

**Intro / preloader**
* Page starts black with `html.is-intro-locked` (scroll disabled).
* After about 2s the hero reveals; scroll unlocks. Hero name animates in by characters (SplitText, `yPercent: 110 → 0`, stagger 0.03, `power4.out`, 1.2s) inside overflow hidden line masks.

**Page transitions (between the 2 pages)**
* On internal link click: prevent default, show a fixed `.transition` overlay, set `.transition-blur` backdrop filter `blur(0)`, after 300ms animate to `blur(10px)` over 1000ms with `cubic-bezier(0.645, 0.045, 0.355, 1)`, fade page content out, then `location = href` at 1400ms.
* On page load: overlay starts visible and fades/unblurs in about 200ms.
* Skip links with `#`, `target="_blank"` or class `.no-transition`. On `pageshow` with `event.persisted`, reload.

**Hover micro interactions (all `outQuint` style easing: `cubic-bezier(0.22, 1, 0.36, 1)`)**
* Arrow links ("Visit", "LinkedIn ↗"): two stacked SVG arrows in an overflow hidden box. On hover the first slides out `x: 120%` and the second slides in from `-120%`, 600ms.
* Email link: diagonal arrow swap, out to `(100%, -100%)`, in from `(-100%, 100%)`, 650ms.
* Back to top button: arrow slides `y: -120px` and a duplicate comes in from below, 600ms.
* Text links: underline line toggles opacity on hover.
* Labels and nav items: ScrambleText on hover (chars `"upperCase"`, 0.5s), back to original text.

**Cursor follow previews (the signature effect)**
* Each experience row/card has a hidden preview image. On `mouseenter`: preview `scale 0 → 1` (400ms, `power3.inOut`) and `opacity 0 → 1` (600ms, `power3.inOut`). On `mouseleave`: reverse in 500ms.
* While hovering, preview follows the mouse mapped across the card: `x` from `-85%` to `85%` of card width, `y` from `-78px` to `78px`, smoothed (use `gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })`, which matches Webflow smoothing 80).
* Disable on touch devices.

**Mouse parallax in hero**
* 3 to 5 floating layers move against the mouse across the viewport: ±30px, ±1.5rem, ±3.5rem, plus one layer rotating ±8deg on both axes. Use `quickTo` with duration 0.9 (smoothing 90). Resting state is centered.

**Scroll animations (GSAP ScrollTrigger)**
* Every heading: SplitText into lines, each line masked, `yPercent: 100 → 0`, stagger 0.08, 1s, `power4.out`, trigger `top 85%`.
* Paragraphs: lines fade `opacity 0 → 1` and `y: 20 → 0`, stagger 0.05.
* Section labels in parentheses, e.g. `(Info)`, `(Folio)`: ScrambleText in on enter.
* Images: clip path reveal `inset(100% 0 0 0) → inset(0)` plus inner image `scale 1.2 → 1`, scrubbed.
* Big numbers (stats): count up when entering view over 2s (the reference plays a "years" Lottie for this).
* Footer: curtain reveal. Main content has a solid background and sits above a `position: sticky; bottom: 0` footer, so the footer is uncovered as you scroll past.

**Small details that make it feel premium**
* Live local clock in the header and footer: `BERKELEY 09:18 AM`, updates every second.
* Animated favicon: swap between 2 PNG frames every 900ms (pause when tab hidden).
* Background videos/animated layers only play while in view (IntersectionObserver, threshold 0.25) and pause when the tab is hidden.
* `--sbw` CSS variable for scrollbar width so fixed elements do not jump when scroll locks.
* Respect `prefers-reduced-motion`: no Lenis, no parallax, instant reveals.

## 3. Visual system

* Background `#000`, text `#fff`, secondary text `rgba(255,255,255,0.5)`, hairline borders `rgba(255,255,255,0.15)`.
* One accent color, used sparingly (labels, hover states). Suggest a warm red `#E8452C` or let me choose.
* Fonts (free substitutes for the reference's Suisse + Apparel):
  * Grotesk: **Inter Tight** 400/500 (or PP Neue Montreal if licensed).
  * Serif italic: **Instrument Serif** italic.
* Headline style: mix both in one line, e.g. `Annette` in grotesk + *Rhee* in serif italic. Display size `clamp(4rem, 11vw, 10rem)`, line height 0.88, letter spacing −0.035em.
* UI text: 11 to 12px uppercase, letter spacing 0.02em (nav, labels, clock, socials).
* Grid: 12 columns, 1.25rem gutters, generous vertical space (sections about 120 to 200px apart).
* Subtle film grain overlay (SVG noise, opacity 0.05) over everything.

## 4. Visuals (she has few, so design around that)

Create an `/assets` folder with clearly named placeholders she can swap later:
`literature-diversified-logo.png`, `ld-social-1.png`, `cvusd-newsletter.png`, `cvusd-brochure.png`, `jta-event.jpg`, `japan-1.jpg`, `archery.jpg`, `portrait.jpg`.

Until real images exist, generate the visuals in code so nothing looks empty:
* Typographic covers: each project card gets a full bleed card with a big outlined number, the org name in serif italic, a soft gradient and grain. These are also the cursor follow previews.
* Hero background: a slow looping generative layer (CSS/Canvas gradient mesh or WebGL noise) instead of a video, in black and accent tones.
* Stats as visuals: huge numbers (16,000+, 760+, 1,000+, 900+, 27, 50+) are the imagery.

## 5. Pages and content (only from the resume)

### Page 1: `index.astro`

**Header (fixed):** `Annette Rhee` wordmark left · `BERKELEY 09:18 AM` clock · nav right: Home, Info, Contact (scroll to footer).

**Hero (100svh):**
* Top center tagline, small: *A Designer & Storyteller* for brands, causes and communities that want to be heard. (Grounded in her marketing + comp lit + cog sci.)
* Left edge `A`, right edge `®` style markers at mid height (use `AR` monogram).
* Bottom: giant `Annette` *Rhee*.
* Bottom bar: clock left, `LinkedIn` center, nav right.
* Mouse parallax layers over the generative background.

**(Info) Intro:** "Comparative Literature & Cognitive Science at UC Berkeley, Class of 2029. I design visual identities, campaigns and content that move people, and I study why they move." Link: About me → `/info`.

**(Folio) Selected work:** a list of large rows, each with cursor follow preview, number, role, dates, one line, and a stat.
1. **Literature Diversified**, Director of Marketing, Dec 2024 to Jun 2025, Los Angeles. Designed the visual identity, logo and campaign graphics; grew Instagram to 900+; curriculum used across 760+ partner classrooms. Tags: Brand Identity, Social, Campaigns.
2. **Conejo Valley USD Communications**, Student Intern, Oct 2024 to May 2025. Weekly newsletters reaching 16,000+ students, parents and teachers; brochures and graphics for public health and school choice campaigns across 27 institutions (Canva, Photoshop). Tags: Editorial, Print, Public Campaigns.
3. **UC Irvine Ethics Center**, Student Researcher, Jul to Aug 2025. Research on the psychological and societal impact of rapid AI; the "seductions of certainty"; findings incorporated into Helen Haste's research. Tags: Research, Presentation.
4. **Joy To All (JTA)**, Co founder & Secretary, Jun 2023 to Jun 2026. 50+ volunteers, 3 high school chapters, 2 fundraisers a month, support for troops in 30 countries and 100 shelter residents. Tags: Community, Partnerships, Outreach.

**Numbers strip:** count up stats: 16,000+ reached · 760+ classrooms · 1,000+ service hours · 900+ followers · 27 institutions · 50+ volunteers.

**(Recognition):** Congressional Award Gold Medal, Jan 2026. Include the 5 day independent research exploration of Japan (post WWII history) as a small visual story card (placeholder `japan-1.jpg`).

**(Skills & Interests):** two columns like the reference's Capabilities / Expertise lists, plus a third.
* Tools: Adobe Photoshop, After Effects, Figma, Canva, WordPress, Finalsite, Apple Logic Pro.
* Capabilities: UI/UX, Website Design, Market Research, Decking, Communication.
* Interests: Olympic Recurve Archery, Creative & Opinion Writing, Graphic Design, Music (Vocals, Guitar, Production).
* Languages: English, Korean.
Render interests as a marquee or a hover list where each item shows a cursor follow preview (archery, writing, music).

**Footer (curtain reveal):** big `Let's talk` heading, email `anetrhee@berkeley.edu` with diagonal arrow hover, LinkedIn link, clock, `©2026 Annette Rhee`, Back to top button, giant wordmark at the very bottom.

### Page 2: `info.astro`

* Portrait slot + short bio.
* Education: UC Berkeley, B.A. Comparative Literature & B.A. Cognitive Science, expected May 2029. Additional: Stanford Daily Multimedia Summer Program; Stanford Pre Collegiate Summer Institutes.
* Full experience list with every resume bullet, as an expandable accordion (height animation, 500ms).
* Community (Congressional Award, JTA) with full bullets.
* Skills & Interests again in detail.
* Same header, footer and transitions.

Optional page 3 only if it stays short: `work.astro` with one case study for Literature Diversified (brand identity process: problem, logo explorations, social templates, result 900+). Skip if there are no real images yet.

## 6. Responsive

* Under 768px: no cursor previews, no parallax; previews become inline images inside each row. Mobile menu is a full screen overlay with staggered links and Lenis stopped.
* Display type scales with `clamp`. Test at 375, 768, 1440, 1920.

## 7. Quality bar (check before you finish)

* 60fps scroll in Chrome DevTools performance panel; only animate `transform`, `opacity`, `clip-path`, `filter`.
* Lighthouse: Performance 90+, Accessibility 95+. Real `<a>` and `<button>` elements, visible focus states, alt text, semantic sections.
* Fonts preloaded, `font-display: swap`, SplitText runs after `document.fonts.ready`.
* Nothing invented beyond the resume. Every placeholder image is listed in a `README.md` with its expected size (covers 1600x1000, portrait 1200x1500).
* Run it, open it, scroll the full page, hover every row, click between pages, and fix anything that stutters or looks empty before calling it done.
