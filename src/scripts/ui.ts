import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis, scrollToY, startScroll, stopScroll } from './lenis';
import { reducedMotion, setScrollbarWidth } from './env';

/** Full-screen mobile menu with staggered links; Lenis stopped while open. */
export function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;
  const html = document.documentElement;
  const links = menu.querySelectorAll<HTMLElement>('.menu__link');
  const focusables = menu.querySelectorAll<HTMLElement>('[data-menu-link]');
  const foot = menu.querySelector('.menu__foot');
  let open = false;

  const set = (v: boolean) => {
    open = v;
    toggle.setAttribute('aria-expanded', String(v));
    toggle.querySelector('.header__burger-label')!.textContent = v ? 'Close' : 'Menu';
    menu.setAttribute('aria-hidden', String(!v));
    focusables.forEach((l) => (l.tabIndex = v ? 0 : -1));
    const d = reducedMotion ? 0 : 1;
    if (v) {
      setScrollbarWidth();
      html.classList.add('is-menu-open');
      stopScroll();
      gsap.killTweensOf([menu, links, foot]);
      gsap.set(menu, { visibility: 'visible' });
      gsap.to(menu, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8 * d, ease: 'transition' });
      gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.9 * d, stagger: 0.07, ease: 'power4.out', delay: 0.25 * d });
      gsap.fromTo(foot, { opacity: 0 }, { opacity: 1, duration: 0.6 * d, delay: 0.5 * d });
    } else {
      gsap.to(menu, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.7 * d,
        ease: 'transition',
        onComplete: () => {
          gsap.set(menu, { visibility: 'hidden' });
        },
      });
      html.classList.remove('is-menu-open');
      startScroll();
    }
  };
  toggle.addEventListener('click', () => set(!open));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) { set(false); toggle.focus(); } });
  menu.addEventListener('click', (e) => {
    const a = (e.target as Element).closest('a');
    if (a && a.getAttribute('href')?.startsWith('#')) set(false);
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', (m) => { if (m.matches && open) set(false); });
}

/** In-page anchors (Contact → footer) go through Lenis. */
export function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute('href')!.slice(1);
    if (!id || a.classList.contains('skip-link')) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (id === 'contact') scrollToY('bottom');
    else scrollToY(target.getBoundingClientRect().top + window.scrollY - 80);
  });
}

/** Header hides on scroll down, returns on scroll up. */
export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let last = window.scrollY;
  // On the home page the hero carries its own name + nav bar, so the fixed header waits until the hero is passed.
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const onScroll = (y: number) => {
    if (document.documentElement.classList.contains('is-menu-open')) return;
    const inHero = !!hero && window.innerWidth >= 768 && y < hero.offsetHeight - 24;
    const down = y > last && y > 160;
    header.classList.toggle('is-hidden', inHero || down);
    last = y;
  };
  onScroll(window.scrollY);
  const lenis = getLenis();
  if (lenis) lenis.on('scroll', ({ scroll }: { scroll: number }) => onScroll(scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
}

/** Accordion with height animation (500ms). */
export function initAccordions() {
  document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>('[data-accordion-btn]');
    const panel = item.querySelector<HTMLElement>('[data-accordion-panel]');
    if (!btn || !panel) return;
    gsap.set(panel, { height: 0, overflow: 'hidden' });
    panel.hidden = false;
    panel.inert = true;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      item.classList.toggle('is-open', open);
      panel.inert = !open;
      gsap.to(panel, {
        height: open ? 'auto' : 0,
        duration: reducedMotion ? 0 : 0.5,
        ease: 'outQuint',
        onComplete: () => {
          ScrollTrigger.refresh();
          getLenis()?.resize();
        },
      });
    });
  });
}
