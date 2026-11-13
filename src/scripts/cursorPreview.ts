import { gsap } from 'gsap';

/**
 * Cursor-follow previews for rows/cards marked [data-preview-host] containing [data-preview].
 * Enter: scale 0→1 (400ms) + opacity 0→1 (600ms), power3.inOut. Leave: reverse in 500ms.
 * Position: x mapped -85%…85% across the card, y -78px…78px, smoothed with quickTo(0.6, power3).
 */
export function initCursorPreviews() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>('[data-preview-host]').forEach((host) => {
      const preview = host.querySelector<HTMLElement>('[data-preview]');
      if (!preview) return;
      gsap.set(preview, { scale: 0, opacity: 0, x: 0, y: 0 });
      const xTo = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' });
      const inner = preview.querySelector<HTMLElement>('[data-preview-inner]');
      const rTo = inner ? gsap.quickTo(inner, 'rotation', { duration: 0.8, ease: 'power3' }) : null;
      let lastX = 0;

      const move = (e: MouseEvent) => {
        const r = host.getBoundingClientRect();
        const px = gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width);
        const py = gsap.utils.clamp(0, 1, (e.clientY - r.top) / r.height);
        // -85% … 85% of half the card width keeps the preview under the cursor's side of the row
        xTo(gsap.utils.interpolate(-0.85, 0.85, px) * (r.width / 2 - preview.offsetWidth / 4));
        yTo(gsap.utils.interpolate(-78, 78, py));
        if (rTo) { rTo(gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.25)); lastX = e.clientX; }
      };
      const enter = (e: MouseEvent) => {
        lastX = e.clientX;
        const r = host.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        gsap.set(preview, { x: gsap.utils.interpolate(-0.85, 0.85, px) * (r.width / 2 - preview.offsetWidth / 4) });
        gsap.to(preview, { scale: 1, duration: 0.4, ease: 'power3.inOut', overwrite: 'auto' });
        gsap.to(preview, { opacity: 1, duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
      };
      const leave = () => {
        gsap.to(preview, { scale: 0, opacity: 0, duration: 0.5, ease: 'power3.inOut', overwrite: 'auto' });
        rTo?.(0);
      };
      host.addEventListener('mouseenter', enter);
      host.addEventListener('mousemove', move);
      host.addEventListener('mouseleave', leave);
      cleanups.push(() => {
        host.removeEventListener('mouseenter', enter);
        host.removeEventListener('mousemove', move);
        host.removeEventListener('mouseleave', leave);
        gsap.set(preview, { clearProps: 'all' });
      });
    });

    return () => cleanups.forEach((c) => c());
  });
}
