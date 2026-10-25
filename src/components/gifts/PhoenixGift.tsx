import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { say } from "@/game/mito";
import { SONGS } from "@/game/content";
import SongCard from "@/components/SongCard";
import GiftReveal from "./GiftReveal";
import { fitCanvas, prefersReducedMotion, runLoop } from "./fx";
import type { GiftProps } from "./types";

gsap.registerPlugin(useGSAP);

export default function PhoenixGift({ onContinue }: GiftProps) {
  return (
    <GiftReveal level={1} title="The Phoenix" accent="#ff6b3d" onContinue={onContinue}>
      <PhoenixScene />
    </GiftReveal>
  );
}

function PhoenixScene() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(
      () => say("Fun fact: phoenixes are the original intermittent fasters. 500 years, then one big meal of fire. 🔥", "laugh"),
      1200,
    );
    return () => clearTimeout(t);
  }, []);

  useGSAP(
    () => {
      gsap.from(".px-line", { opacity: 0, y: 18, duration: 0.8, stagger: 0.22, delay: 1.1, ease: "power3.out" });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      <PhoenixArt />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5 text-[1.05rem] leading-relaxed sm:text-lg">
        <p className="px-line font-hand text-3xl text-gold-soft">Dear Mugdha,</p>
        <p className="px-line text-cream/90">
          In 2017 the fire came: <span className="text-ember">pre-diabetes, Hashimoto&apos;s, depression.</span> Most people would have run. You went
          looking for the root cause instead.
        </p>
        <p className="px-line text-cream/90">
          And you rose. <strong className="font-display text-xl text-gold">37 kg lighter. A thousand times brighter.</strong>
        </p>
        <p className="px-line text-cream/90">
          Then you did the bravest thing of all: you walked <em>back</em> into the fire to pull out <strong className="text-gold">3,000+</strong>{" "}
          others. That&apos;s what a phoenix does.
        </p>
        <p className="px-line font-display text-xl leading-snug text-cream sm:text-2xl">
          Happy Birthday, Mugdha. May every fire this year turn into <span className="text-shine font-semibold">fuel</span>.
        </p>
        <div className="px-line glass flex items-center gap-3 rounded-2xl px-4 py-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[radial-gradient(circle,#ff8a1f_0%,#7a0f1f_100%)] text-2xl shadow-[0_0_24px_rgba(255,107,61,0.6)]">
            🪶
          </span>
          <div className="min-w-0 text-sm leading-snug">
            <div className="text-[0.68rem] font-semibold tracking-[0.18em] text-ember uppercase">Added to inventory</div>
            <span className="text-cream">+1 Phoenix Feather</span> <span className="text-muted">(non-transferable, highly anti-inflammatory)</span>
          </div>
        </div>
        <div className="px-line">
          <SongCard song={SONGS.phoenix} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Phoenix art: SVG bird over a canvas fire ---------- */

const VB_W = 400;
const VB_H = 500;
const CX = 200;
const CY = 215;
const f1 = (n: number) => n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;

/** A flame-shaped feather in local space: base at the origin, pointing along +x. */
function featherPath(len: number, w: number, curl: number) {
  return (
    `M0 ${f1(-w * 0.22)} C${f1(len * 0.26)} ${f1(-w * 1.05)} ${f1(len * 0.66)} ${f1(-w * 0.85 + curl * 0.6)} ${f1(len)} ${f1(curl)} ` +
    `C${f1(len * 0.74)} ${f1(w * 0.18 + curl * 0.55)} ${f1(len * 0.36)} ${f1(w * 0.9)} 0 ${f1(w * 0.22)}Z`
  );
}

const ARM: [number, number][] = [
  [0, 0],
  [34, -22],
  [76, -56],
  [102, -92],
];
function armPoint(s: number): [number, number] {
  const seg = Math.min(ARM.length - 2, Math.floor(s * (ARM.length - 1)));
  const u = s * (ARM.length - 1) - seg;
  const [a, b] = [ARM[seg], ARM[seg + 1]];
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
}

type Feather = { x: number; y: number; a: number; d: string; tip: [number, number]; len: number };
function row(n: number, s0: number, s1: number, a0: number, a1: number, len: (s: number) => number, w: (s: number) => number): Feather[] {
  return Array.from({ length: n }, (_, i) => {
    const u = n === 1 ? 0 : i / (n - 1);
    const s = s0 + (s1 - s0) * u;
    const [x, y] = armPoint(s);
    const a = a0 + (a1 - a0) * u;
    const L = len(u);
    const curl = -6 - 16 * u;
    const tip: [number, number] = [x + Math.cos(rad(a)) * L - Math.sin(rad(a)) * curl, y + Math.sin(rad(a)) * L + Math.cos(rad(a)) * curl];
    return { x, y, a, d: featherPath(L, w(u), curl), tip, len: L };
  });
}

const PRIMARIES = row(
  12,
  0.04,
  1,
  64,
  -64,
  (u) => (72 + 92 * Math.pow(u, 0.85)) * (u > 0.95 ? 0.9 : 1),
  (u) => 13 + 6 * u,
);
const SECONDARIES = row(
  10,
  0.04,
  0.94,
  56,
  -52,
  (u) => 50 + 62 * Math.pow(u, 0.85),
  (u) => 12 + 4 * u,
);
const COVERTS = row(
  9,
  0.02,
  0.84,
  46,
  -40,
  (u) => 30 + 30 * u,
  (u) => 10 + 3 * u,
);
const MARGINALS = row(
  8,
  0,
  0.9,
  28,
  -30,
  (u) => 18 + 10 * u,
  () => 8,
);
const WISPS = PRIMARIES.slice(6);

const CREST = [
  { a: -112, len: 40, w: 7 },
  { a: -132, len: 58, w: 8 },
  { a: -150, len: 66, w: 8 },
  { a: -166, len: 50, w: 7 },
].map((c) => ({ ...c, d: featherPath(c.len, c.w, -10) }));

const SCALLOPS = (() => {
  let d = "";
  for (let r = 0; r < 7; r++) {
    const y = 168 + r * 15;
    for (let k = -3; k <= 3; k++) {
      const x = CX + k * 11 + (r % 2) * 5.5;
      d += `M${f1(x - 6)} ${f1(y)} Q${f1(x)} ${f1(y + 9)} ${f1(x + 6)} ${f1(y)} `;
    }
  }
  return d;
})();

const TAILS = [
  { a: 54, len: 150, ph: 0.0 },
  { a: 66, len: 190, ph: 0.9 },
  { a: 78, len: 215, ph: 1.7 },
  { a: 102, len: 215, ph: 2.4 },
  { a: 114, len: 190, ph: 3.1 },
  { a: 126, len: 150, ph: 3.9 },
  { a: 90, len: 235, ph: 1.2 },
];
const TAIL_ORIGIN: [number, number] = [CX, 276];
const TAIL_K = 30;
const EYE_S = 0.84;

function WingFeathers() {
  return (
    <>
      {PRIMARIES.map((f, i) => (
        <path key={`p${i}`} d={f.d} transform={`translate(${f1(f.x)} ${f1(f.y)}) rotate(${f1(f.a)})`} fill="url(#px-primary)" />
      ))}
      {WISPS.map((f, i) => (
        <path
          key={`w${i}`}
          className="px-wisp"
          d={featherPath(34, 5, -8)}
          transform={`translate(${f1(f.tip[0])} ${f1(f.tip[1])}) rotate(${f1(f.a - 8)})`}
          fill="url(#px-wisp)"
        />
      ))}
      {SECONDARIES.map((f, i) => (
        <path key={`s${i}`} d={f.d} transform={`translate(${f1(f.x)} ${f1(f.y)}) rotate(${f1(f.a)})`} fill="url(#px-secondary)" />
      ))}
      {SECONDARIES.map((f, i) => (
        <path
          key={`r${i}`}
          d={`M0 0 Q${f1(f.len * 0.5)} -4 ${f1(f.len * 0.9)} -10`}
          transform={`translate(${f1(f.x)} ${f1(f.y)}) rotate(${f1(f.a)})`}
          stroke="#fff1b8"
          strokeOpacity="0.35"
          strokeWidth="0.8"
          fill="none"
        />
      ))}
      {COVERTS.map((f, i) => (
        <path key={`c${i}`} d={f.d} transform={`translate(${f1(f.x)} ${f1(f.y)}) rotate(${f1(f.a)})`} fill="url(#px-covert)" />
      ))}
      {MARGINALS.map((f, i) => (
        <path key={`m${i}`} d={f.d} transform={`translate(${f1(f.x)} ${f1(f.y)}) rotate(${f1(f.a)})`} fill="url(#px-marginal)" />
      ))}
      <path d="M0 0 L34 -22 L76 -56 L102 -92" stroke="url(#px-edge)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  );
}

const FIRE_COLORS = ["#fffbe0", "#fff1a8", "#ffd45c", "#ffb22e", "#ff8a1f", "#ff6418", "#f0421a", "#c82a1c", "#8e1a1e", "#4a0e1c"];

type Particle = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; hue: number; seed: number };

function makeSprite(color: string, size = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, color);
  grd.addColorStop(0.35, color + "aa");
  grd.addColorStop(1, color + "00");
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return c;
}

function PhoenixArt() {
  const wrap = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const cb = back.current;
    const cf = front.current;
    const s = svg.current;
    const heat = glow.current;
    if (!el || !cb || !cf || !s || !heat) return;
    const reduced = prefersReducedMotion();
    const bctx = cb.getContext("2d")!;
    const fctx = cf.getContext("2d")!;
    const sprites = FIRE_COLORS.map((c) => makeSprite(c));
    const emberSprite = makeSprite("#ffd27a", 32);

    let W = 1;
    let H = 1;
    let dpr = 1;
    const stopFit = fitCanvas(cb, (w, h, d) => {
      W = w;
      H = h;
      dpr = d;

      cf.width = cb.width;
      cf.height = cb.height;
    });

    const bird = s.querySelector<SVGGElement>(".px-bird")!;
    const wingR = s.querySelector<SVGGElement>(".px-wing-r")!;
    const wingL = s.querySelector<SVGGElement>(".px-wing-l")!;
    const crest = s.querySelector<SVGGElement>(".px-crest")!;
    const aura = s.querySelector<SVGCircleElement>(".px-aura")!;
    const tails = Array.from(s.querySelectorAll<SVGPathElement>(".px-tail"));
    const eyes = Array.from(s.querySelectorAll<SVGCircleElement>(".px-tail-eye"));
    const wispsR = Array.from(wingR.querySelectorAll<SVGPathElement>(".px-wisp"));
    const wispsL = Array.from(wingL.querySelectorAll<SVGPathElement>(".px-wisp"));

    const state = { rise: 1, heat: 2.4, alpha: 0 };
    const intro = gsap.timeline();
    intro
      .to(state, { alpha: 1, duration: 1.2, ease: "power1.out" }, 0.2)
      .to(state, { rise: 0, duration: 2.8, ease: "power3.out" }, 0.2)
      .to(state, { heat: 1, duration: 3.2, ease: "power2.out" }, 0.4);

    const flames: Particle[] = [];
    const embers: Particle[] = [];
    const MAX_FLAMES = 700;

    // Converts SVG viewBox coordinates to canvas CSS pixels.
    const toPx = (x: number, y: number): [number, number] => [(x / VB_W) * W, (y / VB_H) * H];

    const spawn = (list: Particle[], x: number, y: number, size: number, vy: number, life: number, spread = 0.4, hue = 0) => {
      list.push({
        x,
        y,
        vx: (Math.random() - 0.5) * spread,
        vy: -vy * (0.6 + Math.random() * 0.8),
        age: 0,
        life: life * (0.6 + Math.random() * 0.7),
        size: size * (0.6 + Math.random() * 0.8),
        hue,
        seed: Math.random() * 100,
      });
    };

    const rot = (x: number, y: number, a: number): [number, number] => {
      const c = Math.cos(a);
      const sn = Math.sin(a);
      return [x * c - y * sn, x * sn + y * c];
    };

    const frame = (t: number, dt: number) => {
      const k = dt * 60;
      const speed = reduced ? 0.35 : 1;
      const ph = t * Math.PI * 2 * 0.5 * speed;
      const flap = Math.sin(ph) + 0.22 * Math.sin(2 * ph);
      const bob = Math.cos(ph) * 7 * speed;
      const sc = 0.58 + 0.18 * (1 - state.rise);
      const ty = bob + state.rise * 190;

      // --- SVG animation ---
      bird.setAttribute("transform", `translate(${f1(CX)} ${f1(CY + ty)}) scale(${sc.toFixed(3)}) translate(${-CX} ${-CY})`);
      bird.setAttribute("opacity", state.alpha.toFixed(3));
      const wingA = -10 - 20 * flap;
      const wingS = 1 - 0.07 * flap;
      const wt = `rotate(${f1(wingA)}) scale(${wingS.toFixed(3)} 1)`;
      wingR.setAttribute("transform", wt);
      wingL.setAttribute("transform", wt);
      crest.setAttribute("transform", `rotate(${f1(Math.sin(ph + 1) * 5)} 208 96)`);
      aura.setAttribute("opacity", (0.55 + 0.15 * Math.sin(t * 2.3) + 0.1 * flap).toFixed(3));
      const flick = (w: SVGPathElement[], off: number) =>
        w.forEach((p, i) => {
          const f = WISPS[i];
          const sx = 0.75 + 0.45 * Math.abs(Math.sin(t * (7 + i) + off + i * 1.7));
          p.setAttribute(
            "transform",
            `translate(${f1(f.tip[0])} ${f1(f.tip[1])}) rotate(${f1(f.a - 8 + Math.sin(t * 5 + i) * 6)}) scale(${sx.toFixed(2)} 1)`,
          );
        });
      flick(wispsR, 0);
      flick(wispsL, 2);

      const tailPlumes: [number, number][] = [];
      TAILS.forEach((tl, i) => {
        const a = rad(tl.a + Math.sin(t * 1.1 * speed + tl.ph) * 4);
        const dx = Math.cos(a);
        const dy = Math.sin(a);
        const pts: [number, number][] = [];
        for (let j = 0; j <= TAIL_K; j++) {
          const u = j / TAIL_K;
          const off = 18 * Math.pow(u, 1.3) * Math.sin(t * 2.4 * speed - u * 5 + tl.ph);
          pts.push([TAIL_ORIGIN[0] + dx * tl.len * u - dy * off, TAIL_ORIGIN[1] + dy * tl.len * u + dx * off]);
        }
        let left = "";
        let right = "";
        for (let j = 0; j <= TAIL_K; j++) {
          const u = j / TAIL_K;
          const p = pts[j];
          const q = pts[Math.min(TAIL_K, j + 1)];
          const r = pts[Math.max(0, j - 1)];
          let nx = -(q[1] - r[1]);
          let ny = q[0] - r[0];
          const nl = Math.hypot(nx, ny) || 1;
          nx /= nl;
          ny /= nl;
          const w = 5 * (1 - u) + 0.8 + 8 * Math.exp(-Math.pow((u - EYE_S) / 0.1, 2)) * (0.85 + 0.15 * Math.sin(t * 3 + i));
          left += `${j ? "L" : "M"}${f1(p[0] + nx * w)} ${f1(p[1] + ny * w)}`;
          right = `L${f1(p[0] - nx * w)} ${f1(p[1] - ny * w)}` + right;
        }
        tails[i].setAttribute("d", left + right + "Z");
        const e = pts[Math.round(EYE_S * TAIL_K)];
        eyes[i].setAttribute("cx", f1(e[0]));
        eyes[i].setAttribute("cy", f1(e[1]));
        tailPlumes.push(pts[TAIL_K]);
      });

      // --- emitters in viewBox space ---
      const toWorld = (x: number, y: number): [number, number] => [CX + sc * (x - CX), CY + sc * (y - CY) + ty];
      const emit: [number, number][] = [];
      const wa = rad(wingA);
      [PRIMARIES[11], PRIMARIES[9], PRIMARIES[7]].forEach((f) => {
        const [rx, ry] = rot(f.tip[0] * wingS, f.tip[1], wa);
        emit.push(toWorld(212 + rx, 200 + ry), toWorld(188 - rx, 200 + ry));
      });
      tailPlumes.forEach(([x, y]) => emit.push(toWorld(x, y)));

      heat.style.opacity = (Math.min(1, 0.55 * state.heat) * (0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 5.3))).toFixed(3);

      // --- fire (back canvas) ---
      const scale = W / VB_W;
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, W, H);
      bctx.globalCompositeOperation = "lighter";

      const rate = (reduced ? 5 : 13) * state.heat * k;
      for (let n = 0; n < rate && flames.length < MAX_FLAMES; n++) {
        const g = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        spawn(flames, W / 2 + g * W * 0.34, H * (0.86 + Math.random() * 0.04), 30 * scale * (1 - Math.abs(g) * 0.5), 2.3 * scale, 70, 0.4, 1.5);
      }
      if (state.alpha > 0.3) {
        emit.forEach(([x, y]) => {
          if (Math.random() < 0.7 * k && flames.length < MAX_FLAMES) {
            const [px, py] = toPx(x, y);
            spawn(flames, px, py, 14 * scale, 1.3 * scale, 34, 0.6, 2);
          }
        });
      }

      for (let i = flames.length - 1; i >= 0; i--) {
        const p = flames[i];
        p.age += k;
        const u = p.age / p.life;
        if (u >= 1) {
          flames.splice(i, 1);
          continue;
        }
        p.x += (p.vx + Math.sin(p.seed + p.age * 0.08) * 0.35) * k;
        p.y += p.vy * k;
        p.vy *= 1 - 0.004 * k;
        const ci = Math.min(FIRE_COLORS.length - 1, Math.floor(p.hue + u * (FIRE_COLORS.length - 1 - p.hue)));
        const grow = Math.min(1, u * 5);
        const sz = p.size * grow * (1 - u * 0.65);
        bctx.globalAlpha = Math.pow(1 - u, 1.3) * 0.28 * grow;
        bctx.drawImage(sprites[ci], p.x - sz, p.y - sz, sz * 2, sz * 2);
      }
      bctx.globalAlpha = 1;
      bctx.globalCompositeOperation = "source-over";

      // --- embers (front canvas) ---
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.clearRect(0, 0, W, H);
      fctx.globalCompositeOperation = "lighter";
      if (Math.random() < (reduced ? 0.25 : 0.9) * k)
        spawn(embers, W / 2 + (Math.random() - 0.5) * W * 0.6, H * 0.95, 4 * scale + 2, 1.1 * scale, 220, 0.8);
      if (state.alpha > 0.3 && Math.random() < 0.5 * k) {
        const [x, y] = emit[Math.floor(Math.random() * emit.length)];
        const [px, py] = toPx(x, y);
        spawn(embers, px, py, 3 * scale + 2, 0.9 * scale, 160, 1);
      }
      for (let i = embers.length - 1; i >= 0; i--) {
        const p = embers[i];
        p.age += k;
        const u = p.age / p.life;
        if (u >= 1 || p.y < -10) {
          embers.splice(i, 1);
          continue;
        }
        p.x += (p.vx + Math.sin(p.seed + p.age * 0.05) * 0.5) * k;
        p.y += p.vy * k;
        const flicker = 0.6 + 0.4 * Math.sin(p.seed * 3 + p.age * 0.3);
        fctx.globalAlpha = Math.min(1, (1 - u) * 1.4) * flicker;
        const sz = p.size * (1 - u * 0.5);
        fctx.drawImage(emberSprite, p.x - sz, p.y - sz, sz * 2, sz * 2);
      }
      fctx.globalAlpha = 1;
      fctx.globalCompositeOperation = "source-over";
    };

    const stopLoop = runLoop(el, frame);
    return () => {
      stopLoop();
      stopFit();
      intro.kill();
    };
  }, []);

  return (
    <div ref={wrap} className="relative mx-auto aspect-[4/5] w-full max-w-[480px]">
      <div
        ref={glow}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-[radial-gradient(ellipse_60%_55%_at_50%_88%,rgba(255,120,30,0.55),rgba(255,60,20,0.18)_45%,transparent_72%)] opacity-0"
        aria-hidden
      />
      <canvas ref={back} className="absolute inset-0 h-full w-full" aria-hidden />
      <svg
        ref={svg}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        style={{ filter: "drop-shadow(0 0 10px rgba(255,140,40,0.55)) drop-shadow(0 0 28px rgba(255,80,20,0.35))" }}
        role="img"
        aria-label="A phoenix rising from flames"
      >
        <defs>
          <linearGradient id="px-primary" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff9a2a" />
            <stop offset="0.45" stopColor="#e8361e" />
            <stop offset="1" stopColor="#7a0f24" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="px-secondary" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffd166" />
            <stop offset="0.5" stopColor="#ff7b25" />
            <stop offset="1" stopColor="#d4261c" />
          </linearGradient>
          <linearGradient id="px-covert" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff4c4" />
            <stop offset="0.55" stopColor="#ffc93c" />
            <stop offset="1" stopColor="#ff8c1a" />
          </linearGradient>
          <linearGradient id="px-marginal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fffbe8" />
            <stop offset="1" stopColor="#ffb52e" />
          </linearGradient>
          <linearGradient id="px-wisp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffcf4a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="px-edge" x1="0" y1="0" x2="1" y2="-1">
            <stop offset="0" stopColor="#fff1b8" />
            <stop offset="1" stopColor="#ffb52e" />
          </linearGradient>
          <radialGradient id="px-body" cx="50%" cy="38%" r="65%">
            <stop offset="0" stopColor="#fff6d0" />
            <stop offset="0.35" stopColor="#ffc23c" />
            <stop offset="0.75" stopColor="#f0581e" />
            <stop offset="1" stopColor="#a3122a" />
          </radialGradient>
          <radialGradient id="px-head" cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#fffbe6" />
            <stop offset="0.5" stopColor="#ffc93c" />
            <stop offset="1" stopColor="#ff7b25" />
          </radialGradient>
          <linearGradient id="px-tail" x1="0" y1="270" x2="0" y2="490" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffd166" />
            <stop offset="0.35" stopColor="#ff7b25" />
            <stop offset="0.7" stopColor="#e0301e" />
            <stop offset="1" stopColor="#7a0f1f" />
          </linearGradient>
          <radialGradient id="px-eye-spot">
            <stop offset="0" stopColor="#fffbe0" />
            <stop offset="0.35" stopColor="#ffd45c" />
            <stop offset="0.6" stopColor="#c82a1c" />
            <stop offset="0.85" stopColor="#ffb22e" />
            <stop offset="1" stopColor="#ff8a1f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="px-aura">
            <stop offset="0" stopColor="#ffb547" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#ff6b3d" stopOpacity="0.18" />
            <stop offset="1" stopColor="#ff3d1f" stopOpacity="0" />
          </radialGradient>
          <filter id="px-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="px-body-clip">
            <path d="M200 148 C 226 152, 236 192, 230 222 C 224 252, 210 272, 200 290 C 190 272, 176 252, 170 222 C 164 192, 174 152, 200 148 Z" />
          </clipPath>
        </defs>

        <g className="px-bird" opacity="0">
          <circle className="px-aura" cx={CX} cy="200" r="190" fill="url(#px-aura)" />

          {TAILS.map((_, i) => (
            <g key={i}>
              <path className="px-tail" fill="url(#px-tail)" opacity="0.95" />
              <circle className="px-tail-eye" r="5.5" fill="url(#px-eye-spot)" />
            </g>
          ))}

          <g transform="translate(188 200) scale(-1 1)">
            <g className="px-wing-l">
              <WingFeathers />
            </g>
          </g>
          <g transform="translate(212 200)">
            <g className="px-wing-r">
              <WingFeathers />
            </g>
          </g>

          <g className="px-crest">
            {CREST.map((c, i) => (
              <path key={i} d={c.d} transform={`translate(208 98) rotate(${c.a})`} fill={i % 2 ? "url(#px-secondary)" : "url(#px-primary)"} />
            ))}
            {CREST.map((c, i) => (
              <circle
                key={`e${i}`}
                cx={f1(208 + Math.cos(rad(c.a)) * c.len)}
                cy={f1(98 + Math.sin(rad(c.a)) * c.len - 4)}
                r="2.6"
                fill="#fff1a8"
                filter="url(#px-glow)"
              />
            ))}
          </g>

          <path
            d="M200 148 C 226 152, 236 192, 230 222 C 224 252, 210 272, 200 290 C 190 272, 176 252, 170 222 C 164 192, 174 152, 200 148 Z"
            fill="url(#px-body)"
          />
          <path d={SCALLOPS} clipPath="url(#px-body-clip)" stroke="#fff4c4" strokeOpacity="0.45" strokeWidth="1.1" fill="none" />
          <path d="M186 162 C 184 140, 194 120, 206 110 L 224 118 C 216 130, 214 148, 214 166 Z" fill="url(#px-head)" />
          <path d="M226 100 C 239 99, 248 106, 250 116 C 243 111, 236 112, 228 114 Z" fill="#ffe08a" stroke="#b5501a" strokeWidth="1" />
          <path d="M227 112 C 234 113, 239 116, 241 120 C 235 119, 230 118, 226 116 Z" fill="#f2b84b" stroke="#b5501a" strokeWidth="0.8" />
          <ellipse cx="214" cy="106" rx="16" ry="14" fill="url(#px-head)" />
          <path d="M224 104 C 214 99, 204 100, 194 108 C 204 105, 213 107, 222 110 Z" fill="#c82a1c" />
          <circle cx="220" cy="103.5" r="3.6" fill="#fff" filter="url(#px-glow)" />
          <circle cx="220.8" cy="103.5" r="1.6" fill="#7a0f1f" />
          <circle cx="219.6" cy="102.6" r="0.7" fill="#fff" />
        </g>
      </svg>
      <canvas ref={front} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
    </div>
  );
}
