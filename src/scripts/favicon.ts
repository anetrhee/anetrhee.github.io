/** Swap between two favicon frames every 900ms; pause while the tab is hidden. */
export function initFavicon() {
  const link = document.querySelector<HTMLLinkElement>('[data-favicon]');
  if (!link) return;
  const frames = ['/favicon-1.png', '/favicon-2.png'];
  frames.forEach((f) => { const i = new Image(); i.src = f; });
  let i = 0;
  let id: number | undefined;
  const start = () => {
    if (id) return;
    id = window.setInterval(() => { i = (i + 1) % frames.length; link.href = frames[i]; }, 900);
  };
  const stop = () => { if (id) { clearInterval(id); id = undefined; } };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  if (!document.hidden) start();
}
