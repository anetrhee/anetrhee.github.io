import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from './env';

let lenis: Lenis | null = null;

export function initLenis() {
  history.scrollRestoration = 'manual';
  if (reducedMotion) return null;
  // Reference settings. (Lenis 1.x renamed `smoothTouch` to `syncTouch`; false = native touch scroll.)
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.7, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

export function stopScroll() {
  lenis?.stop();
}
export function startScroll() {
  lenis?.start();
  ScrollTrigger.refresh();
}

export function scrollToY(y: number | 'bottom') {
  const target = y === 'bottom' ? document.documentElement.scrollHeight - window.innerHeight : y;
  if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 5) });
  else window.scrollTo({ top: target, behavior: reducedMotion ? 'auto' : 'smooth' });
}
