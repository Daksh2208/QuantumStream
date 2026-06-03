export const SCENE_COUNT = 6;

// Normalized scroll progress [0..1] -> scene index + local t
export function sceneFromProgress(p) {
  const clamped = Math.min(1, Math.max(0, p));
  const scaled = clamped * SCENE_COUNT;
  const idx = Math.min(SCENE_COUNT - 1, Math.floor(scaled));
  const localT = scaled - idx;
  return { index: idx, t: localT };
}

export function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

// Keyframes for camera path across the 6 scenes.
// These are intentionally cinematic but simple. We'll refine after first visual pass.
const KEYFRAMES = [
  // Scene 01 — Initialization
  {
    pos: { x: 0.0, y: 0.85, z: 3.6 },
    target: { x: 0, y: 0.1, z: 0 },
    fov: 45,
  },
  // Scene 02 — Circuit Formation
  {
    pos: { x: 0.9, y: 0.65, z: 3.0 },
    target: { x: 0.02, y: 0.1, z: 0.0 },
    fov: 42,
  },
  // Scene 03 — Simulation
  {
    pos: { x: 1.4, y: 0.35, z: 2.7 },
    target: { x: 0.0, y: 0.15, z: -0.1 },
    fov: 40,
  },
  // Scene 04 — Intelligence Layer
  {
    pos: { x: 1.55, y: 0.15, z: 2.35 },
    target: { x: 0.0, y: 0.2, z: -0.2 },
    fov: 38,
  },
  // Scene 05 — Security Layer
  {
    pos: { x: 1.35, y: 0.25, z: 2.05 },
    target: { x: 0.0, y: 0.18, z: -0.25 },
    fov: 37,
  },
  // Scene 06 — Quantum Collapse
  {
    pos: { x: 0.65, y: 0.65, z: 2.4 },
    target: { x: 0.0, y: 0.25, z: 0.0 },
    fov: 40,
  },
];

export function cameraFromProgress(p) {
  const clamped = clamp01(p);
  const scaled = clamped * (KEYFRAMES.length - 1);
  const idx = Math.floor(scaled);
  const t = scaled - idx;
  const i0 = Math.max(0, Math.min(KEYFRAMES.length - 2, idx));
  const i1 = i0 + 1;

  const k0 = KEYFRAMES[i0];
  const k1 = KEYFRAMES[i1];

  const tt = t * t * (3 - 2 * t); // smoothstep-ish

  const pos = {
    x: lerp(k0.pos.x, k1.pos.x, tt),
    y: lerp(k0.pos.y, k1.pos.y, tt),
    z: lerp(k0.pos.z, k1.pos.z, tt),
  };

  const target = {
    x: lerp(k0.target.x, k1.target.x, tt),
    y: lerp(k0.target.y, k1.target.y, tt),
    z: lerp(k0.target.z, k1.target.z, tt),
  };

  const fov = lerp(k0.fov, k1.fov, tt);

  return { pos, target, fov };
}

