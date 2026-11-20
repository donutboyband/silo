// The homepage drawing's behaviour (markup: Mycelium.astro, MyceliumNet.astro).
// Clicking a node grows its colony and brings it into focus: the view zooms to
// it and the silo's page opens beside it. Clicking the node again, Back or
// Escape zooms out.
import { EASE, circle, onActivate, reduceMotion as reduce } from './reveal';

export function initMycelium(root: HTMLElement) {
  const phone = matchMedia('(max-width: 640px)');
  const nets = [...root.querySelectorAll<SVGSVGElement>('.net')];
  const shownNet = () => nets.find((n) => n.checkVisibility()) ?? nets[0];
  let current = ''; // the silo in focus, if any

  // ---------- the way in ----------
  // A first visit (this session) starts with the four discs overlapped in a
  // ring; the inline script in Mycelium.astro decides that before first paint
  // by adding .intro. Entering breaks them out to their places, then names,
  // rings and the web come in.
  const drawWeb = (lag = 0) => {
    if (reduce.matches) return;
    shownNet()
      .querySelectorAll<SVGPathElement>('.web path')
      .forEach((p, i) => {
        p.animate(
          { strokeDashoffset: [1.5, 0] },
          { duration: 1800 + (i % 7) * 260, delay: lag + (i % 11) * 90, easing: 'cubic-bezier(0.3, 0.6, 0.3, 1)', fill: 'backwards' },
        );
      });
  };

  const enterBtn = root.querySelector<HTMLButtonElement>('.enter')!;
  if (root.classList.contains('intro')) {
    const bodies = [...root.querySelectorAll<SVGGElement>('.node-body')];
    const ringed = (b: SVGGElement) => `translate(${b.dataset.dx}px, ${b.dataset.dy}px) scale(${b.dataset.k})`;
    const breakOut = bodies.map((b, i) =>
      b.animate([{ transform: ringed(b) }, { transform: 'none' }], {
        duration: 1150,
        delay: (i % 4) * 70,
        easing: EASE,
        fill: 'backwards',
      }),
    );
    breakOut.forEach((a) => a.pause()); // hold the ring until entered
    root.classList.add('primed');

    enterBtn.addEventListener('click', () => {
      enterBtn.remove();
      root.classList.remove('intro');
      try {
        sessionStorage.setItem('silo-entered', '1');
      } catch {}
      breakOut.forEach((a) => a.play());
      Promise.all(breakOut.map((a) => a.finished)).then(() => root.classList.remove('mixing'));
      drawWeb(700);
    });
  } else {
    enterBtn.remove();
    drawWeb();
  }

  // ---------- colonies ----------
  // Grow or fold a node's colony. Both drawings (wide and tall) stay in step;
  // only the one on screen animates.
  function setColony(key: string, open: boolean) {
    root.querySelectorAll<SVGGElement>(`.colony[data-node="${key}"]`).forEach((col) => {
      col.classList.toggle('open', open);
      col.querySelector('.node')!.setAttribute('aria-expanded', String(open));
      if (reduce.matches || !col.ownerSVGElement!.checkVisibility()) return;
      // a map (DeCamp) outlines itself first, then the roots grow across it.
      // stroke-dashoffset set on the <use> is inherited by the outline inside.
      col.querySelectorAll<SVGUseElement>('.usmap').forEach((m) => {
        m.animate({ strokeDashoffset: open ? [1.5, 0] : [0, 1.5] }, open ? { duration: 900, easing: 'ease-out' } : { duration: 350 });
        m.animate({ opacity: open ? [0, 1] : [1, 0] }, open ? { duration: 500 } : { duration: 350 });
      });
      col.querySelectorAll<SVGPathElement>('.hyphae path').forEach((p) => {
        p.animate(
          { strokeDashoffset: open ? [1.5, 0] : [0, 1.5] },
          open
            ? { duration: Number(p.dataset.dur), delay: Number(p.dataset.delay), easing: 'cubic-bezier(0.25, 0.6, 0.3, 1)', fill: 'backwards' }
            : { duration: 380, easing: 'ease-in' },
        );
      });
      col.querySelectorAll<SVGGElement>('.tip').forEach((t) => {
        t.animate(
          { opacity: open ? [0, 1] : [1, 0] },
          open ? { duration: 300, delay: Number(t.dataset.delay), fill: 'backwards' } : { duration: 200 },
        );
      });
    });
  }

  // ---------- zoom ----------
  const fullBox = new Map(nets.map((svg) => [svg, svg.getAttribute('viewBox')!.split(' ').map(Number)]));
  const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // The viewBox is an attribute, so it's eased frame by frame (no inline styles).
  function tweenBox(svg: SVGSVGElement, to: number[], dur = 900) {
    const from = svg.getAttribute('viewBox')!.split(' ').map(Number);
    if (reduce.matches) return svg.setAttribute('viewBox', to.join(' '));
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = easeInOut(t);
      svg.setAttribute('viewBox', from.map((v, i) => (v + (to[i] - v) * e).toFixed(2)).join(' '));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Fade everything but the chosen colony (or bring it all back).
  function fadeOthers(svg: SVGSVGElement, key: string | null) {
    svg.querySelectorAll<SVGGElement>('.web, .colony').forEach((g) => {
      const dim = key !== null && !(g.classList.contains('colony') && g.dataset.node === key);
      g.getAnimations().forEach((a) => a.cancel());
      if (dim) g.animate({ opacity: [1, 0.07] }, { duration: reduce.matches ? 0 : 600, fill: 'forwards' });
      g.classList.toggle('dimmed', dim);
    });
  }

  // ---------- fit ----------
  // Shrink a page's type and spacing until it fits beside the drawing with no
  // scrolling (never below 60% size). Phones scroll instead. Not everything
  // scales, so the height ratio is the most --fit can be; start there and
  // step down. (--fit is set through the CSSOM, which the CSP allows.)
  function fit(panel: HTMLElement) {
    panel.style.removeProperty('--fit');
    if (phone.matches || panel.scrollHeight <= panel.clientHeight + 1) return;
    let k = Math.ceil((panel.clientHeight / panel.scrollHeight) * 25) / 25;
    for (;;) {
      panel.style.setProperty('--fit', String(k));
      if (panel.scrollHeight <= panel.clientHeight + 1 || k <= 0.6) return;
      k = Math.max(0.6, Math.round((k - 0.04) * 100) / 100);
    }
  }
  let refit = 0;
  addEventListener('resize', () => {
    cancelAnimationFrame(refit);
    refit = requestAnimationFrame(() => {
      if (current) fit(root.querySelector<HTMLElement>(`#focus-${current}`)!);
    });
  });

  // ---------- focus ----------
  function focusOn(key: string, project?: string) {
    const svg = shownNet();
    const panel = root.querySelector<HTMLElement>(`#focus-${key}`)!;
    const switching = current !== key;
    if (current && switching) setColony(current, false);
    current = key;
    root.classList.add('focused');
    root.querySelectorAll<HTMLElement>('.focus').forEach((f) => (f.hidden = f !== panel));
    fit(panel);
    if (!root.querySelector(`.colony[data-node="${key}"].open`)) setColony(key, true);
    fadeOthers(svg, key);

    // Zoom so the colony fills the part of the drawing the page doesn't cover.
    const [, , W0, H0] = fullBox.get(svg)!;
    const ratio = W0 / H0;
    const box = svg.querySelector<SVGGElement>(`.colony[data-node="${key}"]`)!.getBBox();
    const r = svg.getBoundingClientRect();
    const share = phone.matches ? 1 : Math.min(1, Math.max(0.3, (panel.getBoundingClientRect().left - r.left) / r.width));
    const pad = 28;
    const vw = Math.max((box.width + 2 * pad) / share, (box.height + 2 * pad) * ratio, W0 * 0.42);
    const vh = vw / ratio;
    tweenBox(svg, [box.x + box.width / 2 - (vw * share) / 2, box.y + box.height / 2 - vh / 2, vw, vh]);

    // The page grows out of the node as a circle, like the About panel.
    if (switching && !reduce.matches) {
      const node = svg.querySelector(`.colony[data-node="${key}"] .node`)!.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();
      const x = node.left + node.width / 2 - pr.left;
      const y = node.top + node.height / 2 - pr.top;
      panel.animate(
        { clipPath: [circle(0, x, y), circle(Math.hypot(pr.width, pr.height) * 1.2, x, y)] },
        { duration: 800, delay: 150, easing: EASE, fill: 'backwards' },
      );
    }

    if (project) {
      const row = [...panel.querySelectorAll<HTMLElement>('.item')].find((it) =>
        it.querySelector('.item-name')?.textContent?.trim().startsWith(project),
      );
      if (row) {
        row.classList.remove('flash');
        void row.offsetWidth;
        row.classList.add('flash');
        row.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'nearest' });
      }
    }
    if (phone.matches) {
      setTimeout(() => panel.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' }), reduce.matches ? 0 : 1000);
    }
  }

  function unfocus() {
    const key = current;
    if (!key) return;
    current = '';
    const svg = shownNet();
    const panel = root.querySelector<HTMLElement>(`#focus-${key}`)!;
    root.classList.remove('focused');
    setColony(key, false);
    fadeOthers(svg, null);
    tweenBox(svg, fullBox.get(svg)!);
    nets.filter((n) => n !== svg).forEach((n) => n.setAttribute('viewBox', fullBox.get(n)!.join(' ')));
    const hide = () => (panel.hidden = true);
    if (reduce.matches) hide();
    else panel.animate({ opacity: [1, 0] }, { duration: 250 }).finished.then(hide);
    svg.querySelector<SVGGElement>(`.colony[data-node="${key}"] .node`)?.focus({ preventScroll: true });
  }

  // ---------- input ----------
  root.querySelectorAll<SVGGElement>('.node').forEach((node) => {
    const key = node.closest<SVGGElement>('.colony')!.dataset.node!;
    // in focus: click to back out; otherwise: grow it and bring it into focus
    onActivate(node, () => (current === key ? unfocus() : focusOn(key)));
  });
  root.querySelectorAll<SVGGElement>('.tip').forEach((tip) => {
    const col = tip.closest<SVGGElement>('.colony')!;
    onActivate(tip, () => focusOn(col.dataset.node!, tip.dataset.name!));
  });
  root.querySelectorAll<HTMLElement>('[data-focus-back]').forEach((b) => b.addEventListener('click', unfocus));
  // Escape belongs to the About panel while it's open (its <dialog> handles it).
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current && !document.querySelector('dialog[open]')) unfocus();
  });
}
