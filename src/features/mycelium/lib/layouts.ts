// The two homepage drawings: a wide one, and a tall one for phones (CSS shows
// one). Each says where the four nodes sit, how far their roots reach, and
// where DeCamp's US map goes.
import { pillars } from '@shared/content/catalog';
import { grow, type Network } from './grow';

export interface Drawing {
  id: 'wide' | 'tall';
  net: Network;
  /** radius of the opening ring the discs start in */
  ring: number;
}

export const drawings: Drawing[] = [
  {
    id: 'wide',
    net: grow(pillars, {
      w: 1000,
      h: 620,
      at: [
        { x: 250, y: 185 },
        { x: 655, y: 150 },
        { x: 280, y: 450 },
        { x: 735, y: 460 },
      ],
      reach: [150, 205],
      seed: 7,
      nodeR: 42,
      // top-right quarter; the DeCamp node sits out west, so its roots cross the country
      maps: { decamp: { x: 500, y: 12, s: 0.5 } },
    }),
    ring: 120,
  },
  {
    id: 'tall',
    net: grow(pillars, {
      w: 600,
      h: 1180,
      at: [
        { x: 200, y: 200 },
        { x: 295, y: 472 },
        { x: 200, y: 760 },
        { x: 400, y: 1010 },
      ],
      reach: [115, 150],
      seed: 11,
      nodeR: 52,
      charW: 13.2,
      labels: 'stack',
      maps: { decamp: { x: 20, y: 300, s: 0.574 } },
    }),
    ring: 130,
  },
];

// The way in: the four discs start overlapped in a ring around the middle,
// then break out to their places. For node i: how far to shift it from its
// spot, and how much bigger it starts.
const RING = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
export const startInRing = (net: Network, i: number, r: number) => {
  const n = net.nodes[i];
  return {
    dx: Math.round(net.w / 2 + RING[i][0] * r - n.x),
    dy: Math.round(net.h / 2 + RING[i][1] * r - n.y),
    k: Math.round((r / net.nodeR) * 100) / 100,
  };
};
