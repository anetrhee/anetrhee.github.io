// Generates the animated favicon frames and neutral placeholder images in public/assets.
// Run: node scripts/make-placeholders.mjs   (JPGs are converted with macOS `sips` if available)
import { writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { execSync } from 'node:child_process';

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
function png(w, h, pixel) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = pixel(x, y);
      const o = y * (w * 4 + 1) + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

const ACC = [168, 88, 75]; // rose-clay accent
const MILK = [244, 239, 233];
const BLUSH = [236, 201, 192];
const mixc = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
// Favicon frames: filled accent dot / accent ring on black
const S = 64;
const fav = (ring) => png(S, S, (x, y) => {
  const d = Math.hypot(x - S / 2 + 0.5, y - S / 2 + 0.5);
  const inBg = true;
  const on = ring ? d < 22 && d > 15 : d < 22;
  const aa = (v) => Math.max(0, Math.min(1, v));
  if (on) return [...ACC, 255];
  const edge = ring ? Math.max(aa(1 - Math.abs(d - 22)), aa(1 - Math.abs(d - 15))) : aa(1 - Math.abs(d - 22));
  return inBg ? [...mixc(MILK, ACC, edge), 255] : [0, 0, 0, 0];
});
writeFileSync('public/favicon-1.png', fav(false));
writeFileSync('public/favicon-2.png', fav(true));

// Placeholders: dark gradient, so a forgotten swap is obvious but not ugly.
mkdirSync('public/assets', { recursive: true });
const items = [
  ['literature-diversified-logo.png', 1600, 1000],
  ['ld-social-1.png', 1600, 1000],
  ['cvusd-newsletter.png', 1600, 1000],
  ['cvusd-brochure.png', 1600, 1000],
  ['jta-event.jpg', 1600, 1000],
  ['japan-1.jpg', 1200, 1500],
  ['archery.jpg', 1600, 1000],
  ['portrait.jpg', 1200, 1500],
];
const hasSips = (() => { try { execSync('command -v sips', { stdio: 'ignore' }); return true; } catch { return false; } })();
for (const [name, w, h] of items) {
  const buf = png(w, h, (x, y) => {
    const t = (x / w) * 0.4 + (y / h) * 0.6;
    return [...mixc(MILK, BLUSH, Math.pow(t, 1.6)), 255];
  });
  if (name.endsWith('.png')) writeFileSync(`public/assets/${name}`, buf);
  else if (hasSips) {
    const tmp = `public/assets/.tmp-${name}.png`;
    writeFileSync(tmp, buf);
    execSync(`sips -s format jpeg -s formatOptions 70 "${tmp}" --out "public/assets/${name}"`, { stdio: 'ignore' });
    unlinkSync(tmp);
  } else writeFileSync(`public/assets/${name.replace(/\.jpg$/, '.png')}`, buf);
}
console.log('done');
