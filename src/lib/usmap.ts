// The US map, drawn at build time from us-atlas: the outline, the state
// lines, and where a city lands on it. Everything is in the atlas's own
// 975x610 box (Albers USA), so a caller scales and moves it as a whole.
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import { presimplify, simplify } from 'topojson-simplify';
import type { Topology, GeometryCollection } from 'topojson-specification';
import usRaw from 'us-atlas/states-albers-10m.json';

export const MAP_W = 975;
export const MAP_H = 610;

// The atlas is already projected with this projection; cities use it too.
const albers = geoAlbersUsa().scale(1300).translate([487.5, 305]);

/** Outline and state lines, simplified by `detail` (bigger = coarser). */
export function usPaths(detail = 0.6) {
  const us = simplify(presimplify(usRaw as unknown as Topology), detail) as Topology<{
    states: GeometryCollection;
    nation: GeometryCollection;
  }>;
  const draw = geoPath().digits(1);
  return {
    nation: draw(feature(us, us.objects.nation)) ?? '',
    borders: draw(mesh(us, us.objects.states, (a, b) => a !== b)) ?? '',
  };
}

/** Where [latitude, longitude] lands in the 975x610 box. */
export function placeOnMap([lat, lon]: [number, number]) {
  const [x, y] = albers([lon, lat]) ?? [0, 0];
  return { x, y };
}
