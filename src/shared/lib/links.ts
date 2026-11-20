// Small helpers for markup shared across components.

/** Attributes for a link: off-site links open in a new tab. Spread onto <a>. */
export const linkAttrs = (url?: string) =>
  url?.startsWith('http') ? { href: url, target: '_blank', rel: 'noopener' } : { href: url };

/** 1 -> "01", for the #01-style numbers. */
export const pad2 = (n: number) => String(n).padStart(2, '0');
