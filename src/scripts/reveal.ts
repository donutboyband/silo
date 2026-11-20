// Motion and input helpers shared by the About panel and the homepage drawing.
// Animations go through the Web Animations API, so the CSP never has to allow
// inline styles.

export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

/** The ease of every circle that grows open or shuts. */
export const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

/** A clip-path circle of radius r centred on (x, y). */
export const circle = (r: number, x: number, y: number) => `circle(${r}px at ${x}px ${y}px)`;

/** Run fn on click, and on Enter or Space (for role="button" SVG groups). */
export function onActivate(el: Element, fn: () => void) {
  el.addEventListener('click', fn);
  el.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    if (k === 'Enter' || k === ' ') {
      e.preventDefault();
      fn();
    }
  });
}
