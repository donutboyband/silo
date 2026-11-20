// A lo-fi sandbox, drawn at build time as wobbly hand-drawn lines: a wooden
// frame of boards seen a little from above, stippled sand with ripples, and
// one toy per Sandbox project (Maison is a little house, Linernotes a record
// sleeve). Each project's dot and label sit on its toy, the way DeCamp's sit
// on the map. It sits behind Sandbox's node, which lands in the middle of the
// sand. Drawn around (0, 0); about 360 x 200 units.
import type { Item } from '@shared/content/catalog';
import { poly, type Pt } from './grow';
import { sketcher, type Art } from './sketch';

// the frame: a trapezoid, narrower at the back (top) than the front
const BACK = -74;
const FRONT = 74;
const BACK_W = 130; // half widths
const FRONT_W = 172;
const PLANK = 16; // how wide the boards look from above
const DEPTH = 22; // how much of the front boards' face shows
const CLEAR = 50; // keep the middle this clear (the node's disc)

/** Where the projects' toys stand, in order: their dot goes at the toy's
 * base. Left and right of the node first, then back and front corners. */
export const sandboxSlots: Pt[] = [
  { x: -102, y: 26 },
  { x: 104, y: 26 },
  { x: -70, y: -34 },
  { x: 74, y: -34 },
];
const TOY_W = 30; // half the width a toy may take

/** A point in the frame: u from -1 (left) to 1 (right), v from 0 (back) to 1 (front). */
const at = (u: number, v: number, inset = 0): Pt => {
  const y = BACK + inset + (FRONT - BACK - 2 * inset) * v;
  const half = BACK_W + (FRONT_W - BACK_W) * ((y - BACK) / (FRONT - BACK)) - inset * 1.1;
  return { x: u * half, y };
};
const mid = (a: Pt, b: Pt, t = 0.5): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const r1 = (n: number) => Math.round(n * 10) / 10;
const dot = (p: Pt) => `M${r1(p.x)} ${r1(p.y)}h0`;

/** items: Sandbox's projects, in the order their slots are used. */
export function sandboxArt(items: Item[], seed = 5): Art {
  const { rand, sketch, arc } = sketcher(seed);
  const outline: string[] = [];
  const detail: string[] = [];
  const dots: string[] = [];

  // ---------------------------------------------------------------- frame
  const outer = [at(-1, 0), at(1, 0), at(1, 1), at(-1, 1)];
  const inner = [at(-1, 0, PLANK), at(1, 0, PLANK), at(1, 1, PLANK), at(-1, 1, PLANK)];
  const down = (p: Pt): Pt => ({ x: p.x, y: p.y + DEPTH });

  outline.push(
    sketch([...outer, outer[0]], 1, 7),
    sketch([...inner, inner[0]], 0.9, 7),
    // the front boards' face, the sides dropping to it
    sketch([outer[3], down(outer[3]), down(outer[2]), outer[2]], 1, 7),
  );
  // square corner blocks, with their tops a little proud of the boards
  outer.forEach((p, i) => {
    const q = inner[i];
    const c = mid(p, q, 0.5);
    const s = PLANK * 0.62;
    outline.push(sketch([
      { x: c.x - s, y: c.y - s * 0.7 },
      { x: c.x + s, y: c.y - s * 0.7 },
      { x: c.x + s, y: c.y + s * 0.7 },
      { x: c.x - s, y: c.y + s * 0.7 },
      { x: c.x - s, y: c.y - s * 0.7 },
    ], 0.35, 5));
    // a nail in each block
    dots.push(dot(c));
  });

  // each side is two boards: a seam down the middle of the frame, and grain
  for (const [a, b, ia, ib] of [
    [0, 1, 0, 1],
    [1, 2, 1, 2],
    [2, 3, 2, 3],
    [3, 0, 3, 0],
  ]) {
    const seamA = mid(outer[a], inner[ia]);
    const seamB = mid(outer[b], inner[ib]);
    detail.push(sketch([mid(seamA, seamB, 0.08), mid(seamA, seamB, 0.92)], 0.6, 10));
    // a short grain stroke or two on each board
    for (const t of [0.22, 0.6]) {
      const g0 = mid(mid(outer[a], outer[b], t), mid(inner[ia], inner[ib], t), 0.25);
      const g1 = mid(mid(outer[a], outer[b], t + 0.12), mid(inner[ia], inner[ib], t + 0.12), 0.25);
      detail.push(sketch([g0, g1], 0.4, 8));
    }
  }
  // the front face: board joints, nails, and shading
  for (const u of [-0.34, 0.34]) {
    const top = at(u, 1);
    detail.push(sketch([top, down(top)], 0.4, 8));
    dots.push(dot({ x: top.x - 5, y: top.y + DEPTH / 2 }), dot({ x: top.x + 5, y: top.y + DEPTH / 2 }));
  }
  for (let x = outer[3].x + 8; x < outer[2].x - 4; x += 10) {
    detail.push(sketch([{ x, y: FRONT + DEPTH - 2 }, { x: x + 7, y: FRONT + 3 }], 0.4, 20));
  }
  // ground: a line it sits on, running a little past each end, with grass
  const ground = FRONT + DEPTH + 1;
  outline.push(sketch([{ x: -FRONT_W - 26, y: ground }, { x: FRONT_W + 30, y: ground + 1 }], 1, 8));
  for (const x of [-FRONT_W - 18, -FRONT_W - 9, FRONT_W + 10, FRONT_W + 22]) {
    detail.push(sketch([{ x: x - 4, y: ground - 7 }, { x, y: ground }, { x: x + 3, y: ground - 9 }], 0.4, 10));
  }

  // ---------------------------------------------------------------- toys
  // A little house (Maison, a filter house toy): walls, a pitched roof, a
  // door, a filter knob on the front, and sound coming out of the chimney.
  const house = ({ x, y }: Pt) => {
    const w = 22;
    const h = 24;
    const top = y - h;
    outline.push(
      sketch([{ x: x - w, y }, { x: x - w, y: top }, { x: x + w, y: top }, { x: x + w, y }], 0.4, 5),
      sketch([{ x: x - w - 5, y: top + 1 }, { x, y: top - 20 }, { x: x + w + 5, y: top + 1 }], 0.4, 5),
      // chimney
      sketch([{ x: x + 9, y: top - 12 }, { x: x + 9, y: top - 22 }, { x: x + 15, y: top - 22 }, { x: x + 15, y: top - 7 }], 0.3, 4),
      // door
      sketch([{ x: x - 15, y }, { x: x - 15, y: y - 14 }, { x: x - 6, y: y - 14 }, { x: x - 6, y }], 0.3, 4),
      // the filter knob, and its pointer
      sketch(arc(x + 9, y - 11, 6, 6, 0, Math.PI * 2, 12), 0.25, 3),
    );
    detail.push(
      sketch([{ x: x + 9, y: y - 11 }, { x: x + 12, y: y - 15 }], 0.1, 6),
      // tick marks round the knob
      ...[-2.4, -1.6, -0.8, 0].map((t) =>
        sketch([{ x: x + 9 + Math.cos(t) * 8, y: y - 11 + Math.sin(t) * 8 }, { x: x + 9 + Math.cos(t) * 10, y: y - 11 + Math.sin(t) * 10 }], 0.1, 6),
      ),
      // sound rising from the chimney
      ...[0, 1, 2].map((k) =>
        sketch(Array.from({ length: 7 }, (_, i) => ({ x: x + 12 + Math.sin(i * 1.1 + k) * 3, y: top - 26 - k * 3 - i * 3 })), 0.2, 4),
      ),
      // a window
      sketch([{ x: x - 2, y: top + 6 }, { x: x - 2, y: top + 12 }, { x: x + 4, y: top + 12 }, { x: x + 4, y: top + 6 }, { x: x - 2, y: top + 6 }], 0.2, 3),
    );
  };

  // A record sleeve standing in the sand (Linernotes): the record sliding out
  // of the top, and lines of notes written on the sleeve.
  const record = ({ x, y }: Pt) => {
    const w = 23;
    const tilt = 5; // leans back a little
    const top = y - 2 * w;
    const sleeve = [
      { x: x - w, y },
      { x: x - w + tilt, y: top },
      { x: x + w + tilt, y: top },
      { x: x + w, y },
    ];
    // the record, peeking out above the sleeve
    const disc = { x: x + 6 + tilt, y: top - 2 };
    outline.push(
      sketch(arc(disc.x, disc.y, w - 3, w - 3, Math.PI * 1.02, Math.PI * 1.98, 14), 0.3, 4),
      sketch([...sleeve, sleeve[0]], 0.4, 5),
    );
    detail.push(
      sketch(arc(disc.x, disc.y, 7, 7, Math.PI * 1.05, Math.PI * 1.95, 8), 0.2, 3),
      sketch(arc(disc.x, disc.y, w - 9, w - 9, Math.PI * 1.15, Math.PI * 1.6, 8), 0.2, 4),
      // liner notes: a heading and lines of text
      sketch([{ x: x - w + 9, y: top + 9 }, { x: x - 2, y: top + 9 }], 0.3, 6),
      ...[17, 23, 29, 35].map((dy, i) =>
        sketch([{ x: x - w + 8 + (tilt * (2 * w - dy)) / (2 * w), y: top + dy }, { x: x + w - 6 - (i % 2) * 9, y: top + dy }], 0.3, 6),
      ),
    );
  };

  const toys = { house, record };
  const spots: Pt[] = [];
  items.forEach((it, k) => {
    const slot = sandboxSlots[k];
    if (!slot || !it.toy) return;
    toys[it.toy](slot);
    spots.push(slot);
  });
  // sand piled round each toy's base
  spots.forEach(({ x, y }) => detail.push(sketch(arc(x, y + 1, TOY_W + 4, 5, Math.PI * 0.08, Math.PI * 0.92, 10), 0.4, 5)));
  const nearToy = (p: Pt) => spots.some((t) => Math.abs(p.x - t.x) < TOY_W + 6 && p.y > t.y - 52 && p.y < t.y + 6);

  // ---------------------------------------------------------------- sand
  // ripples raked across it, broken around the node
  for (const v of [0.18, 0.45, 0.72, 0.9]) {
    const pts = Array.from({ length: 21 }, (_, i) => {
      const u = -0.84 + (i / 20) * 1.68;
      const p = at(u, v, PLANK);
      return { x: p.x, y: p.y + Math.sin(u * 9 + v * 5) * 2 };
    });
    let run: Pt[] = [];
    pts.forEach((p) => {
      const free = Math.hypot(p.x, p.y) > CLEAR + 6 && !nearToy(p);
      if (free) run.push(p);
      if ((!free || p === pts[pts.length - 1]) && run.length > 2) {
        detail.push(sketch(run, 0.4, 7));
        run = [];
      } else if (!free) run = [];
    });
  }
  // grains: denser toward the front and the edges, thinning out by the node
  for (let k = 0; k < 320; k++) {
    const v = Math.sqrt(rand());
    const u = Math.sign(rand() - 0.5) * Math.sqrt(rand());
    const p = at(u, v, PLANK + 2);
    const d = Math.hypot(p.x, p.y);
    if (d < CLEAR || (d < CLEAR + 30 && rand() < 0.7) || nearToy(p)) continue;
    dots.push(dot(p));
  }

  const body = `${poly([outer[0], outer[1], outer[2], down(outer[2]), down(outer[3]), outer[3]])}Z`;
  return { body, outline: outline.join(''), detail: detail.join(''), dots: dots.join('') };
}
