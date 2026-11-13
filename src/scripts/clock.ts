/** Live Berkeley clock: "09:18 AM", updated every second, in every [data-clock]. */
export function initClock() {
  const clocks = Array.from(document.querySelectorAll<HTMLElement>('[data-clock]'));
  if (!clocks.length) return;
  const tz = clocks[0].dataset.tz || 'America/Los_Angeles';
  const fmt = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: tz });
  const targets = clocks.map((c) => c.querySelector<HTMLElement>('[data-clock-time]')!).filter(Boolean);
  let last = '';
  const tick = () => {
    const now = new Date();
    const s = fmt.format(now);
    if (s !== last) {
      last = s;
      for (const t of targets) {
        t.textContent = s;
        t.setAttribute('datetime', now.toISOString());
      }
    }
  };
  tick();
  setInterval(tick, 1000);
}
