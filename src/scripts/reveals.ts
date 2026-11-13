import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { reducedMotion } from './env';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export function initReveals() {
  if (reducedMotion) return; // content is already in its final state

  // Headings: masked lines, yPercent 100 → 0, stagger 0.08, 1s, power4.out, top 85%
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 100,
          duration: 1,
          stagger: 0.08,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      },
    });
  });

  // Paragraphs: lines fade in and rise 20px, stagger 0.05
  document.querySelectorAll<HTMLElement>('[data-fade-lines]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      linesClass: 'fade-line',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          opacity: 0,
          y: 20,
          duration: 1,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });

  // Generic fade-up blocks
  document.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Section labels "(Info)": scramble in on enter
  document.querySelectorAll<HTMLElement>('[data-label]').forEach((el) => {
    const text = el.textContent || '';
    el.dataset.text = text;
    gsap.set(el, { opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.set(el, { opacity: 1 });
        gsap.fromTo(
          el,
          { scrambleText: { text: ' '.repeat(text.length), chars: 'upperCase' } },
          { scrambleText: { text, chars: 'upperCase', speed: 0.6 }, duration: 0.9, ease: 'none' },
        );
      },
    });
  });

  // Images: clip-path reveal + inner scale 1.2 → 1, scrubbed
  document.querySelectorAll<HTMLElement>('[data-clip]').forEach((el) => {
    const inner = el.querySelector<HTMLElement>('[data-cover-inner], img');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: true },
    });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0);
    if (inner) tl.fromTo(inner, { scale: 1.2 }, { scale: 1, ease: 'none' }, 0);
  });

  // Big numbers: count up over 2s when entering view
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count || 0);
    const obj = { v: 0 };
    el.textContent = fmt(0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'power3.out',
          onUpdate: () => { el.textContent = fmt(obj.v); },
        }),
    });
  });

  // Stagger children in lists
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
    gsap.from(el.children, {
      opacity: 0,
      y: 24,
      duration: 0.9,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/** Pause CSS-animated layers (marquees) while out of view or tab hidden. */
export function initInViewPlayback() {
  const els = document.querySelectorAll<HTMLElement>('[data-inview-play]');
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle('is-playing', e.isIntersecting && !document.hidden)),
    { threshold: 0.25 },
  );
  els.forEach((el) => io.observe(el));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) els.forEach((el) => el.classList.remove('is-playing'));
  });
}

/** Featured project: cover grows from a small centred card to full-bleed, then its info rises in. */
export function initFeature() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    document.querySelectorAll<HTMLElement>('[data-feature]').forEach((el) => {
      const media = el.querySelector<HTMLElement>('[data-feature-media]')!;
      const inner = el.querySelector<HTMLElement>('[data-feature-inner]')!;
      const info = el.querySelector<HTMLElement>('[data-feature-info]')!;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true },
      });
      tl.fromTo(media, { clipPath: 'inset(24% 34% 24% 34% round 8px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 0.65 }, 0)
        .fromTo(inner, { scale: 1.35, rotation: -4 }, { scale: 1, rotation: 0, ease: 'power2.inOut', duration: 0.65 }, 0)
        .fromTo(info, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.25 }, 0.62)
        .to({}, { duration: 0.13 });
      // start the scrub from a resting state that is visible before the trigger begins
      gsap.set(media, { clipPath: 'inset(24% 34% 24% 34% round 8px)' });
    });
  });
}

/** Gentle scroll parallax for gallery media. */
export function initScrollParallax() {
  if (reducedMotion) return;
  document.querySelectorAll<HTMLElement>('[data-speed]').forEach((el) => {
    gsap.fromTo(el, { yPercent: 8 }, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/**
 * Skills & Interests (reference-style): sticky title rises in, then blurs/fades as the list scrolls over it;
 * every item sharpens from a blur as it enters; a sticky placeholder card on the left swaps per group.
 */
export function initSkills() {
  const sec = document.querySelector<HTMLElement>('[data-skills]');
  if (!sec) return;
  const title = sec.querySelector<HTMLElement>('[data-skills-title]');
  const list = sec.querySelector<HTMLElement>('.skills__list');
  const cards = Array.from(sec.querySelectorAll<HTMLElement>('[data-skills-card]'));
  const groups = Array.from(sec.querySelectorAll<HTMLElement>('[data-skills-group]'));

  let current = 0;
  const setActive = (i: number) => {
    if (i === current) return;
    cards.forEach((c, j) => {
      c.classList.toggle('was-active', j === current);
      c.classList.toggle('is-active', j === i);
    });
    current = i;
  };
  groups.forEach((g, i) =>
    ScrollTrigger.create({
      trigger: g,
      start: 'top 62%',
      end: 'bottom 62%',
      onToggle: (self) => self.isActive && setActive(i),
    }),
  );

  if (reducedMotion || !title || !list) return;

  gsap.fromTo(
    title,
    { opacity: 0, filter: 'blur(16px)', yPercent: 25 },
    { opacity: 1, filter: 'blur(0px)', yPercent: 0, ease: 'none', scrollTrigger: { trigger: sec, start: 'top 90%', end: 'top 30%', scrub: true } },
  );
  gsap.fromTo(
    title,
    { opacity: 1, filter: 'blur(0px)', scale: 1 },
    {
      opacity: 0.22,
      filter: 'blur(9px)',
      scale: 0.95,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: { trigger: list, start: 'top 70%', end: 'top 5%', scrub: true },
    },
  );

  sec.querySelectorAll<HTMLElement>('[data-skill-item]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0.08, filter: 'blur(8px)', y: 24 },
      { opacity: 1, filter: 'blur(0px)', y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 68%', scrub: true } },
    );
  });
}
