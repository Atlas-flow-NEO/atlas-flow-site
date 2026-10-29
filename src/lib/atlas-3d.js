// Atlas Flow home: scroll-driven 3D particle morph. three.js is imported from npm.
// Shapes: AI head → conversation → database → laptop → neural network, drawn as clean technical line-work.
import * as THREE from 'three';
import { triMaterial, triAttrs, fitScale } from './tri-material.js';

export function start({ getState, onScene }) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LAST = 4, R = Math.random, TAU = Math.PI * 2;
  const $ = id => document.getElementById(id);
  let raf = 0, dead = false, G = null, first = true;
  let target = 0, cur = 0, lastScene = -1, railO = -1, hintO = -1, cache = [], tmx = 0, tmy = 0;
  let inside = false, vel = 0, prevT = 0, pulse = false;
  const onMove = e => { tmx = e.clientX / innerWidth - .5; tmy = e.clientY / innerHeight - .5; inside = true; };
  const onOut = e => { if (!e.relatedTarget) inside = false; };
  const onUp = e => { if (e.pointerType !== 'mouse') inside = false; };
  // Click on empty space: a shockwave ripples through the shape.
  const onDown = e => { if (!e.target.closest('a,button,input,textarea,select,iframe,header,.chat-dock,.chat-fab,[class^="chat"]')) pulse = true; };
  addEventListener('pointermove', onMove, { passive: true }); addEventListener('mouseout', onOut); addEventListener('pointerup', onUp); addEventListener('pointerdown', onDown);
  const phone = () => innerWidth < 900 || innerHeight > innerWidth;
  const copies = () => { if (!cache.length || !cache[0].isConnected) cache = [...document.querySelectorAll('#af-story [data-copy]')]; return cache; };

  function ui(p, r) {
    copies().forEach((c, i) => {
      const d = p - i, o = Math.max(0, 1 - Math.abs(d) * 1.7);
      c.style.opacity = o.toFixed(3);
      c.classList.toggle('on', Math.abs(d) < .45);
      if (!reduce) c.style.transform = `translateY(${(-d * 40).toFixed(1)}px)`;
    });
    const a = Math.round(p);
    if (a !== lastScene) { lastScene = a; onScene(a); }
    const h = $('af-hint'), rl = $('af-rail');
    const ho = p > .15 ? 0 : 1; if (h && ho !== hintO) { hintO = ho; h.style.opacity = ho; }
    const ro = r.bottom > innerHeight * .55 ? 1 : 0; if (rl && ro !== railO) { railO = ro; rl.style.opacity = ro; rl.style.pointerEvents = ro ? 'auto' : 'none'; }
  }

  function init(canvas) {
    const T = THREE, N = innerWidth < 900 ? 9000 : 16000;
    const NEON = [.78, 1, .23], BLUE = [.32, .52, 1], INK = [.66, .74, .98], WHITE = [.95, .96, 1];
    const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
    const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const dir = () => { const z = 2 * R() - 1, t = TAU * R(), s = Math.sqrt(1 - z * z); return [s * Math.cos(t), s * Math.sin(t), z]; };
    function build(parts) {
      const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), tot = parts.reduce((a, p) => a + p.w, 0);
      let i = 0;
      parts.forEach((p, pi) => {
        const n = pi === parts.length - 1 ? N - i : Math.round(N * p.w / tot);
        for (let k = 0; k < n && i < N; k++, i++) {
          const q = p.f(k, n);
          pos.set(q, i * 3);
          col.set(p.col ? p.col(q) : mul(p.c, (p.a || 1) * (.78 + R() * .26)), i * 3);
        }
      });
      for (let a = N - 1; a > 0; a--) {
        const b = (R() * (a + 1)) | 0;
        for (let j = 0; j < 3; j++) {
          let t = pos[a * 3 + j]; pos[a * 3 + j] = pos[b * 3 + j]; pos[b * 3 + j] = t;
          t = col[a * 3 + j]; col[a * 3 + j] = col[b * 3 + j]; col[b * 3 + j] = t;
        }
      }
      return { pos, col };
    }
    const inRR = (x, y, w, h, r) => { const dx = Math.max(Math.abs(x) - (w / 2 - r), 0), dy = Math.max(Math.abs(y) - (h / 2 - r), 0); return dx * dx + dy * dy <= r * r; };
    const rrFill = (w, h, r) => { let x, y; do { x = (R() - .5) * w; y = (R() - .5) * h; } while (!inRR(x, y, w, h, r)); return [x, y]; };
    const rrEdge = (w, h, r, t) => { let x, y; do { x = (R() - .5) * w; y = (R() - .5) * h; } while (!(inRR(x, y, w, h, r) && !inRR(x, y, w - t, h - t, Math.max(.01, r - t / 2)))); return [x, y]; };

    const seg = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
    // 1. AI agent: a sleek android head drawn as scan rings, with a glowing visor band
    const HA = 1.15, HB = 1.35, HC = 1.2, HN = 3, HY = .35, RINGS = 24;
    const sp2 = (v, e) => Math.sign(v) * Math.pow(Math.abs(v), e);
    const headPt = (y, th) => { const k = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(y / HB), HN)), 1 / HN); return [HA * k * sp2(Math.cos(th), 2 / HN), HY + y, HC * k * sp2(Math.sin(th), 2 / HN)]; };
    const head = build([
      { w: 40, f: () => headPt(-HB * .94 + ((R() * RINGS) | 0) * (HB * 1.88 / (RINGS - 1)), R() * TAU), col: q => mul(INK, .2 + .42 * (q[2] / HC + 1) / 2) },
      { w: 8, f: () => headPt((R() * 2 - 1) * HB * .94, ((R() * 12) | 0) * TAU / 12), c: INK, a: .28 },
      { w: 14, f: () => { const p = headPt(.02 + R() * .36, Math.PI / 2 + (R() - .5) * 1.9); return [p[0] * 1.01, p[1], p[2] * 1.01]; }, c: BLUE, a: 1.05 },
      { w: 5, f: () => { const p = headPt(.2, Math.PI / 2 + (R() - .5) * 1.8); return [p[0] * 1.02, p[1], p[2] * 1.02]; }, c: NEON, a: 1 },
      { w: 8, f: () => { const sd = R() < .5 ? -1 : 1, r = R() < .55 ? .32 : .2, an = R() * TAU; return [sd * (HA + .03), HY + r * Math.cos(an), r * Math.sin(an)]; }, c: BLUE, a: .8 },
      { w: 9, f: () => { const lv = (R() * 5) | 0, an = R() * TAU, rr = .42 + lv * .02; return [rr * Math.cos(an), -1.12 - lv * .1, rr * .8 * Math.sin(an)]; }, c: INK, a: .38 },
      { w: 16, f: () => { const lv = R() < .6 ? 0 : 1, an = R() * TAU, k = 1 - lv * .05; return [2.0 * k * Math.cos(an), -1.72 - lv * .16, .85 * k * Math.sin(an)]; }, col: q => mul(INK, .2 + .35 * (q[2] / .85 + 1) / 2) }
    ]);
    // 2. Conversation: two message bubbles with text lines and a typing indicator
    const BA = { x: -.45, y: .8, z: -.35, w: 2.7, h: 1.5 }, BB = { x: .55, y: -.55, z: .35, w: 2.3, h: 1.05 }, PL = { x: -1.15, y: -1.5, z: -.1, w: .95, h: .42 };
    const tailPt = (b, sd) => { const bx = b.x + sd * (b.w / 2 - .55), by = b.y - b.h / 2, p = R() < .5 ? [bx, by, b.z] : [bx + sd * .3, by, b.z]; return seg(p, [bx + sd * .45, by - .36, b.z], R()); };
    const txt = (b, L) => { const i = (R() * L.length) | 0; return [b.x - b.w / 2 + .32 + R() * L[i], b.y + (L.length - 1) * .17 - i * .34 + (R() - .5) * .012, b.z + .01]; };
    const bubble = build([
      { w: 16, f: () => { const p = rrEdge(BA.w, BA.h, .38, .035); return [BA.x + p[0], BA.y + p[1], BA.z]; }, c: BLUE, a: 1 },
      { w: 2, f: () => tailPt(BA, -1), c: BLUE, a: 1 },
      { w: 14, f: () => txt(BA, [2.0, 1.55, 1.05]), c: INK, a: .55 },
      { w: 9, f: () => { const p = rrFill(BA.w, BA.h, .38); return [BA.x + p[0], BA.y + p[1], BA.z - .02]; }, c: BLUE, a: .14 },
      { w: 14, f: () => { const p = rrEdge(BB.w, BB.h, .34, .035); return [BB.x + p[0], BB.y + p[1], BB.z]; }, c: NEON, a: 1 },
      { w: 2, f: () => tailPt(BB, 1), c: NEON, a: 1 },
      { w: 10, f: () => txt(BB, [1.55, .95]), c: INK, a: .6 },
      { w: 7, f: () => { const p = rrFill(BB.w, BB.h, .34); return [BB.x + p[0], BB.y + p[1], BB.z - .02]; }, c: NEON, a: .1 },
      { w: 5, f: () => { const p = rrEdge(PL.w, PL.h, .21, .03); return [PL.x + p[0], PL.y + p[1], PL.z]; }, c: INK, a: .6 },
      { w: 5, f: () => { const k = ((R() * 3) | 0) - 1, an = R() * TAU, r = .065 * Math.sqrt(R()); return [PL.x + k * .24 + r * Math.cos(an), PL.y + r * Math.sin(an), PL.z]; }, c: BLUE, a: 1 }
    ]);
    // 3. Database: three crisp cylinders with rims, side ribs, status lights and incoming streams
    const DY = [1.0, 0, -1.0], DR = 1.3, DH = .62;
    const db = build([
      { w: 24, f: () => { const c = DY[(R() * 3) | 0], an = R() * TAU; return [DR * Math.cos(an), c + (R() < .5 ? DH / 2 : -DH / 2), DR * Math.sin(an)]; }, col: q => mul(INK, .35 + .4 * (q[2] / DR + 1) / 2) },
      { w: 18, f: () => { const c = DY[(R() * 3) | 0], an = ((R() * 28) | 0) * TAU / 28; return [DR * Math.cos(an), c + (R() - .5) * DH, DR * Math.sin(an)]; }, c: INK, a: .22 },
      { w: 10, f: () => { const rr = R() < .5 ? .45 : .85, an = R() * TAU; return [rr * Math.cos(an), DY[0] + DH / 2, rr * Math.sin(an)]; }, c: INK, a: .35 },
      { w: 12, f: () => { const c = DY[(R() * 3) | 0], an = Math.PI / 2 - .15 - R() * .7; return [DR * 1.005 * Math.cos(an), c + .1, DR * 1.005 * Math.sin(an)]; }, c: BLUE, a: 1.05 },
      { w: 5, f: () => { const c = DY[(R() * 3) | 0], an = Math.PI / 2 + .25 + ((R() * 3) | 0) * .13, d = dir(), r = .035; return [DR * Math.cos(an) + d[0] * r, c - .1 + d[1] * r, DR * Math.sin(an) + d[2] * r]; }, c: NEON, a: 1 },
      { w: 9, f: () => { const an = ((R() * 6) | 0) * TAU / 6 + .3; return [.62 * Math.cos(an), DY[0] + DH / 2 + .15 + R() * 1.05, .62 * Math.sin(an)]; }, col: q => mul(BLUE, Math.max(.1, .95 * (1 - (q[1] - 1.46) / 1.2))) }
    ]);
    // 4. Laptop: thin bezel, syntax-coloured code lines, key outlines and trackpad
    const scr = (x, s) => [x, -1.0 + s * Math.cos(.22), -.9 - s * Math.sin(.22)];
    const rowsL = Array.from({ length: 9 }, (_, k) => ({ s: .42 + k * .17, x0: -1.35 + ((k * 7) % 4) * .2, a: .28 + ((k * 3) % 4) * .1, b: .35 + ((k * 5) % 5) * .17, c: k % 3 === 0 ? .22 : 0 }));
    const tok = w => () => { let r = rowsL[(R() * rowsL.length) | 0]; if (w === 2) r = rowsL[((R() * 3) | 0) * 3]; const x0 = w === 0 ? r.x0 : w === 1 ? r.x0 + r.a + .08 : r.x0 + r.a + r.b + .16, L = w === 0 ? r.a : w === 1 ? r.b : r.c; return scr(x0 + R() * L, r.s + (R() - .5) * .014); };
    const laptop = build([
      { w: 12, f: () => { const p = rrEdge(3.4, 2.15, .08, .035); return scr(p[0], p[1] + 1.075); }, c: INK, a: .8 },
      { w: 7, f: () => { const p = rrEdge(3.16, 1.9, .04, .025); return scr(p[0], p[1] + 1.075); }, c: INK, a: .35 },
      { w: 6, f: () => { const p = rrFill(3.16, 1.9, .04); return scr(p[0], p[1] + 1.075); }, c: BLUE, a: .1 },
      { w: 9, f: tok(0), c: BLUE, a: 1 },
      { w: 12, f: tok(1), c: INK, a: .6 },
      { w: 4, f: tok(2), c: NEON, a: 1 },
      { w: 2, f: () => { const r = rowsL[5]; return scr(r.x0 + r.a + r.b + .14 + R() * .1, r.s + (R() - .5) * .12); }, c: NEON, a: 1 },
      { w: 12, f: () => { const p = rrEdge(3.6, 2.2, .12, .035); return [p[0], -1.02, p[1] + .2]; }, c: INK, a: .7 },
      { w: 24, f: () => { const i = (R() * 13) | 0, j = (R() * 4) | 0, p = rrEdge(.19, .16, .03, .022); return [-1.44 + i * .24 + p[0], -1.0, -.62 + j * .22 + p[1]]; }, c: INK, a: .42 },
      { w: 6, f: () => { const p = rrEdge(1.1, .6, .06, .025); return [p[0], -1.0, p[1] + .95]; }, c: INK, a: .6 },
      { w: 4, f: () => [(R() - .5) * 3.2, -1.0, -.88], c: BLUE, a: .7 }
    ]);
    // 5. Neural network: hollow nodes, fine connections and bright signal packets
    const NL = [[-2.0, 3], [-1.0, 5], [0, 6], [1.0, 5], [2.0, 3]].map(([x, n]) => Array.from({ length: n }, (_, k) => [x, (k - (n - 1) / 2) * .62, (R() - .5) * .6]));
    const edges = []; for (let l = 0; l < NL.length - 1; l++) for (const p of NL[l]) for (const q of NL[l + 1]) edges.push([p, q]);
    const hot = edges.filter((_, i) => i % 7 === 0);
    const node = r => { const L = NL[(R() * NL.length) | 0], n = L[(R() * L.length) | 0], d = dir(); return [n[0] + d[0] * r, n[1] + d[1] * r, n[2] + d[2] * r]; };
    const net = build([
      { w: 26, f: () => node(.14), col: q => Math.abs(q[0]) > 1.7 ? mul(NEON, .95) : mul(BLUE, 1) },
      { w: 5, f: () => node(.04 * Math.cbrt(R())), c: WHITE, a: 1 },
      { w: 46, f: () => { const [p, q] = edges[(R() * edges.length) | 0]; return seg(p, q, .1 + R() * .8); }, c: INK, a: .2 },
      { w: 12, f: () => { const hi = (R() * hot.length) | 0, [p, q] = hot[hi]; return seg(p, q, .2 + ((hi * .37) % 1) * .6 + (R() - .5) * .1); }, c: NEON, a: 1 }
    ]);

    const shapes = [head, bubble, db, laptop, net];
    const offX = [2.3, -2.3, 2.3, -2.3, 2.3], tiltX = [.06, 0, .32, .38, 0], spin = [0, 0, 0, 0, 0];
    const scatter = new Float32Array(N * 3), phase = new Float32Array(N);
    for (let i = 0; i < N; i++) { const d = dir(), k = 1.2 + R() * 2.4; scatter.set([d[0] * k, d[1] * k, d[2] * k], i * 3); phase[i] = R() * TAU; }

    let rd;
    try { rd = new T.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
    rd.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, 1, .1, 100);
    camera.position.z = 9.5;
    const geo = new T.BufferGeometry(), P = new Float32Array(head.pos), C = new Float32Array(head.col);
    geo.setAttribute('position', new T.BufferAttribute(P, 3)); geo.setAttribute('color', new T.BufferAttribute(C, 3));
    triAttrs(geo, N, .07);
    const mat = triMaterial(.045, .9);
    const group = new T.Group(); group.add(new T.Points(geo, mat)); scene.add(group);
    // Ambient constellation: drifting triangles in the brand palette, warped by scroll speed.
    const SN = innerWidth < 900 ? 900 : 1800, sp = new Float32Array(SN * 3), sc = new Float32Array(SN * 3), SPAL = [NEON, BLUE, INK, [.2, .85, .75]];
    for (let i = 0; i < SN; i++) { sp.set([(R() - .5) * 60, (R() - .5) * 40, -4 - R() * 34], i * 3); sc.set(mul(SPAL[(R() * 4) | 0], .35 + R() * .5), i * 3); }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3)); sg.setAttribute('color', new T.BufferAttribute(sc, 3));
    triAttrs(sg, SN, .35);
    const smat = triMaterial(.07, .55), stars = new T.Points(sg, smat);
    scene.add(stars);
    const resize = () => { rd.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); fitScale(mat, rd); fitScale(smat, rd); };
    addEventListener('resize', resize); resize();
    const smooth = t => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
    const clock = new T.Clock();
    const ray = new T.Raycaster(), ndc = new T.Vector2(), inv = new T.Matrix4(), o3 = new T.Vector3(), d3 = new T.Vector3(), disp = new Float32Array(N * 3);
    let mx = 0, my = 0, ang = 0, last = 0, lastLight = null, wp = 0, waveT = -9;

    G = {
      draw(cur, st) {
        const t = clock.getElapsedTime(), dt = Math.min(.05, t - last); last = t;
        const light = !!st.light;
        if (light !== lastLight) {
          lastLight = light;
          mat.blending = light ? T.NormalBlending : T.AdditiveBlending; mat.uniforms.uOp.value = light ? .95 : .9; mat.uniforms.uSize.value = light ? .055 : .045; mat.needsUpdate = true;
          smat.blending = mat.blending; smat.uniforms.uOp.value = light ? .5 : .55; smat.needsUpdate = true;
        }
        mat.uniforms.uTime.value = smat.uniforms.uTime.value = t;
        // Scroll speed drives a warp: wider FOV, stronger burst, stars rushing past.
        const warp = reduce ? 0 : Math.min(1, Math.abs(vel) * 28);
        wp += (warp - wp) * .08;
        if (pulse) { waveT = t; pulse = false; }
        const age = t - waveT, wr = age * 5.5, wa = age < 2.4 ? .55 * (1 - age / 2.4) : 0;
        for (let j = 2; j < SN * 3; j += 3) { sp[j] += dt * (.25 + wp * 34); if (sp[j] > 9) sp[j] -= 43; }
        sg.attributes.position.needsUpdate = true;
        let i = Math.min(LAST - 1, Math.floor(cur)), f = smooth((cur - i - .2) / .6);
        if (cur >= LAST) { i = LAST - 1; f = 1; }
        const A = shapes[i], B = shapes[i + 1], ex = reduce ? 0 : Math.sin(Math.PI * f) * .6 + wp * .3, jit = reduce ? 0 : .012;
        if (!reduce) {
          camera.position.z = 9.5 - Math.sin(Math.PI * f) * 1.2;
          camera.rotation.z += ((st.rtl ? -1 : 1) * Math.max(-.06, Math.min(.06, vel * 3)) - camera.rotation.z) * .1;
          camera.fov = 45 + wp * 10; camera.updateProjectionMatrix();
        }
        mx += (tmx - mx) * .05; my += (tmy - my) * .05;
        if (!reduce) ang += dt * (spin[i] + (spin[i + 1] - spin[i]) * f);
        const ox = offX[i] + (offX[i + 1] - offX[i]) * f, tx = tiltX[i] + (tiltX[i + 1] - tiltX[i]) * f;
        if (phone()) { group.position.set(0, 1.7, 0); group.scale.setScalar(Math.min(.8, camera.aspect * 1.6)); }
        else { group.position.set((st.rtl ? -1 : 1) * ox * Math.min(1, camera.aspect / 1.6), .1, 0); group.scale.setScalar(Math.min(1, camera.aspect / 1.5)); }
        group.rotation.y = ang + (reduce ? 0 : Math.sin(t * .3) * .3) + mx * .4 + ex * .5;
        group.rotation.x = tx + my * .2;
        group.updateMatrixWorld(true);
        // Cursor repel: push particles away from the pointer ray, in the group's local space
        const on = inside && !reduce;
        let rox = 0, roy = 0, roz = 0, rdx = 0, rdy = 0, rdz = 1;
        if (on) {
          ndc.set(tmx * 2, -tmy * 2); ray.setFromCamera(ndc, camera);
          inv.copy(group.matrixWorld).invert();
          o3.copy(ray.ray.origin).applyMatrix4(inv);
          d3.copy(ray.ray.origin).add(ray.ray.direction).applyMatrix4(inv).sub(o3).normalize();
          rox = o3.x; roy = o3.y; roz = o3.z; rdx = d3.x; rdy = d3.y; rdz = d3.z;
        }
        const RR = .95, PU = .62;
        for (let k = 0, j = 0; k < N; k++, j += 3) {
          const ph = phase[k];
          const bx = A.pos[j] + (B.pos[j] - A.pos[j]) * f + scatter[j] * ex + Math.sin(t * 1.3 + ph) * jit;
          const by = A.pos[j + 1] + (B.pos[j + 1] - A.pos[j + 1]) * f + scatter[j + 1] * ex + Math.cos(t * 1.1 + ph) * jit;
          const bz = A.pos[j + 2] + (B.pos[j + 2] - A.pos[j + 2]) * f + scatter[j + 2] * ex;
          let qx = 0, qy = 0, qz = 0;
          if (wa > 0) {
            const L = Math.sqrt(bx * bx + by * by + bz * bz) + 1e-4, dd = L - wr, k = wa * Math.exp(-dd * dd * 5) / L;
            qx = bx * k; qy = by * k; qz = bz * k;
          }
          if (on) {
            const vx = bx - rox, vy = by - roy, vz = bz - roz, tt = vx * rdx + vy * rdy + vz * rdz;
            const px = vx - tt * rdx, py = vy - tt * rdy, pz = vz - tt * rdz, d2 = px * px + py * py + pz * pz;
            if (d2 < RR * RR) {
              const d = Math.sqrt(d2) + 1e-4, sv = 1 - d / RR, m = PU * sv * sv * (.65 + .35 * Math.sin(ph * 3)) / d;
              qx += px * m + scatter[j] * .07 * sv; qy += py * m + scatter[j + 1] * .07 * sv; qz += pz * m + scatter[j + 2] * .07 * sv;
            }
          }
          disp[j] += (qx - disp[j]) * .14; disp[j + 1] += (qy - disp[j + 1]) * .14; disp[j + 2] += (qz - disp[j + 2]) * .14;
          P[j] = bx + disp[j]; P[j + 1] = by + disp[j + 1]; P[j + 2] = bz + disp[j + 2];
          const g = 1 + .9 * Math.min(1, Math.abs(disp[j]) + Math.abs(disp[j + 1]) + Math.abs(disp[j + 2]));
          let cr = (A.col[j] + (B.col[j] - A.col[j]) * f) * g, cg = (A.col[j + 1] + (B.col[j + 1] - A.col[j + 1]) * f) * g, cb = (A.col[j + 2] + (B.col[j + 2] - A.col[j + 2]) * f) * g;
          if (light) { const mxc = Math.max(cr, cg, cb), iv = mxc > 0 ? 1 / mxc : 0, kk = Math.min(1, .42 + mxc * 1.05); cr = 1 - kk * (1 - .42 * cr * iv); cg = 1 - kk * (1 - .42 * cg * iv); cb = 1 - kk * (1 - .42 * cb * iv); }
          C[j] = cr; C[j + 1] = cg; C[j + 2] = cb;
        }
        geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
        stars.rotation.y = t * .006 + cur * .05; stars.position.y = cur * .6; stars.rotation.z = cur * .08;
        rd.render(scene, camera);
      },
      dispose() { removeEventListener('resize', resize); rd.dispose(); }
    };
  }

  function boot(n) {
    if (dead) return;
    const c = $('af-gl');
    if (c) { init(c); return; }
    if (n < 200) setTimeout(() => boot(n + 1), 100);
  }

  function frame() {
    if (dead) return;
    raf = requestAnimationFrame(frame);
    const st = getState(), story = $('af-story');
    if (st.page !== 'home' || !story || !story.firstElementChild) return;
    const r = story.getBoundingClientRect();
    const H = story.firstElementChild.offsetHeight || innerHeight;
    const hh = (document.querySelector('header') || {}).offsetHeight || 0;
    target = Math.min(LAST, Math.max(0, (hh - r.top) / H));
    if (first) { cur = prevT = target; first = false; }
    vel += (target - prevT - vel) * .2; prevT = target;
    cur += (target - cur) * (reduce ? 1 : .07);
    if (Math.abs(target - cur) < 1e-4) cur = target;
    ui(cur, r);
    if (G && r.bottom > 0) G.draw(cur, st);
  }

  raf = requestAnimationFrame(frame);
  boot(0);
  return { stop() { dead = true; cancelAnimationFrame(raf); removeEventListener('pointermove', onMove); removeEventListener('mouseout', onOut); removeEventListener('pointerup', onUp); removeEventListener('pointerdown', onDown); if (G) G.dispose(); } };
}
