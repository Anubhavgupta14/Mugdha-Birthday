// Small browser-only helpers shared by the gift scenes. Call these from effects, never during render.

import confetti from "canvas-confetti";

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A confetti cannon on its own full-screen canvas (above the gift overlay, below Mito). */
export function createConfetti(zIndex = 35) {
  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: String(zIndex),
  });
  document.body.appendChild(canvas);
  const fire = confetti.create(canvas, { resize: true, useWorker: false });
  return {
    fire,
    destroy() {
      fire.reset();
      canvas.remove();
    },
  };
}

export type Cannon = ReturnType<typeof createConfetti>;

/** Keeps a canvas sized to its parent at the device pixel ratio. Returns a cleanup function. */
export function fitCanvas(canvas: HTMLCanvasElement, onResize: (w: number, h: number, dpr: number) => void) {
  const parent = canvas.parentElement ?? canvas;
  const apply = () => {
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    onResize(w, h, dpr);
  };
  apply();
  const ro = new ResizeObserver(apply);
  ro.observe(parent);
  return () => ro.disconnect();
}

/** A rAF loop that idles while the element is off-screen. frame(t, dt) gets seconds. */
export function runLoop(el: Element, frame: (t: number, dt: number) => void) {
  let raf = 0;
  let last = performance.now();
  let t = 0;
  let visible = true;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    t += dt;
    frame(t, dt);
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
  });
  io.observe(el);
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
  };
}

/** Deterministic pseudo-random numbers, so render output is stable. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
