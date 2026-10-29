// Portrait-constellation du hero : un buste abstrait (tête, cou, épaules) en points et triangles,
// aux couleurs de la personne, entouré d'une orbite et d'une poussière d'étoiles.
// Même schéma que src/lib/project-art.js : rendu seulement à l'écran, assemblage depuis la poussière,
// inclinaison vers le pointeur ; image fixe si prefers-reduced-motion.
import * as THREE from 'three';
import { triMaterial, triAttrs, fitScale } from '../../lib/tri-material.js';

const R = Math.random, TAU = Math.PI * 2;
const PALETTES = {
  noir: { main: [.95, .96, 1], alt: [.55, .6, .72], hot: [1, 1, 1] },
  lemon: { main: [.78, 1, .23], alt: [.45, .62, .14], hot: [.95, 1, .8] },
  bleu: { main: [.5, .7, 1], alt: [.3, .5, 1], hot: [.85, .92, 1] },
};
const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Surface du buste : profil de révolution (rayon selon la hauteur), légèrement aplati en profondeur.
const head = () => { // ellipsoïde + menton
  const u = R() * TAU, v = Math.acos(2 * R() - 1), y = Math.cos(v);
  const jaw = y < -.2 ? 1 - (-.2 - y) * .55 : 1;
  return [.7 * Math.sin(v) * Math.cos(u) * jaw, 1.42 + .9 * y, .78 * Math.sin(v) * Math.sin(u) * jaw];
};
const neck = () => { const a = R() * TAU, y = .35 + R() * .4; return [.3 * Math.cos(a), y, .3 * Math.sin(a)]; };
const torso = () => {
  const y = -1.9 + R() * 2.3;                      // -1.9 … .4
  const w = .34 + 1.1 * smooth(.4, -.35, y) - .1 * smooth(-.6, -1.9, y);
  const a = R() * TAU;
  return [w * Math.cos(a), y - .08 * Math.cos(a) * Math.cos(a), .55 * w * Math.sin(a)];
};
// Orbite inclinée autour de la tête (rotation de 24° autour de z).
const TILT = .42, ct = Math.cos(TILT), st = Math.sin(TILT);
const orbit = () => { const a = R() * TAU, r = 1.5 + (R() - .5) * .04, x = r * Math.cos(a), y = .06 * Math.sin(a * 3); return [x * ct - y * st, 1.5 + x * st + y * ct, r * Math.sin(a) * .9]; };
const dust = () => { const a = R() * TAU, r = 1.6 + R() * 2.6; return [r * Math.cos(a), -2 + R() * 4.6, r * Math.sin(a) * .6 - .6]; };

// Data (Aymen) : histogramme 3D + courbe de tendance + sol quadrillé.
const BARS = [.9, 1.6, 1.2, 2.3, 1.8, 2.9, 2.4, 3.3];
const bar = () => {
  const i = (R() * BARS.length) | 0, x0 = -2.1 + i * .6, h = BARS[i], w = .2, f = R();
  // une face au hasard de la boîte (x0±w, -1.9…-1.9+h, ±w)
  const u = (R() * 2 - 1) * w, v = -1.9 + R() * h;
  if (f < .4) return [x0 + u, v, R() < .5 ? w : -w];
  if (f < .8) return [x0 + (R() < .5 ? w : -w), v, u];
  return [x0 + u, -1.9 + h, (R() * 2 - 1) * w];
};
const trend = () => { const x = -2.4 + R() * 4.8; return [x, -.9 + x * .55 + Math.sin(x * 2.2) * .25 + 1.55, .5]; };
const floor = () => { const g = R() < .5, a = -2.6 + R() * 5.2, b = Math.round(R() * 8) * .32 - 1.3; return g ? [a, -1.92, b] : [b * 1.8, -1.92, a * .5]; };

// Produit (Ammar) : cube fil de fer + cube intérieur tourné + sommets en grappes.
const edge = s => { const a = (R() * 3) | 0, q = [R() < .5 ? s : -s, R() < .5 ? s : -s]; const p = [0, 0, 0]; p[a] = (R() * 2 - 1) * s; p[(a + 1) % 3] = q[0]; p[(a + 2) % 3] = q[1]; return p; };
const rot = ([x, y, z], ay, ax) => { const c = Math.cos(ay), s = Math.sin(ay), x1 = x * c + z * s, z1 = -x * s + z * c, c2 = Math.cos(ax), s2 = Math.sin(ax); return [x1, y * c2 - z1 * s2, y * s2 + z1 * c2]; };
const lift = p => [p[0], p[1] + .2, p[2]];
const outer = () => lift(edge(1.35));
const inner = () => lift(rot(edge(.62), Math.PI / 4, Math.atan(Math.SQRT1_2)));
const corner = () => { const p = edge(1.35); p.forEach((v, k) => { p[k] = Math.sign(v) * 1.35 + (R() - .5) * .12; }); return lift(p); };

const SHAPES = {
  bust: [[28, head, 'main', .95], [5, neck, 'alt', .8], [34, torso, 'main', .75], [6, orbit, 'hot', .55], [18, dust, 'alt', .35]],
  bars: [[46, bar, 'main', .9], [10, trend, 'hot', .9], [16, floor, 'alt', .45], [14, dust, 'alt', .3]],
  cube: [[38, outer, 'main', .95], [22, inner, 'hot', .8], [8, corner, 'hot', .9], [6, orbit, 'alt', .5], [14, dust, 'alt', .3]],
};

function build(pal, N, shape) {
  const parts = SHAPES[shape] || SHAPES.bust;
  const tot = parts.reduce((s, p) => s + p[0], 0), pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  let i = 0;
  parts.forEach(([w, f, c, a], pi) => {
    const n = pi === parts.length - 1 ? N - i : Math.round(N * w / tot);
    for (let k = 0; k < n && i < N; k++, i++) {
      const q = f();
      pos.set(q, i * 3);
      const fade = shape === 'bust' && q[1] < -1.2 ? Math.max(0, 1 - (-1.2 - q[1]) / .8) : 1; // bas du buste qui s'efface
      col.set(mul(pal[c], a * fade * (.7 + R() * .35)), i * 3);
    }
  });
  return { pos, col };
}

export function mountConstellation(canvas, tone, shape = 'bust', n = 0) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let rd;
  try { rd = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return () => {}; }
  rd.setPixelRatio(Math.min(devicePixelRatio, 2));
  const N = n || (innerWidth < 900 ? 4500 : 8000), { pos, col } = build(PALETTES[tone] || PALETTES.bleu, N, shape);
  const scatter = new Float32Array(N * 3).map(() => (R() - .5) * 10), P = new Float32Array(reduce ? pos : scatter);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(P, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  triAttrs(geo, N, .05);
  const mat = triMaterial(.045, tone === 'noir' ? .8 : .95), scene = new THREE.Scene(), group = new THREE.Group();
  const cam = new THREE.PerspectiveCamera(38, 1, .1, 50);
  cam.position.set(0, .3, 7.2); cam.lookAt(0, .2, 0);
  group.add(new THREE.Points(geo, mat)); scene.add(group);

  let raf = 0, vis = false, born = -1, tx = 0, ty = 0, mx = 0, my = 0;
  const clock = new THREE.Clock();
  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    rd.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); fitScale(mat, rd);
    group.scale.setScalar(Math.min(.92, cam.aspect / .7));
  };
  const onMove = e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; };
  if (!reduce) addEventListener('pointermove', onMove, { passive: true });

  function frame() {
    raf = vis && !reduce ? requestAnimationFrame(frame) : 0;
    const t = clock.getElapsedTime();
    if (born < 0) born = t;
    const f = reduce ? 1 : 1 - Math.pow(1 - Math.min(1, (t - born) / 2.4), 3);
    mx += (tx - mx) * .05; my += (ty - my) * .05;
    // chaque forme a son mouvement : buste lent, histogramme qui balaie, cube qui tourne franchement
    const spin = shape === 'cube' ? t * .35 : Math.sin(t * (shape === 'bars' ? .4 : .25)) * .35;
    group.rotation.y = (reduce ? -.25 : -.25 + spin) + mx * .8;
    group.rotation.x = my * .25 + (shape === 'cube' && !reduce ? Math.sin(t * .5) * .25 : 0);
    mat.uniforms.uTime.value = t;
    if (!reduce) {
      for (let j = 0; j < N * 3; j++) P[j] = pos[j] + (scatter[j] - pos[j]) * (1 - f) + Math.sin(t * 1.2 + j) * .01;
      geo.attributes.position.needsUpdate = true;
    }
    rd.render(scene, cam);
  }
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) { size(); raf = requestAnimationFrame(frame); } });
  io.observe(canvas);
  addEventListener('resize', size);
  return () => {
    vis = false; cancelAnimationFrame(raf); io.disconnect();
    removeEventListener('resize', size); removeEventListener('pointermove', onMove);
    geo.dispose(); mat.dispose(); rd.dispose();
  };
}
