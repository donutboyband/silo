// Every URL on the site, in one place. Pages are built as folders
// (/recording/index.html), and Cloudflare serves them with a trailing slash,
// so links use that form.
import { label, pillars, type Pillar, type PillarKey } from './catalog';

export const routes = {
  home: '/',
  /** a silo in focus on the homepage drawing */
  silo: (key: PillarKey) => `/${key}/`,
  decampOneSheet: '/decamp/one-sheet/',
};

/** The page title for the homepage, or for a silo in focus. */
export const titleFor = (p?: Pillar) => (p ? `${p.name} · ${label.name}` : label.name);

/** Which silo a path is, if any ("/decamp/" -> decamp). */
export const siloAt = (path: string) => pillars.find((p) => routes.silo(p.key) === path || `/${p.key}` === path);
