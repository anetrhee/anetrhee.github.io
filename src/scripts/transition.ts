import { gsap } from 'gsap';
import { reducedMotion } from './env';

const overlay = () => document.querySelector<HTMLElement>('[data-transition]');

/** Called once the page is initialised: fade + unblur the overlay in ~200ms. */
export function revealPage() {
  const el = overlay();
  if (!el) return;
  const blur = el.querySelector<HTMLElement>('[data-transition-blur]')!;
  const fill = el.querySelector<HTMLElement>('[data-transition-fill]')!;
  gsap.set(blur, { backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)' });
  gsap.to(fill, { opacity: 0, duration: 0.2, ease: 'none' });
  gsap.to(blur, {
    backdropFilter: 'blur(0px)',
    webkitBackdropFilter: 'blur(0px)',
    duration: 0.2,
    ease: 'none',
    onComplete: () => el.classList.remove('is-active', 'transition--dark'),
  });
}

function shouldIntercept(a: HTMLAnchorElement, e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  const raw = a.getAttribute('href') || '';
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return false;
  if (a.target === '_blank' || a.hasAttribute('download') || a.classList.contains('no-transition')) return false;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return false;
  if (url.pathname === location.pathname && url.hash) return false;
  return true;
}

/** Leave-page blur: overlay on, blur(0) → blur(10px) after 300ms over 1000ms, content fades, navigate at 1400ms. */
export function leaveTo(href: string) {
  const el = overlay();
  if (!el || reducedMotion) { location.href = href; return; }
  const blur = el.querySelector<HTMLElement>('[data-transition-blur]')!;
  const fill = el.querySelector<HTMLElement>('[data-transition-fill]')!;
  el.classList.add('is-active');
  gsap.killTweensOf([blur, fill]);
  gsap.set(blur, { backdropFilter: 'blur(0px)', webkitBackdropFilter: 'blur(0px)' });
  gsap.set(fill, { opacity: 0 });
  gsap.to(blur, { backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', duration: 1, delay: 0.3, ease: 'transition' });
  gsap.to(fill, { opacity: 1, duration: 1, delay: 0.3, ease: 'transition' });
  gsap.to(['main', 'footer', '[data-header]'], { opacity: 0, duration: 1, delay: 0.3, ease: 'transition' });
  window.setTimeout(() => { location.href = href; }, 1400);
}

export function initTransitions() {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a') as HTMLAnchorElement | null;
    if (!a || !shouldIntercept(a, e)) return;
    e.preventDefault();
    leaveTo(a.href);
  });
  window.addEventListener('pageshow', (e) => {
    if ((e as PageTransitionEvent).persisted) location.reload();
  });
}
