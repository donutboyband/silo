// Draws the network for the /mycelium page at build time, as roots: each node
// grows a thick limb out to every project, forking finer toward the tips, over
// fine grey rootlets that tie the four nodes together.
//
// A fixed seed means the same drawing on every build, so the page ships plain
// SVG paths and no drawing code.

import type { Pillar } from '../data/catalog';
import { placeOnMap } from './usmap';

type Pt = { x: number; y: number };

export interface Line {
  d: string;
  /** stroke width in viewBox units */
  w: number;
  /** stroke opacity (web only) */
  o?: number;
  /** which silo's colour it takes (web only): a pillar key */
  c?: string;
  /** when it starts drawing, ms after its node opens */
  delay?: number;
  /** how long it takes to draw, ms */
  dur?: number;
}

export interface Tip {
  x: number;
  y: number;
  lx: number;
  ly: number;
  anchor: 'start' | 'end' | 'middle';
  name: string;
  desc: string;
  url?: string;
  soon?: boolean;
  delay: number;
}

export interface Node {
  key: string;
  name: string;
  desc: string;
  x: number;
  y: number;
  labelBelow: boolean;
  /** where the node's name sits, relative to its centre */
  labelDy: number;
  /** where this node's US map sits, if its projects are places (DeCamp) */
  map?: { x: number; y: number; s: number };
  lines: Line[];
  tips: Tip[];
}

export interface Network {
  w: number;
  h: number;
  /** radius of the node discs */
  nodeR: number;
  web: Line[];
  nodes: Node[];
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;
const P = (p: Pt) => `${r1(p.x)} ${r1(p.y)}`;
const polar = (o: Pt, ang: number, d: number): Pt => ({ x: o.x + Math.cos(ang) * d, y: o.y + Math.sin(ang) * d });
const curve = (a: Pt, c1: Pt, c2: Pt, b: Pt) => `M${P(a)} C${P(c1)} ${P(c2)} ${P(b)}`;

/** A point on a cubic curve, for forking side branches off it. */
function onCurve(a: Pt, c1: Pt, c2: Pt, b: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
    y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
  };
}

export function grow(
  pillars: Pillar[],
  layout: {
    w: number;
    h: number;
    at: Pt[];
    reach: [number, number];
    seed: number;
    charW?: number;
    /** radius of the node discs (they carry the silo marks) */
    nodeR?: number;
    labels?: 'side' | 'stack';
    /** per pillar key: a US map box (top-left corner and scale) its places land on */
    maps?: Record<string, { x: number; y: number; s: number }>;
  },
): Network {
  const rand = rng(layout.seed);
  const { w, h } = layout;
  const at = layout.at;
  const center = { x: w / 2, y: h / 2 };
  const pad = 26;
  const inside = (p: Pt) => p.x >= pad && p.x <= w - pad && p.y >= pad && p.y <= h - pad;
  const clamp = (p: Pt): Pt => ({ x: Math.min(w - pad, Math.max(pad, p.x)), y: Math.min(h - pad, Math.max(pad, p.y)) });
  const charW = layout.charW ?? 9.4;
  const nodeR = layout.nodeR ?? 13;
  // node names sit just outside the disc: below it for top nodes, above for bottom
  const labelDyFor = (o: Pt) => (o.y < center.y ? nodeR + 40 : -(nodeR + 22));
  const stack = layout.labels === 'stack';
  const labelW = (s: string) => s.length * charW + 14;

  // ---------------------------------------------------------------- the web
  const web: Line[] = [];

  {
    // a soft halo of fine rootlets around each node, in its silo's colour
    // (no threads between nodes: that read as too busy)
    at.forEach((o, i) => {
      for (let k = 0; k < 5; k++) {
        const ang = (k / 5) * Math.PI * 2 + rand() * 0.9;
        rootlet(o, ang, 60 + rand() * 60, 0.7, 1, pillars[i].key);
      }
    });
  }

  function rootlet(o: Pt, ang: number, len: number, wd: number, depth: number, c: string) {
    const end = polar(o, ang, len);
    const bend = ang + (rand() - 0.5) * 0.9;
    const c1 = polar(o, bend, len * 0.4);
    const c2 = polar(o, ang + (rand() - 0.5) * 0.4, len * 0.75);
    if (!inside(end)) return;
    web.push({ d: curve(o, c1, c2, end), w: wd, o: 0.18 + depth * 0.08, c });
    if (depth > 0)
      for (let k = 0; k < 2; k++) {
        const t = 0.35 + rand() * 0.5;
        rootlet(onCurve(o, c1, c2, end, t), ang + (rand() < 0.5 ? -1 : 1) * (0.4 + rand() * 0.5), len * 0.5, wd * 0.7, depth - 1, c);
      }
  }

  // ---------------------------------------------------------------- the nodes
  const nodes: Node[] = pillars.map((p, i) => {
    const o = at[i];
    const out = Math.atan2(o.y - center.y, o.x - center.x);
    const lines: Line[] = [];
    const tips: Tip[] = [];
    const n = p.items.length;
    const spread = Math.min(2.4, 0.72 * n);
    const DRAW = 900;

    // A node whose projects are places draws a map first; roots grow after it.
    const box = layout.maps?.[p.key];
    const lag = box ? 350 : 0;

    // where each project sits: on the map at its real spot, or fanned outward
    const tipPts = p.items.map((it, k) => {
      if (box && it.at) {
        const m = placeOnMap(it.at);
        const pt = { x: box.x + m.x * box.s, y: box.y + m.y * box.s };
        const side = it.labelSide ?? 'right';
        const sideOk = !stack && (side === 'left' || side === 'right');
        return {
          it,
          ang: Math.atan2(pt.y - o.y, pt.x - o.x),
          pt,
          right: sideOk && side === 'right',
          left: sideOk && side === 'left',
          above: side === 'above' || (stack && side !== 'below'),
        };
      }
      const t = n === 1 ? 0 : k / (n - 1) - 0.5;
      const ang = out + t * spread + (rand() - 0.5) * 0.12;
      const dist = layout.reach[0] + rand() * (layout.reach[1] - layout.reach[0]);
      const cos = Math.cos(ang);
      const right = !stack && cos > 0.35;
      const left = !stack && cos < -0.35;
      const lw = labelW(it.name);
      const raw = clamp(polar(o, ang, dist));
      const x = right ? Math.min(raw.x, w - 8 - lw) : left ? Math.max(raw.x, 8 + lw) : Math.min(w - lw / 2, Math.max(lw / 2, raw.x));
      return { it, ang, pt: { x, y: raw.y }, right, left, above: undefined as boolean | undefined };
    });

    {
      // roots: a thick limb to each project, forking finer as it goes
      const limb = (a: Pt, b: Pt, wd: number, delay: number, depth: number) => {
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const d = Math.hypot(b.x - a.x, b.y - a.y);
        const c1 = polar(a, ang + (rand() - 0.5) * 0.5, d * 0.35);
        const c2 = polar(a, ang + (rand() - 0.5) * 0.3, d * 0.7);
        lines.push({ d: curve(a, c1, c2, b), w: wd, delay, dur: 420 + depth * 120 });
        if (depth <= 0) return;
        const forks = 2 + Math.floor(rand() * 2);
        for (let k = 0; k < forks; k++) {
          const t = 0.3 + rand() * 0.55;
          const from = onCurve(a, c1, c2, b, t);
          const fa = ang + (rand() < 0.5 ? -1 : 1) * (0.35 + rand() * 0.55);
          const end = polar(from, fa, d * (0.25 + rand() * 0.25));
          if (inside(end)) limb(from, end, wd * 0.55, delay + t * (420 + depth * 120), depth - 1);
        }
      };
      tipPts.forEach(({ pt }, k) => limb(o, pt, 3.2, lag + k * 80, 2));
    }

    tipPts.forEach(({ it, ang, pt, right, left, above }, k) => {
      const up = above ?? Math.sin(ang) <= 0;
      // a centred label that would run off the drawing slides back in
      const half = labelW(it.name) / 2;
      const slide = right || left ? 0 : Math.min(w - 4 - half - pt.x, Math.max(4 + half - pt.x, 0));
      tips.push({
        x: r1(pt.x),
        y: r1(pt.y),
        lx: right ? 12 : left ? -12 : r1(slide),
        ly: right || left ? 5 : up ? (stack ? -16 : -14) : stack ? 32 : 24,
        anchor: right ? 'start' : left ? 'end' : 'middle',
        name: it.name,
        desc: it.desc,
        url: it.url,
        soon: it.soon,
        delay: lag + DRAW - 100 + k * 80,
      });
    });

    // stacked labels can collide; flip a clashing one to the other side of its dot
    if (stack) {
      const box = (t: Tip) => {
        const lw = labelW(t.name);
        return { l: t.x - lw / 2, r: t.x + lw / 2, t: t.y + t.ly - 20, b: t.y + t.ly + 6 };
      };
      const clash = (a: Tip, b: Tip) => {
        const q1 = box(a);
        const q2 = box(b);
        return q1.l < q2.r && q2.l < q1.r && q1.t < q2.b && q2.t < q1.b;
      };
      // the node's own name is bigger type (about 1.3x), centred on the node
      const nw = labelW(p.name) * 1.3;
      const ny = o.y + labelDyFor(o);
      const nodeBox = { l: o.x - nw / 2, r: o.x + nw / 2, t: ny - 26, b: ny + 8 };
      const hitsNode = (a: Tip) => {
        const q = box(a);
        return q.l < nodeBox.r && nodeBox.l < q.r && q.t < nodeBox.b && nodeBox.t < q.b;
      };
      tips.forEach((t, k) => {
        if (hitsNode(t) || tips.slice(0, k).some((u) => clash(t, u))) t.ly = t.ly > 0 ? -16 : 32;
      });
    }

    return {
      key: p.key,
      name: p.name,
      desc: p.desc,
      x: o.x,
      y: o.y,
      labelBelow: o.y < center.y,
      labelDy: labelDyFor(o),
      map: box,
      lines,
      tips,
    };
  });

  return { w, h, nodeR, web, nodes };
}
