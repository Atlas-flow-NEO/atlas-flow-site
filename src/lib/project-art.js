// Projects page: one live 3D constellation per card (delivery, training platform, AI documents).
// Renders only while the card is on screen; turns with scroll and tilts toward the pointer.
import * as THREE from 'three';
import { triMaterial, triAttrs, fitScale } from './tri-material.js';

const R = Math.random, TAU = Math.PI * 2;
const NEON = [.78, 1, .23], BLUE = [.32, .52, 1], INK = [.66, .74, .98];
const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
const seg = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
const pick = a => a[(R() * a.length) | 0];

// Edges of an axis-aligned box centred on c, size s.
const boxEdges = (c, s) => {
  const v = [-1, 1], P = [], E = [];
  for (const x of v) for (const y of v) for (const z of v) P.push([c[0] + x * s[0] / 2, c[1] + y * s[1] / 2, c[2] + z * s[2] / 2]);
  for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) if ([0, 1, 2].filter(k => P[a][k] !== P[b][k]).length === 1) E.push([P[a], P[b]]);
  return () => { const [p, q] = pick(E); return seg(p, q, R()); };
};
// Point on a flat sheet (x/y extents) with text lines, placed by a transform f.
const lines = (w, h, n) => () => { const i = (R() * n) | 0, L = w * (.45 + ((i * 37) % 10) / 22); return [-w / 2 + .12 + R() * L, h / 2 - .22 - i * (h - .3) / n, 0]; };
const rect = (w, h) => () => { const t = R() * 2 * (w + h); return t < w ? [t - w / 2, -h / 2, 0] : t < w + h ? [w / 2, t - w - h / 2, 0] : t < 2 * w + h ? [t - w - h - w / 2, h / 2, 0] : [-w / 2, t - 2 * w - h - h / 2, 0]; };
const sphere = (r, c = [0, 0, 0]) => () => { const u = R() * 2 - 1, a = R() * TAU, q = Math.sqrt(1 - u * u); return [c[0] + r * q * Math.cos(a), c[1] + r * u, c[2] + r * q * Math.sin(a)]; };
const ring = (r, c = [0, 0, 0]) => () => { const a = R() * TAU; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), c[2]]; };
const at = (f, o, ry = 0, rx = 0) => () => {
  let [x, y, z] = f(), c = Math.cos(rx), s = Math.sin(rx);
  [y, z] = [y * c - z * s, y * s + z * c]; c = Math.cos(ry); s = Math.sin(ry);
  [x, z] = [x * c + z * s, -x * s + z * c];
  return [x + o[0], y + o[1], z + o[2]];
};

const SHAPES = [
  // 0. Delivery: parcel with tape and label, a dashed route arcing between two pins
  () => {
    const bez = t => { const u = 1 - t; return [u * u * -2.5 + 2 * u * t * 0 + t * t * 2.5, u * u * -1.1 + 2 * u * t * 2.6 + t * t * -1.1, u * u * .6 + t * t * .6 - 2 * u * t * 1.4]; };
    const pin = x => () => { const a = R() * TAU, h = R(); return R() < .5 ? [x + .2 * (1 - h) * Math.cos(a), -1.1 + h * .55, .6 + .2 * (1 - h) * Math.sin(a)] : [x + .26 * Math.cos(a), -.42 + .26 * Math.sin(a) * .2, .6 + .26 * Math.sin(a)]; };
    return [
      { w: 26, f: boxEdges([0, -.1, 0], [1.7, 1.25, 1.3]), c: INK, a: .9 },
      { w: 6, f: () => [(R() - .5) * .3, .525, (R() - .5) * 1.3], c: NEON, a: 1 },
      { w: 4, f: () => [(R() - .5) * .3, .525 - R() * 1.25, .65], c: NEON, a: .9 },
      { w: 8, f: at(rect(.6, .4), [-.45, -.25, .66]), c: BLUE, a: 1 },
      { w: 6, f: at(lines(.6, .4, 3), [-.45, -.25, .66]), c: INK, a: .5 },
      { w: 14, f: () => { const t = R(); return (t * 18) % 1 < .55 ? bez(t) : bez(R()); }, c: NEON, a: .85 },
      { w: 8, f: pin(-2.5), c: BLUE, a: 1 }, { w: 8, f: pin(2.5), c: NEON, a: 1 },
      { w: 14, f: () => { const k = 1 + ((R() * 3) | 0) * .7, a = R() * TAU; return [2.2 * k * Math.cos(a), -1.15, 1.1 * k * Math.sin(a)]; }, c: INK, a: .25 },
    ];
  },
  // 1. Training platform: graduation cap above a stack of books, learners orbiting
  () => [
    { w: 16, f: at(rect(1.9, 1.9), [0, .95, 0], Math.PI / 4, Math.PI / 2), c: INK, a: .9 },
    { w: 6, f: at(() => [(R() - .5) * 1.9, (R() - .5) * 1.9, 0], [0, .95, 0], Math.PI / 4, Math.PI / 2), c: BLUE, a: .18 },
    { w: 10, f: () => { const a = R() * TAU; return [.62 * Math.cos(a), .35 + R() * .55, .62 * Math.sin(a)]; }, c: INK, a: .45 },
    { w: 5, f: () => seg([0, .97, 0], [.85, .3, .2], R()), c: NEON, a: 1 },
    { w: 4, f: () => { const a = R() * TAU, r = .09 * Math.sqrt(R()); return [.85 + r * Math.cos(a), .25 + R() * .2, .2 + r * Math.sin(a)]; }, c: NEON, a: 1 },
    { w: 12, f: boxEdges([0, -.3, 0], [2.3, .32, 1.5]), c: BLUE, a: 1 },
    { w: 12, f: at(boxEdges([0, 0, 0], [2.1, .3, 1.4]), [.1, -.66, 0], .25), c: INK, a: .8 },
    { w: 12, f: at(boxEdges([0, 0, 0], [2.4, .32, 1.6]), [-.05, -1.02, 0], -.18), c: NEON, a: .8 },
    { w: 12, f: () => { const a = R() * TAU, l = (R() * 3) | 0; return [(2.4 + l * .25) * Math.cos(a), -.2 + Math.sin(a * 3 + l) * .25, (1.4 + l * .2) * Math.sin(a)]; }, c: INK, a: .3 },
    { w: 3, f: () => { const a = ((R() * 7) | 0) * TAU / 7, d = [R() - .5, R() - .5, R() - .5]; return [2.4 * Math.cos(a) + d[0] * .12, -.2 + Math.sin(a * 3) * .25 + d[1] * .12, 1.4 * Math.sin(a) + d[2] * .12]; }, c: NEON, a: 1 },
  ],
  // 2. AI documents: fanned sheets, a scan beam, extracted fields floating out
  () => {
    const sheets = [[-.5, -.15, -.5, .22], [0, 0, 0, 0], [.5, .15, .5, -.2]];
    const field = (y, w) => at(rect(w, .28), [1.95, y, .3], -.35);
    return [
      ...sheets.map(([x, y, z, r], i) => ({ w: 12, f: at(rect(1.7, 2.3), [x, y, z], r * .6, 0), c: i === 2 ? INK : BLUE, a: i === 2 ? .95 : .55 })),
      ...sheets.map(([x, y, z, r]) => ({ w: 9, f: at(lines(1.7, 2.3, 7), [x, y, z], r * .6, 0), c: INK, a: .45 })),
      { w: 8, f: () => [.5 + (R() - .5) * 2.1, .35 + (R() - .5) * .03, .5 + (R() - .5) * .3], c: NEON, a: 1.1 },
      { w: 6, f: field(.9, .9), c: NEON, a: 1 }, { w: 6, f: field(.35, 1.2), c: BLUE, a: 1 }, { w: 6, f: field(-.2, .7), c: NEON, a: 1 },
      { w: 6, f: () => seg([1.25, .35, .6], [1.95 + (R() - .5) * .6, pick([.9, .35, -.2]), .3], R()), c: NEON, a: .35 },
    ];
  },
  // 3. Chatbots & agents: an agent core wired to satellite tools, chat bubbles floating around it
  () => {
    const sats = [[-2.1, .9, .3], [2.2, .7, -.2], [-1.6, -1.2, .5], [1.9, -1.1, .4], [0, 1.9, -.5]];
    const bubble = (o, ry) => [
      { w: 7, f: at(rect(1.1, .62), o, ry), c: NEON, a: .95 },
      { w: 2, f: at(() => seg([-.35, -.31, 0], [-.5, -.55, 0], R()), o, ry), c: NEON, a: .95 },
      { w: 3, f: at(lines(1.1, .62, 3), o, ry), c: INK, a: .45 },
    ];
    return [
      { w: 22, f: sphere(.85), c: BLUE, a: 1 }, { w: 6, f: sphere(.35), c: NEON, a: 1 },
      { w: 8, f: at(ring(1.25), [0, 0, 0], 0, 1.2), c: INK, a: .5 },
      ...sats.map(s => ({ w: 4, f: sphere(.16, s), c: INK, a: .9 })),
      { w: 10, f: () => seg([0, 0, 0], pick(sats), .5 + R() * .5), c: BLUE, a: .45 },
      ...bubble([-1.5, .3, 1.1], .3), ...bubble([1.45, -.15, 1], -.35),
    ];
  },
  // 4. Data: database cylinders feeding a bar chart with a rising trend line
  () => {
    const disc = y => () => { const a = R() * TAU; return [-1.5 + .7 * Math.cos(a), y, .7 * Math.sin(a)]; };
    const bars = [.6, 1.0, .8, 1.5, 2.1];
    return [
      ...[-1.2, -.6, 0, .6].map(y => ({ w: 6, f: disc(y), c: y === .6 ? NEON : BLUE, a: 1 })),
      { w: 6, f: () => { const a = pick([0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]); return [-1.5 + .7 * Math.cos(a), -1.2 + R() * 1.8, .7 * Math.sin(a)]; }, c: INK, a: .5 },
      ...bars.map((h, i) => ({ w: 6, f: boxEdges([.3 + i * .48, -1.2 + h / 2, 0], [.3, h, .3]), c: i === 4 ? NEON : INK, a: .85 })),
      { w: 10, f: () => { const t = R(); return [.3 + t * 1.92, -.4 + Math.pow(t, 1.6) * 1.6 + Math.sin(t * 9) * .08, .35]; }, c: NEON, a: 1 },
      { w: 6, f: () => seg([-.8, -.3, 0], [.15, -.3 + R() * .6, 0], R()), c: BLUE, a: .5 },
      { w: 8, f: () => [(R() - .5) * 4.4, -1.25, (R() - .5) * 2], c: INK, a: .15 },
    ];
  },
  // 5. Web platforms: two browser windows with layout blocks, a cursor
  () => {
    const win = (o, ry, a) => [
      { w: 10, f: at(rect(2.6, 1.7), o, ry), c: INK, a },
      { w: 4, f: at(() => [(R() - .5) * 2.6, .6, 0], o, ry), c: INK, a: a * .7 },
      { w: 2, f: at(() => { const k = (R() * 3) | 0, b = R() * TAU; return [-1.15 + k * .14 + .04 * Math.cos(b), .72 + .04 * Math.sin(b), 0]; }, o, ry), c: NEON, a },
      { w: 6, f: at(() => { const x = R() * 2.3 - 1.15; return [x, .15 + (R() - .5) * .4, 0]; }, o, ry), c: BLUE, a: a * .5 },
      { w: 6, f: at(() => { const k = (R() * 3) | 0; return [-1.05 + k * .78 + R() * .6, -.5 + (R() - .5) * .45, 0]; }, o, ry), c: NEON, a: a * .4 },
    ];
    const cur = () => { const t = R(), e = (R() * 3) | 0, P = [[0, 0], [.32, -.42], [.08, -.32]], Q = P[(e + 1) % 3]; return [1.05 + P[e][0] + (Q[0] - P[e][0]) * t, -.2 + P[e][1] + (Q[1] - P[e][1]) * t, 1.1]; };
    return [...win([.35, .3, -.6], -.2, .45), ...win([-.25, -.15, .5], .15, 1), { w: 4, f: cur, c: NEON, a: 1.1 }];
  },
  // 6. Listen: sound waves radiating from a speech bubble
  () => [
    { w: 10, f: at(rect(1.3, .85), [-1.3, .25, 0]), c: NEON, a: 1 },
    { w: 3, f: () => seg([-1.55, -.18, 0], [-1.75, -.5, 0], R()), c: NEON, a: 1 },
    { w: 4, f: at(lines(1.3, .85, 3), [-1.3, .25, 0]), c: INK, a: .5 },
    ...[.9, 1.4, 1.9, 2.4].map((r, i) => ({ w: 8, f: () => { const a = (R() - .5) * 1.5; return [-.4 + r * Math.cos(a), .25 + r * Math.sin(a), (R() - .5) * .1]; }, c: i % 2 ? BLUE : INK, a: 1 - i * .18 })),
    { w: 8, f: () => { const x = R() * 4.4 - 2.2; return [x, -1.25 + Math.sin(x * 5) * .2 * Math.cos(x * .9), 0]; }, c: BLUE, a: .8 },
  ],
  // 7. Design: blueprint grid with a wireframe structure and dimension lines
  () => [
    { w: 12, f: () => { const k = R() < .5, v = Math.round((R() - .5) * 8) / 2; return k ? [v, -1.1, (R() - .5) * 4] : [(R() - .5) * 4, -1.1, v]; }, c: BLUE, a: .35 },
    { w: 14, f: boxEdges([0, -.3, 0], [1.6, 1.6, 1.6]), c: INK, a: .9 },
    { w: 10, f: () => { const a = ((R() * 4) | 0) * Math.PI / 2 + Math.PI / 4, h = R(); return [Math.cos(a) * 1.13 * (1 - h), .5 + h * .9, Math.sin(a) * 1.13 * (1 - h)]; }, c: NEON, a: 1 },
    { w: 5, f: () => seg([-.8, -1.1, 1.3], [.8, -1.1, 1.3], R()), c: NEON, a: .8 },
    { w: 5, f: () => seg([1.3, -1.1, .8], [1.3, .5, .8], R()), c: NEON, a: .8 },
    { w: 6, f: at(ring(.55), [-1.9, .9, 0]), c: BLUE, a: .9 },
  ],
  // 8. Build: modules stacking into a tower, one being lowered into place
  () => [
    ...[[0, -1, 0], [1, -1, 0], [-1, -1, 0], [0, -1, 1], [0, 0, 0], [1, 0, 0], [-.5, 1, 0]].map(([x, y, z], i) => ({ w: 7, f: boxEdges([x * .9, y * .9, z * .9 - .3], [.82, .82, .82]), c: i > 5 ? NEON : i > 3 ? BLUE : INK, a: .9 })),
    { w: 4, f: () => seg([.4, 2.1, -.3], [.4, 1.35, -.3], R()), c: INK, a: .5 },
    { w: 6, f: boxEdges([.4, 1.65, -.3], [.6, .6, .6]), c: NEON, a: .6 },
    { w: 8, f: () => [(R() - .5) * 4.2, -1.35, (R() - .5) * 2.4], c: INK, a: .15 },
  ],
  // 9. Support: a launched product in orbit, rings of care around it
  () => [
    { w: 18, f: sphere(.8), c: NEON, a: .9 },
    ...[[1.4, .4], [1.85, -.5], [2.3, 1.1]].map(([r, tilt], i) => ({ w: 9, f: at(ring(r), [0, 0, 0], tilt, 1.2), c: i === 1 ? BLUE : INK, a: .7 })),
    ...[[1.4, .4, 1], [1.85, -.5, 3], [2.3, 1.1, 5]].map(([r, tilt, a]) => ({ w: 3, f: at(sphere(.12, [r * Math.cos(a), r * Math.sin(a), 0]), [0, 0, 0], tilt, 1.2), c: NEON, a: 1 })),
  ],
];

function build(parts, N) {
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), tot = parts.reduce((a, p) => a + p.w, 0);
  let i = 0;
  parts.forEach((p, pi) => {
    const n = pi === parts.length - 1 ? N - i : Math.round(N * p.w / tot);
    for (let k = 0; k < n && i < N; k++, i++) { pos.set(p.f(), i * 3); col.set(mul(p.c, (p.a || 1) * (.75 + R() * .3)), i * 3); }
  });
  return { pos, col };
}

export function mountArt(canvas, kind) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let rd;
  try { rd = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return () => {}; }
  rd.setPixelRatio(Math.min(devicePixelRatio, 2));
  const N = innerWidth < 900 ? 3500 : 6000, { pos, col } = build(SHAPES[kind](), N);
  const scatter = new Float32Array(N * 3).map(() => (R() - .5) * 9), P = new Float32Array(scatter);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  triAttrs(geo, N, .06);
  const mat = triMaterial(.05, .95), scene = new THREE.Scene(), group = new THREE.Group(), cam = new THREE.PerspectiveCamera(40, 1, .1, 50);
  cam.position.set(0, .5, 6.6); cam.lookAt(0, 0, 0);
  group.add(new THREE.Points(geo, mat)); scene.add(group);

  let raf = 0, vis = false, born = -1, tx = 0, ty = 0, mx = 0, my = 0;
  const clock = new THREE.Clock();
  const size = () => { const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; rd.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); fitScale(mat, rd); };
  const card = canvas.closest('.pj-card, .art-host') || canvas;
  const onMove = e => { const r = card.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; };
  const onLeave = () => { tx = ty = 0; };
  card.addEventListener('pointermove', onMove); card.addEventListener('pointerleave', onLeave);

  function frame() {
    raf = vis ? requestAnimationFrame(frame) : 0;
    const t = clock.getElapsedTime(), r = canvas.getBoundingClientRect();
    // Scroll position (-1 below the fold … 1 above) turns the object; first sight assembles it from dust.
    const sp = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
    if (born < 0) born = t;
    const f = reduce ? 1 : 1 - Math.pow(1 - Math.min(1, (t - born) / 1.8), 3);
    mx += (tx - mx) * .06; my += (ty - my) * .06;
    group.rotation.y = (reduce ? 0 : sp * -.9 + Math.sin(t * .35) * .18) + mx * .7;
    group.rotation.x = .12 + my * .35;
    group.scale.setScalar(Math.min(1, cam.aspect / 1.25) * (.86 + .14 * f));
    mat.uniforms.uTime.value = t;
    for (let j = 0; j < N * 3; j++) P[j] = pos[j] + (scatter[j] - pos[j]) * (1 - f) + (reduce ? 0 : Math.sin(t * 1.4 + j) * .008);
    geo.attributes.position.needsUpdate = true;
    rd.render(scene, cam);
  }
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) { size(); raf = requestAnimationFrame(frame); } });
  io.observe(canvas);
  addEventListener('resize', size);
  return () => { vis = false; cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', size); card.removeEventListener('pointermove', onMove); card.removeEventListener('pointerleave', onLeave); geo.dispose(); mat.dispose(); rd.dispose(); };
}
