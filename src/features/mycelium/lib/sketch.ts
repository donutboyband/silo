// Hand-drawn lines for the lo-fi backdrops (the silo, the sandbox): each line
// is broken into short steps that wander a little. Seeded, so a drawing comes
// out the same on every build.
import { rng, poly, type Pt } from './grow';

export function sketcher(seed: number) {
  const rand = rng(seed);

  /** A wobbly line through pts. */
  const sketch = (pts: Pt[], wobble = 0.9, step = 6) => {
    const out: Pt[] = [];
    pts.forEach((p, i) => {
      if (i === 0) return out.push(p);
      const a = pts[i - 1];
      const n = Math.max(1, Math.round(Math.hypot(p.x - a.x, p.y - a.y) / step));
      for (let s = 1; s <= n; s++) {
        const t = s / n;
        const end = s === n;
        out.push({
          x: a.x + (p.x - a.x) * t + (end ? 0 : (rand() - 0.5) * 2 * wobble),
          y: a.y + (p.y - a.y) * t + (end ? 0 : (rand() - 0.5) * 2 * wobble),
        });
      }
    });
    return poly(out);
  };

  /** Points around an ellipse (centre, radii), from angle a0 to a1. */
  const arc = (cx: number, cy: number, rx: number, ry: number, a0 = 0, a1 = Math.PI * 2, n = 16): Pt[] =>
    Array.from({ length: n + 1 }, (_, i) => {
      const t = a0 + ((a1 - a0) * i) / n;
      return { x: cx + rx * Math.cos(t), y: cy + ry * Math.sin(t) };
    });

  return { rand, sketch, arc };
}

/** One backdrop drawing, as Mycelium.astro renders it. */
export interface Art {
  /** a faint fill, so the shape reads */
  body: string;
  /** draws itself in when the node opens */
  outline: string;
  /** fainter lines that fade in with it */
  detail: string;
  /** dots (sand and the like), drawn as round caps */
  dots?: string;
}
