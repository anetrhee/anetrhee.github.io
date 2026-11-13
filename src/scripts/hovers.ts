import { gsap } from 'gsap';
import { finePointer } from './env';
import { scrollToY } from './lenis';

const outQuint = 'outQuint';

function arrowSwap(trigger: HTMLElement, out: gsap.TweenVars, inFrom: gsap.TweenVars, duration: number) {
  const box = trigger.querySelector('.arrow-box');
  if (!box) return;
  const [a, b] = Array.from(box.querySelectorAll('svg'));
  const rest = { x: 0, y: 0, xPercent: 0, yPercent: 0 };
  gsap.set(a, rest);
  gsap.set(b, { ...rest, ...inFrom });
  let busy = false;
  const run = () => {
    if (busy) return;
    busy = true;
    const tl = gsap.timeline({ onComplete: () => { gsap.set(a, rest); gsap.set(b, { ...rest, ...inFrom }); busy = false; } });
    tl.to(a, { ...out, duration, ease: outQuint }, 0).to(b, { ...rest, duration, ease: outQuint }, 0);
  };
  trigger.addEventListener('mouseenter', run);
  trigger.addEventListener('focus', run);
}

export function initHovers() {
  // "Visit" / "LinkedIn" / "About me" arrows: slide out x 120%, in from -120%, 600ms
  document.querySelectorAll<HTMLElement>('[data-arrow-link]').forEach((el) => {
    const diag = el.querySelector('.arrow-box--diag');
    if (diag) arrowSwap(el, { xPercent: 100, yPercent: -100 }, { xPercent: -100, yPercent: 100 }, 0.65);
    else arrowSwap(el, { xPercent: 120 }, { xPercent: -120 }, 0.6);
  });

  // Email: diagonal swap, 650ms
  document.querySelectorAll<HTMLElement>('[data-email-link]').forEach((el) =>
    arrowSwap(el, { xPercent: 100, yPercent: -100 }, { xPercent: -100, yPercent: 100 }, 0.65),
  );

  // Back to top: arrow leaves y -120px, duplicate rises from below, 600ms
  document.querySelectorAll<HTMLElement>('[data-back-top]').forEach((el) => {
    arrowSwap(el, { y: -120 }, { y: 120 }, 0.6);
    el.addEventListener('click', () => scrollToY(0));
  });

  // ScrambleText on hover for nav items + labels, then back to the original text
  if (finePointer) {
    document.querySelectorAll<HTMLElement>('[data-scramble-hover]').forEach((el) => {
      const host = (el.closest('a, button') as HTMLElement) || el;
      host.addEventListener('mouseenter', () => {
        const text = el.dataset.text || el.textContent || '';
        el.dataset.text = text;
        if (gsap.isTweening(el)) return;
        gsap.to(el, { duration: 0.5, scrambleText: { text, chars: 'upperCase', speed: 1 }, ease: 'none' });
      });
    });
  }
}
