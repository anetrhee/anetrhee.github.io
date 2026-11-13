import { gsap } from 'gsap';

/**
 * Hero mouse parallax. Layers: [data-parallax="30px" | "1.5rem" | "3.5rem" | "rotate"].
 * quickTo duration 0.9 (Webflow smoothing 90). Resting state is centred.
 */
export function initParallax() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)', () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const toPx = (v: string) => (v.endsWith('rem') ? parseFloat(v) * rem : parseFloat(v));

    const layers = Array.from(hero.querySelectorAll<HTMLElement>('[data-parallax]')).map((el) => {
      const kind = el.dataset.parallax!;
      if (kind === 'rotate') {
        gsap.set(el, { transformPerspective: 900 });
        return {
          kind,
          rx: gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: 'power3' }),
          ry: gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power3' }),
        };
      }
      return {
        kind,
        amp: toPx(kind),
        x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' }),
      };
    });

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1 … 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      for (const l of layers) {
        if (l.kind === 'rotate') { l.ry!(nx * 8); l.rx!(-ny * 8); }
        else { l.x!(-nx * l.amp!); l.y!(-ny * l.amp!); }
      }
    };
    const onLeave = () => {
      for (const l of layers) {
        if (l.kind === 'rotate') { l.ry!(0); l.rx!(0); } else { l.x!(0); l.y!(0); }
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  });
}
