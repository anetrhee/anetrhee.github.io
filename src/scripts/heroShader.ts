import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { reducedMotion } from './env';

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

// Slow domain-warped fbm in milky, glazed tones.
const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.0 + 3.1; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.25;
  float t = uTime * 0.045;
  p += uMouse * 0.12;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 3.2 * r);

  // Milky glazed palette: milk → blush → peach → butter, with a soft pearly sheen
  vec3 milk   = vec3(0.957, 0.937, 0.914);
  vec3 blush  = vec3(0.925, 0.788, 0.753);
  vec3 peach  = vec3(0.945, 0.827, 0.749);
  vec3 butter = vec3(0.945, 0.894, 0.776);
  vec3 mauve  = vec3(0.863, 0.769, 0.792);

  vec3 col = milk;
  col = mix(col, peach, smoothstep(0.30, 0.70, f) * 0.85);
  col = mix(col, blush, smoothstep(0.50, 0.85, length(r) * 0.8) * 0.9);
  col = mix(col, butter, smoothstep(0.55, 0.95, q.x) * 0.55);
  col = mix(col, mauve, smoothstep(0.65, 1.0, q.y) * 0.35);

  // glossy highlight bands (the "glaze")
  float sheen = pow(smoothstep(0.55, 0.95, sin((f + q.y) * 6.2831 + t * 2.0) * 0.5 + 0.5), 3.0);
  col += vec3(1.0, 0.98, 0.96) * sheen * 0.22;

  // fade to milk at the bottom so the name stays crisp
  col = mix(col, milk, smoothstep(0.42, 0.0, uv.y) * 0.85);
  gl_FragColor = vec4(col, 1.0);
}
`;

/** WebGL hero background; falls back to the CSS gradient (already in the DOM) when unavailable or reduced motion. */
export function initHeroShader() {
  const host = document.querySelector<HTMLElement>('[data-hero-gl]');
  if (!host || reducedMotion) return;

  let renderer: Renderer;
  try {
    renderer = new Renderer({ dpr: 1, alpha: false, antialias: false, powerPreference: 'low-power' });
  } catch {
    return;
  }
  const gl = renderer.gl;
  if (!gl) return;
  gl.clearColor(0.957, 0.937, 0.914, 1);
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: { uTime: { value: 0 }, uRes: { value: [1, 1] }, uMouse: { value: [0, 0] } },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  // Render at reduced resolution: the field is soft, so this is free quality-wise and cheap on the GPU.
  const SCALE = 0.45;
  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(Math.max(1, Math.round(w * SCALE)), Math.max(1, Math.round(h * SCALE)));
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    program.uniforms.uRes.value = [w, h];
  };
  resize();
  window.addEventListener('resize', resize);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  let raf = 0;
  let inView = true;
  let start = performance.now() - 20000;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    mouse.x += (mouse.tx - mouse.x) * 0.03;
    mouse.y += (mouse.ty - mouse.y) * 0.03;
    program.uniforms.uTime.value = (now - start) / 1000;
    program.uniforms.uMouse.value = [mouse.x, mouse.y];
    renderer.render({ scene: mesh });
  };
  const play = () => { if (!raf && inView && !document.hidden) raf = requestAnimationFrame(loop); };
  const pause = () => { cancelAnimationFrame(raf); raf = 0; };

  // Only animate while in view (threshold 0.25) and while the tab is visible
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? play() : pause(); }, { threshold: 0.25 }).observe(host);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));

  renderer.render({ scene: mesh });
  host.classList.add('has-gl');
  play();
}
