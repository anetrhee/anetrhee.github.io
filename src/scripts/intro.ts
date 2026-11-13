import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { reducedMotion } from './env';
import { startScroll, stopScroll } from './lenis';

/**
 * Opening sequence, built on the reference's monogram → side-marker move:
 *  1. espresso curtain; corner details + a 000→100 counter
 *  2. a huge cream "A (R)" rises out of masks, slowly shrinking, while a hairline seam draws down the middle
 *  3. the curtain splits open at the seam: the left half carries the A away, the right half the R.
 *     Both letters shrink onto the fixed side markers and turn from cream to espresso as they cross onto
 *     the light page, while the hero comes into focus from a blur behind the opening
 *  4. the name rises by characters (yPercent 110 → 0, stagger 0.03, power4.out)
 * The monogram is rendered large and only ever scaled down, so it stays crisp.
 * Full length on the first visit of a session; compressed on return visits.
 */
export function initIntro(): Promise<void> {
  const html = document.documentElement;
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const name = document.querySelector<HTMLElement>('.hero__name');
  const unlock = () => {
    html.classList.remove('is-intro-locked');
    startScroll();
  };

  if (!intro || !name || !hero) { unlock(); return Promise.resolve(); }
  if (reducedMotion) { intro.remove(); unlock(); return Promise.resolve(); }

  stopScroll();
  let seen = false;
  try { seen = sessionStorage.getItem('ar-intro') === '1'; sessionStorage.setItem('ar-intro', '1'); } catch {}
  const k = seen ? 0.45 : 1;

  const $ = <T extends HTMLElement>(s: string) => intro.querySelector<T>(s)!;
  const panelL = $('[data-intro-pl]');
  const panelR = $('[data-intro-pr]');
  const seam = $('[data-intro-seam]');
  const meta = Array.from(intro.querySelectorAll<HTMLElement>('[data-intro-meta] span'));
  const counter = $('[data-intro-count]');
  const wrapA = $('[data-intro-wa]');
  const wrapR = $('[data-intro-wr]');
  const bigA = $('[data-intro-a]');
  const bigR = $('[data-intro-r]');
  const sideA = document.querySelector<HTMLElement>('.side-marks__a');
  const sideR = document.querySelector<HTMLElement>('.side-marks__r');
  const sideVisible = !!sideA && sideA.getBoundingClientRect().width > 0;

  // Hero: name chars waiting below their masks; layers blurred
  const split = SplitText.create(name, { type: 'lines,chars', mask: 'lines', linesClass: 'split-line' });
  gsap.set(split.chars, { yPercent: 110 });
  const fades = document.querySelectorAll<HTMLElement>('[data-hero-fade]');
  gsap.set(fades, { opacity: 0, y: 12 });
  const heroLayers = hero.querySelectorAll<HTMLElement>('.hero__bg, .hero__layer');
  gsap.set(heroLayers, { opacity: 0.4, filter: 'blur(26px)', scale: 1.08 });
  if (sideVisible) gsap.set([sideA, sideR], { opacity: 0 });

  // Measure travel from each big mark (unscaled) to its side marker
  const DRIFT = 0.86;
  const travel = (wrap: HTMLElement, small: HTMLElement | null, side: -1 | 1) => {
    const b = wrap.getBoundingClientRect();
    const bx = b.left + b.width / 2;
    const by = b.top + b.height / 2;
    if (small && sideVisible) {
      const s = small.getBoundingClientRect();
      return { x: s.left + s.width / 2 - bx, y: s.top + s.height / 2 - by, scale: s.width / b.width, fade: false };
    }
    return { x: side * window.innerWidth * 0.55, y: 0, scale: 0.4, fade: true }; // mobile: ride out with the panels
  };
  const tA = travel(wrapA, sideA, -1);
  const tR = travel(wrapR, sideR, 1);

  gsap.set([bigA, bigR], { yPercent: 105 });
  gsap.set([wrapA, wrapR], { scale: 1.12 });

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(heroLayers, { clearProps: 'filter,scale' });
        resolve();
      },
    });

    // 1. corner details + counter
    const n = { v: 0 };
    tl.to(meta, { opacity: 1, duration: 0.8 * k, stagger: 0.08 * k, ease: 'power2.out' }, 0.15 * k)
      .to(n, {
        v: 100,
        duration: 2.9 * k,
        ease: 'power2.inOut',
        onUpdate: () => { counter.textContent = String(Math.round(n.v)).padStart(3, '0'); },
      }, 0.15 * k);

    // 2. monogram rises out of its masks, then keeps shrinking slowly; seam draws down
    tl.to(bigA, { yPercent: 0, duration: 1.3 * k, ease: 'power4.out' }, 0.35 * k)
      .to(bigR, { yPercent: 0, duration: 1.3 * k, ease: 'power4.out' }, 0.5 * k)
      .add(() => { wrapA.style.overflow = 'visible'; wrapR.style.overflow = 'visible'; }, 1.85 * k)
      .to([wrapA, wrapR], { scale: DRIFT, duration: 2.8 * k, ease: 'power1.inOut' }, 0.35 * k)
      .to(seam, { scaleY: 1, duration: 1.4 * k, ease: 'expo.inOut' }, 1.6 * k)
      .to(meta, { opacity: 0, duration: 0.5 * k, ease: 'power2.in' }, 3.0 * k);

    // 3. split: panels part at the seam, letters ride out and land on the side markers
    const open = 3.2 * k;
    const dur = 1.7 * k;
    tl.to(seam, { opacity: 0, duration: 0.3 * k }, open)
      .to(panelL, { xPercent: -101, duration: dur, ease: 'expo.inOut' }, open)
      .to(panelR, { xPercent: 101, duration: dur, ease: 'expo.inOut' }, open)
      .to(wrapA, { x: tA.x, y: tA.y, scale: tA.scale, duration: dur, ease: 'expo.inOut' }, open)
      .to(wrapR, { x: tR.x, y: tR.y, scale: tR.scale, duration: dur, ease: 'expo.inOut' }, open)
      .to([bigA, bigR], { color: '#231d1a', duration: dur * 0.6, ease: 'power1.inOut' }, open + dur * 0.25)
      .to(heroLayers, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 2 * k, ease: 'power3.out', stagger: 0.06 }, open + 0.2 * k)
      .add(() => unlock(), open + dur * 0.6);

    const landed = open + dur;
    if (tA.fade) tl.to([wrapA, wrapR], { opacity: 0, duration: 0.5 * k }, landed - 0.6 * k);
    else tl.set([sideA, sideR], { opacity: 1 }, landed).set([wrapA, wrapR], { opacity: 0 }, landed);

    // 4. name rises; bar + tagline settle
    tl.to(split.chars, { yPercent: 0, duration: 1.4, stagger: 0.035, ease: 'power4.out' }, open + dur * 0.55)
      .to(fades, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out' }, open + dur * 0.8)
      .add(() => intro.remove(), landed + 0.1);
  });
}
