// A lo-fi farm silo, drawn at build time as wobbly hand-drawn lines: a domed
// cylinder with a vent, bands, a ladder, a door and some shading, standing on
// the ground. It sits behind Silo Recording's node, like DeCamp's US map.
// Drawn around (0, 0), where the node's centre goes; about 260 x 400 units.
import { poly, type Pt } from './grow';
import { sketcher, type Art } from './sketch';

const W = 70; // half the cylinder's width
const TOP = -110; // where the walls meet the dome
const BOTTOM = 190; // the ground
const DOME = 70; // the dome's height
const VENT = TOP - DOME; // top of the dome

export function siloArt(seed = 3): Art {
  const { sketch } = sketcher(seed);

  const domePts = (shift = 0): Pt[] =>
    Array.from({ length: 13 }, (_, i) => {
      const t = (i / 12) * Math.PI;
      return { x: -W * Math.cos(t), y: TOP - (DOME + shift) * Math.sin(t) };
    });
  const shell = (shift = 0): Pt[] => [{ x: -W, y: BOTTOM }, ...domePts(shift), { x: W, y: BOTTOM }];

  // the outline draws itself in; gone over twice, like a quick pen sketch
  const outline = [
    sketch(shell()),
    sketch(shell(2), 1.4, 9),
    sketch([{ x: -130, y: BOTTOM }, { x: 130, y: BOTTOM + 1 }], 1.2),
    // vent and its little roof
    sketch([{ x: -9, y: VENT + 2 }, { x: -9, y: VENT - 14 }, { x: 9, y: VENT - 14 }, { x: 9, y: VENT + 2 }], 0.6, 5),
    sketch([{ x: -15, y: VENT - 13 }, { x: 0, y: VENT - 25 }, { x: 15, y: VENT - 13 }], 0.6, 5),
    // door
    sketch([{ x: -18, y: BOTTOM }, { x: -18, y: BOTTOM - 46 }, { x: 18, y: BOTTOM - 46 }, { x: 18, y: BOTTOM }], 0.7),
  ].join('');

  // the rest just fades in with it, fainter
  const detail: string[] = [];
  // bands around the cylinder, bowed a little so it reads as round
  for (let y = TOP + 28; y < BOTTOM - 54; y += 34) {
    const pts = Array.from({ length: 9 }, (_, i) => {
      const x = -W + (i / 8) * 2 * W;
      return { x, y: y + 5 * (1 - (x / W) ** 2) };
    });
    detail.push(sketch(pts, 0.7, 8));
  }
  // ribs on the dome
  for (const k of [-0.55, 0.55]) {
    detail.push(sketch(Array.from({ length: 6 }, (_, i) => {
      const t = i / 5;
      return { x: k * W * Math.sin((t * Math.PI) / 2), y: VENT + (TOP - VENT) * t };
    }), 0.6, 6));
  }
  // ladder up the right side
  const rails = [W - 24, W - 12];
  rails.forEach((x) => detail.push(sketch([{ x, y: TOP - 4 }, { x, y: BOTTOM }], 0.6, 10)));
  for (let y = TOP + 6; y < BOTTOM; y += 13) detail.push(sketch([{ x: rails[0], y }, { x: rails[1], y }], 0.4, 12));
  // shading down the left side
  for (let y = TOP + 12; y < BOTTOM - 6; y += 10) {
    detail.push(sketch([{ x: -W + 3, y }, { x: -W + 20, y: y - 12 }], 0.5, 20));
  }
  // grass along the ground
  for (const x of [-118, -96, -44, 52, 90, 116]) {
    detail.push(sketch([{ x: x - 4, y: BOTTOM - 7 }, { x, y: BOTTOM }, { x: x + 3, y: BOTTOM - 9 }], 0.4, 10));
  }

  // a faint fill for the body, so the silo reads as a shape
  const body = `${poly(shell())}Z`;

  return { body, outline, detail: detail.join('') };
}
