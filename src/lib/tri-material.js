// Points drawn as a constellation (DESIGN.md): most are soft glow dots, the larger ones outlined spinning triangles.
// Per-point attributes: color (vec3), sz (size factor; > 2 = triangle), rot (initial angle).
import * as THREE from 'three';

const vertexShader = `
attribute float sz; attribute float rot;
uniform float uSize, uScale, uTime;
varying vec3 vC; varying float vR, vT, vD;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * sz * uScale / -mv.z;
  vC = color; vT = step(2.0, sz);
  vR = rot + uTime * (fract(rot * 7.13) - 0.5) * 0.9;
  vD = clamp(1.4 - (-mv.z) / 30.0, 0.15, 1.0);
}`;

const fragmentShader = `
uniform float uOp;
varying vec3 vC; varying float vR, vT, vD;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float a;
  if (vT > 0.5) {
    float c = cos(vR), s = sin(vR);
    p = mat2(c, -s, s, c) * vec2(p.x, -p.y);
    const float k = 1.7320508;
    p.x = abs(p.x) - 0.78; p.y = p.y + 0.78 / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -1.56, 0.0);
    float d = -length(p) * sign(p.y);
    a = 1.0 - smoothstep(0.05, 0.16, abs(d + 0.08));
  } else {
    float r = length(p);
    a = r < 0.35 ? 1.0 - r * 0.57 : 0.8 * (1.0 - (r - 0.35) / 0.65);
  }
  if (a < 0.02) discard;
  gl_FragColor = vec4(vC, a * uOp * vD);
}`;

export function triMaterial(size, opacity) {
  return new THREE.ShaderMaterial({
    uniforms: { uSize: { value: size }, uScale: { value: 400 }, uTime: { value: 0 }, uOp: { value: opacity } },
    vertexShader, fragmentShader, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
}

// sz/rot attributes for n points: a share `tri` of them become triangles.
export function triAttrs(geo, n, tri, R = Math.random) {
  const sz = new Float32Array(n), rot = new Float32Array(n);
  for (let i = 0; i < n; i++) { sz[i] = R() < tri ? 3 + R() * 2.4 : .8 + R() * .5; rot[i] = R() * Math.PI * 2; }
  geo.setAttribute('sz', new THREE.BufferAttribute(sz, 1)); geo.setAttribute('rot', new THREE.BufferAttribute(rot, 1));
}

// uScale makes uSize behave like PointsMaterial's world-unit size with sizeAttenuation.
export const fitScale = (mat, rd) => { mat.uniforms.uScale.value = rd.domElement.height / 2; };
