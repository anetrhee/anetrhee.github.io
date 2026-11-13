export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const isDesktop = () => window.innerWidth >= 768;

/** Scrollbar width → --sbw so fixed elements do not jump when scroll locks. */
export function setScrollbarWidth() {
  const html = document.documentElement;
  const wasLocked = html.classList.contains('is-intro-locked') || html.classList.contains('is-menu-open');
  if (wasLocked) return;
  const sbw = window.innerWidth - html.clientWidth;
  html.style.setProperty('--sbw', `${Math.max(0, sbw)}px`);
}
