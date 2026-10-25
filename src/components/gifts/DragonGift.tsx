import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { say } from "@/game/mito";
import { sound } from "@/game/audio";
import { SONGS } from "@/game/content";
import SongCard from "@/components/SongCard";
import GiftReveal from "./GiftReveal";
import { fitCanvas, prefersReducedMotion, runLoop, seeded } from "./fx";
import type { GiftProps } from "./types";

gsap.registerPlugin(useGSAP);

export default function DragonGift({ onContinue }: GiftProps) {
  return (
    <GiftReveal level={2} title="The Dragons" accent="#2bd99f" onContinue={onContinue}>
      <DragonScene />
    </GiftReveal>
  );
}

const TITLES = [
  "Mother of Dragons",
  "Breaker of Sugar Chains",
  "Slayer of Inflammation",
  "Protector of the Gut",
  "Queen of the Root Cause",
  "Khaleesi of the Thrive Tribe",
];

function DragonScene() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => say("Careful with these two. Dragons get hangry… luckily they're fat-adapted. 🐉", "laugh"), 1400);
    return () => clearTimeout(t);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.7 });
      tl.call(() => sound.play("whoosh"))
        .fromTo(".dg-paper", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power2.inOut" })
        .from(
          ".dg-rod-bottom",
          { y: () => -(document.querySelector<HTMLElement>(".dg-paper")?.offsetHeight ?? 0), duration: 1.1, ease: "power2.inOut" },
          "<",
        )
        .from(".dg-line", { opacity: 0, y: 12, filter: "blur(6px)", duration: 0.7, stagger: 0.24, ease: "power2.out" }, "-=0.3")
        .call(() => sound.play("chime"))
        .from(".dg-msg", { opacity: 0, y: 18, duration: 0.8, stagger: 0.2, ease: "power3.out" }, "-=0.2");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
      <div className="lg:sticky lg:top-8">
        <DragonArt />
        <div className="mt-3 flex justify-center gap-5 text-sm text-muted">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[radial-gradient(circle,#fff1b0,#f7b518_60%,#8a5a00)] shadow-[0_0_10px_#f7b518]" />
            Courage
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[radial-gradient(circle,#c9ffe9,#2bd99f_60%,#0b5e45)] shadow-[0_0_10px_#2bd99f]" />
            Clarity
          </span>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <TitleScroll />
        <div className="flex flex-col gap-4 text-[1.05rem] leading-relaxed sm:text-lg">
          <p className="dg-msg font-display text-2xl leading-snug text-cream">Dragons don&apos;t ask permission to fly.</p>
          <p className="dg-msg text-cream/90">
            And neither did you. You built iThrive riding two of them: <strong className="text-gold">Courage</strong>, who said yes to four clients
            and one very big dream, and <strong className="text-emerald">Clarity</strong>, who kept asking{" "}
            <em>&ldquo;but what&apos;s the root cause?&rdquo;</em> until the whole world started listening.
          </p>
          <p className="dg-msg text-cream/90">Here&apos;s to another year of flying higher than anyone thought possible.</p>
          <p className="dg-msg glass rounded-2xl px-4 py-3 text-sm text-muted">
            <span className="mr-1">🥩</span> <span className="text-cream">Dragon diet:</span> strictly grass-fed, zero seed oils. Fire-roasted only,
            obviously.
          </p>
          <div className="dg-msg">
            <p className="mb-2 font-hand text-2xl text-emerald">You imagined dragons. Then you built them.</p>
            <SongCard song={SONGS.dragons} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TitleScroll() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <ScrollRod />
      <div className="dg-paper relative mx-3 border-x border-gold/25 bg-[linear-gradient(180deg,rgba(43,217,159,0.10),rgba(29,18,64,0.55)_30%,rgba(29,18,64,0.55)_70%,rgba(247,181,24,0.10))] px-4 py-6 text-center shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] sm:px-6">
        <div className="pointer-events-none absolute inset-2 rounded-sm border border-gold/20" />
        <p className="dg-line font-regal text-[0.68rem] tracking-[0.35em] text-gold/80 uppercase">Hear ye, hear ye</p>
        <p className="dg-line text-shine mt-3 font-regal text-2xl leading-tight font-bold sm:text-3xl">Mugdha Pradhan</p>
        <p className="dg-line mt-1 font-regal text-sm tracking-[0.2em] text-gold-soft uppercase">First of Her Name</p>
        <div className="dg-line mx-auto my-3 h-px w-24 bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
        <ul className="space-y-1.5">
          {TITLES.map((t) => (
            <li key={t} className="dg-line font-regal text-[0.95rem] leading-snug text-cream sm:text-base">
              <span className="mr-2 text-[0.6rem] text-emerald align-middle">✦</span>
              {t}
              <span className="ml-2 text-[0.6rem] text-emerald align-middle">✦</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="dg-rod-bottom">
        <ScrollRod />
      </div>
    </div>
  );
}

function ScrollRod() {
  return (
    <div className="relative h-4 rounded-full bg-[linear-gradient(180deg,#ffe6a0,#c98a00_45%,#6b4a12)] shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
      <span className="absolute top-1/2 -left-1.5 h-6 w-3 -translate-y-1/2 rounded-full bg-[linear-gradient(180deg,#ffe6a0,#8a5a00)]" />
      <span className="absolute top-1/2 -right-1.5 h-6 w-3 -translate-y-1/2 rounded-full bg-[linear-gradient(180deg,#ffe6a0,#8a5a00)]" />
    </div>
  );
}

/* ---------- Dragons: two segmented serpents chasing the flaming pearl ---------- */

type Palette = { base: string; light: string; dark: string; mane: [string, string]; eye: string; horn: string };

const GOLD: Palette = { base: "#f7b518", light: "#fff1b0", dark: "#7a4b00", mane: ["#ff6b3d", "#c8102e"], eye: "#ff4d2e", horn: "#fff7e6" };
const JADE: Palette = { base: "#2bd99f", light: "#c9ffe9", dark: "#06493a", mane: ["#ffd873", "#f7b518"], eye: "#ffd873", horn: "#f6ffe9" };

const N = 58;
const SPACING = 0.0125;
const R_BODY = 0.031;
const LEGS = [8, 27];

type Path = (t: number) => [number, number];
const PATH_GOLD: Path = (t) => [0.3 * Math.sin(0.61 * t) + 0.07 * Math.sin(1.7 * t + 1), 0.24 * Math.sin(0.83 * t + 0.6) + 0.06 * Math.cos(1.31 * t)];
const PATH_JADE: Path = (t) => [
  0.3 * Math.sin(0.61 * t + Math.PI) + 0.07 * Math.sin(1.5 * t),
  0.24 * Math.sin(0.77 * t + 2.4) + 0.06 * Math.sin(1.43 * t + 0.3),
];

function radiusAt(i: number) {
  const s = i / (N - 1);
  if (s < 0.1) return R_BODY * (0.72 + 2.8 * s);
  return R_BODY * Math.max(0.16, 1 - 0.86 * Math.pow((s - 0.1) / 0.9, 1.15));
}

function scaleSprite(p: Palette) {
  const S = 96;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const m = S / 2;
  g.fillStyle = p.dark;
  g.beginPath();
  g.arc(m, m, m, 0, Math.PI * 2);
  g.fill();
  const grd = g.createRadialGradient(m, m, 2, m, m, m - 3);
  grd.addColorStop(0, p.light);
  grd.addColorStop(0.45, p.base);
  grd.addColorStop(1, p.dark);
  g.fillStyle = grd;
  g.beginPath();
  g.arc(m, m, m - 3, 0, Math.PI * 2);
  g.fill();
  // scale crescents facing the tail (-x)
  g.strokeStyle = p.dark;
  g.globalAlpha = 0.45;
  g.lineWidth = 3;
  [-0.45, 0, 0.45].forEach((oy) => {
    g.beginPath();
    g.arc(m + 6, m + oy * m, m * 0.34, Math.PI * 0.55, Math.PI * 1.45);
    g.stroke();
  });
  g.globalAlpha = 0.6;
  g.strokeStyle = p.light;
  g.lineWidth = 1.5;
  g.beginPath();
  g.arc(m + 10, m, m * 0.52, Math.PI * 0.7, Math.PI * 1.3);
  g.stroke();
  return c;
}

class Dragon {
  pts = new Float32Array(N * 2);
  sprite: HTMLCanvasElement;
  constructor(
    public pal: Palette,
    public path: Path,
    public phase: number,
  ) {
    this.sprite = scaleSprite(pal);
    const [x, y] = path(-12);
    for (let i = 0; i < N; i++) {
      this.pts[i * 2] = x - i * SPACING;
      this.pts[i * 2 + 1] = y;
    }
    for (let t = -12; t < 0; t += 1 / 60) this.step(t);
  }
  step(t: number) {
    const p = this.pts;
    const [hx, hy] = this.path(t);
    p[0] = hx;
    p[1] = hy;
    for (let i = 1; i < N; i++) {
      const dx = p[i * 2] - p[i * 2 - 2];
      const dy = p[i * 2 + 1] - p[i * 2 - 1];
      const d = Math.hypot(dx, dy) || 1;
      p[i * 2] = p[i * 2 - 2] + (dx / d) * SPACING;
      p[i * 2 + 1] = p[i * 2 - 1] + (dy / d) * SPACING;
    }
  }
  /** Forward heading at segment i (pointing toward the head). */
  heading(i: number) {
    const p = this.pts;
    const a = Math.max(0, i - 1);
    const b = Math.min(N - 1, i + 1);
    return Math.atan2(p[a * 2 + 1] - p[b * 2 + 1], p[a * 2] - p[b * 2]);
  }
  draw(g: CanvasRenderingContext2D, t: number) {
    const p = this.pts;
    const pal = this.pal;
    this.tail(g, t);
    for (let i = N - 1; i >= 1; i--) {
      const x = p[i * 2];
      const y = p[i * 2 + 1];
      const r = radiusAt(i);
      const a = this.heading(i);
      if (LEGS.includes(i)) this.legs(g, x, y, a, r, t, i);
      g.save();
      g.translate(x, y);
      g.rotate(a);
      g.drawImage(this.sprite, -r * 1.08, -r, r * 2.16, r * 2);
      g.restore();
      if (i % 2 === 0 && i > 2 && i < N - 4) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        g.fillStyle = pal.mane[0];
        g.globalAlpha = 0.9;
        g.beginPath();
        g.moveTo(x + c * r * 0.25 - s * r * 0.28, y + s * r * 0.25 + c * r * 0.28);
        g.quadraticCurveTo(x - c * r * 0.6, y - s * r * 0.6, x - c * r * 1.15, y - s * r * 1.15);
        g.quadraticCurveTo(x - c * r * 0.6, y - s * r * 0.6, x + c * r * 0.25 + s * r * 0.28, y + s * r * 0.25 - c * r * 0.28);
        g.fill();
        g.globalAlpha = 1;
      }
    }
    this.head(g, t);
  }
  tail(g: CanvasRenderingContext2D, t: number) {
    const p = this.pts;
    const i = N - 1;
    const x = p[i * 2];
    const y = p[i * 2 + 1];
    const a = this.heading(i) + Math.PI;
    g.save();
    g.translate(x, y);
    g.rotate(a);
    const grd = g.createLinearGradient(0, 0, 0.07, 0);
    grd.addColorStop(0, this.pal.mane[0]);
    grd.addColorStop(1, this.pal.mane[1] + "00");
    g.fillStyle = grd;
    for (let k = -2; k <= 2; k++) {
      const ang = k * 0.32 + Math.sin(t * 3 + k + this.phase) * 0.12;
      const L = 0.06 - Math.abs(k) * 0.008;
      g.beginPath();
      g.moveTo(0, -0.004);
      g.quadraticCurveTo(L * 0.5 * Math.cos(ang) - 0.012 * Math.sin(ang), L * 0.5 * Math.sin(ang) - 0.012, L * Math.cos(ang), L * Math.sin(ang));
      g.quadraticCurveTo(L * 0.5 * Math.cos(ang) + 0.012 * Math.sin(ang), L * 0.5 * Math.sin(ang) + 0.012, 0, 0.004);
      g.fill();
    }
    g.restore();
  }
  legs(g: CanvasRenderingContext2D, x: number, y: number, a: number, r: number, t: number, i: number) {
    const pal = this.pal;
    for (const side of [-1, 1]) {
      const walk = Math.sin(t * 5 + i * 0.4 + (side > 0 ? 0 : Math.PI) + this.phase);
      g.save();
      g.translate(x, y);
      g.rotate(a);
      g.scale(1, side);
      const kx = -r * (0.5 + 0.5 * walk);
      const ky = r * 1.55;
      const fx = kx - r * 0.75;
      const fy = r * 2.1;
      g.lineCap = "round";
      g.lineJoin = "round";
      g.strokeStyle = pal.dark;
      g.lineWidth = r * 0.75;
      g.beginPath();
      g.moveTo(0, r * 0.4);
      g.lineTo(kx, ky);
      g.lineTo(fx, fy);
      g.stroke();
      g.strokeStyle = pal.base;
      g.lineWidth = r * 0.5;
      g.stroke();
      g.strokeStyle = pal.horn;
      g.lineWidth = r * 0.14;
      for (let c = -1; c <= 1; c++) {
        g.beginPath();
        g.moveTo(fx, fy);
        g.lineTo(fx + r * 0.45 * Math.cos(1.2 + c * 0.5), fy + r * 0.45 * Math.sin(1.2 + c * 0.5));
        g.stroke();
      }
      g.restore();
    }
  }
  head(g: CanvasRenderingContext2D, t: number) {
    const pal = this.pal;
    const x = this.pts[0];
    const y = this.pts[1];
    const a = this.heading(0);
    const h = R_BODY * 1.5;
    g.save();
    g.translate(x, y);
    g.rotate(a);
    g.scale(h, h);
    g.lineCap = "round";
    g.lineJoin = "round";

    // mane
    for (let k = 0; k < 4; k++) {
      for (const side of [-1, 1]) {
        const wave = Math.sin(t * 4 + k * 0.9 + side + this.phase) * 0.18;
        const bx = -0.2 - k * 0.22;
        const by = side * (0.35 + k * 0.05);
        const tx = -1.3 - k * 0.32;
        const ty = side * (0.9 + k * 0.28 + wave);
        const grd = g.createLinearGradient(bx, by, tx, ty);
        grd.addColorStop(0, pal.mane[0]);
        grd.addColorStop(1, pal.mane[1] + "00");
        g.fillStyle = grd;
        g.beginPath();
        g.moveTo(bx + 0.18, by);
        g.quadraticCurveTo((bx + tx) / 2, by + side * 0.55 + wave, tx, ty);
        g.quadraticCurveTo((bx + tx) / 2, by - side * 0.05, bx - 0.18, by - side * 0.12);
        g.fill();
      }
    }

    // horns
    for (const side of [-1, 1]) {
      g.beginPath();
      g.moveTo(-0.1, side * 0.3);
      g.quadraticCurveTo(-0.85, side * 0.42, -1.55, side * 0.95);
      g.moveTo(-0.85, side * 0.5);
      g.quadraticCurveTo(-1.0, side * 0.75, -0.95, side * 1.05);
      g.strokeStyle = pal.dark;
      g.lineWidth = 0.24;
      g.stroke();
      g.strokeStyle = pal.horn;
      g.lineWidth = 0.14;
      g.stroke();
    }

    // skull
    g.beginPath();
    g.moveTo(1.3, 0);
    g.bezierCurveTo(1.25, 0.3, 0.8, 0.4, 0.45, 0.55);
    g.bezierCurveTo(0.12, 0.72, -0.38, 0.62, -0.52, 0.32);
    g.bezierCurveTo(-0.64, 0.12, -0.64, -0.12, -0.52, -0.32);
    g.bezierCurveTo(-0.38, -0.62, 0.12, -0.72, 0.45, -0.55);
    g.bezierCurveTo(0.8, -0.4, 1.25, -0.3, 1.3, 0);
    g.closePath();
    const sk = g.createRadialGradient(0.2, 0, 0.05, 0.2, 0, 1.1);
    sk.addColorStop(0, pal.light);
    sk.addColorStop(0.5, pal.base);
    sk.addColorStop(1, pal.dark);
    g.fillStyle = sk;
    g.fill();
    g.strokeStyle = pal.dark;
    g.lineWidth = 0.06;
    g.stroke();

    // ridge, brows and nostrils
    g.strokeStyle = pal.light;
    g.globalAlpha = 0.7;
    g.lineWidth = 0.05;
    g.beginPath();
    g.moveTo(-0.3, 0);
    g.lineTo(0.95, 0);
    g.stroke();
    g.globalAlpha = 1;
    for (const side of [-1, 1]) {
      g.fillStyle = pal.mane[0];
      g.beginPath();
      g.moveTo(0.5, side * 0.38);
      g.quadraticCurveTo(0.15, side * 0.62, -0.25, side * 0.6);
      g.quadraticCurveTo(0.1, side * 0.45, 0.5, side * 0.38);
      g.fill();
      g.fillStyle = pal.dark;
      g.beginPath();
      g.ellipse(1.06, side * 0.14, 0.07, 0.04, 0, 0, Math.PI * 2);
      g.fill();
    }

    // glowing eyes
    for (const side of [-1, 1]) {
      g.save();
      g.shadowColor = pal.eye;
      g.shadowBlur = 12;
      g.fillStyle = pal.eye;
      g.beginPath();
      g.ellipse(0.32, side * 0.33, 0.15, 0.1, side * 0.3, 0, Math.PI * 2);
      g.fill();
      g.restore();
      g.fillStyle = "#1a0b05";
      g.beginPath();
      g.ellipse(0.34, side * 0.33, 0.03, 0.08, side * 0.3, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(0.38, side * 0.3, 0.025, 0, Math.PI * 2);
      g.fill();
    }

    // whiskers
    for (const side of [-1, 1]) {
      const w1 = Math.sin(t * 3 + side + this.phase);
      const w2 = Math.sin(t * 2.3 + side * 2 + this.phase);
      g.strokeStyle = pal.horn;
      g.globalAlpha = 0.85;
      g.lineWidth = 0.07;
      g.beginPath();
      g.moveTo(1.0, side * 0.2);
      g.bezierCurveTo(0.7, side * (1.0 + 0.2 * w1), -0.5, side * (1.4 + 0.4 * w2), -2.0 + 0.25 * w1, side * (1.1 + 0.6 * w2));
      g.stroke();
      g.lineWidth = 0.045;
      g.beginPath();
      g.moveTo(1.1, side * 0.12);
      g.bezierCurveTo(1.0, side * (0.7 + 0.15 * w2), 0.2, side * (1.0 + 0.3 * w1), -0.9 + 0.2 * w2, side * (0.9 + 0.35 * w1));
      g.stroke();
      g.globalAlpha = 1;
    }
    g.restore();
  }
}

function drawPearl(g: CanvasRenderingContext2D, t: number, px: number) {
  const pulse = 1 + 0.08 * Math.sin(t * 2.4);
  const pr = 0.042 * pulse;

  const halo = g.createRadialGradient(0, 0, 0, 0, 0, 0.26);
  halo.addColorStop(0, "rgba(255,240,190,0.45)");
  halo.addColorStop(0.35, "rgba(255,216,115,0.14)");
  halo.addColorStop(1, "rgba(255,216,115,0)");
  g.fillStyle = halo;
  g.beginPath();
  g.arc(0, 0, 0.26, 0, Math.PI * 2);
  g.fill();

  g.save();
  g.globalCompositeOperation = "lighter";
  for (let k = 0; k < 7; k++) {
    const a = t * 0.9 + (k * Math.PI * 2) / 7;
    const L = pr * (1.9 + 0.35 * Math.sin(t * 4 + k * 1.7));
    const c = Math.cos(a);
    const s = Math.sin(a);
    const grd = g.createRadialGradient(c * pr, s * pr, 0, c * pr, s * pr, L);
    grd.addColorStop(0, "rgba(255,200,80,0.55)");
    grd.addColorStop(1, "rgba(255,120,40,0)");
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(c * pr * 0.8 - s * pr * 0.45, s * pr * 0.8 + c * pr * 0.45);
    g.quadraticCurveTo(c * L * 0.9 + s * pr * 0.6, s * L * 0.9 - c * pr * 0.6, c * L - s * pr * 0.5, s * L + c * pr * 0.5);
    g.quadraticCurveTo(c * L * 0.7, s * L * 0.7, c * pr * 0.8 + s * pr * 0.45, s * pr * 0.8 - c * pr * 0.45);
    g.fill();
  }
  g.restore();

  g.save();
  g.shadowColor = "#ffd873";
  g.shadowBlur = px * 0.06;
  const core = g.createRadialGradient(-pr * 0.35, -pr * 0.35, pr * 0.05, 0, 0, pr);
  core.addColorStop(0, "#ffffff");
  core.addColorStop(0.35, "#fff4cc");
  core.addColorStop(0.8, "#ffd873");
  core.addColorStop(1, "#f7b518");
  g.fillStyle = core;
  g.beginPath();
  g.arc(0, 0, pr, 0, Math.PI * 2);
  g.fill();
  g.restore();

  g.strokeStyle = "rgba(255,255,255,0.5)";
  g.lineWidth = 0.004;
  g.beginPath();
  g.arc(0, 0, pr * 0.7, -2.4 + t * 0.5, -1.2 + t * 0.5);
  g.stroke();
}

const DUST = (() => {
  const rnd = seeded(7);
  return Array.from({ length: 70 }, () => ({ a: rnd() * Math.PI * 2, r: 0.08 + rnd() * 0.42, s: 0.05 + rnd() * 0.2, z: rnd() }));
})();

function DragonArt() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const g = cv.getContext("2d")!;
    const reduced = prefersReducedMotion();
    const gold = new Dragon(GOLD, PATH_GOLD, 0);
    const jade = new Dragon(JADE, PATH_JADE, 2);
    let W = 1;
    let H = 1;
    let dpr = 1;
    const stopFit = fitCanvas(cv, (w, h, d) => {
      W = w;
      H = h;
      dpr = d;
    });
    const fade = { v: 0 };
    const tw = gsap.to(fade, { v: 1, duration: 1.4, ease: "power2.out", delay: 0.2 });
    let clock = 0;

    const frame = (_t: number, dt: number) => {
      clock += dt * (reduced ? 0.35 : 1.15);
      const t = clock;
      gold.step(t);
      jade.step(t);
      const S = Math.min(W, H);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      g.globalAlpha = fade.v;
      g.setTransform(dpr * S, 0, 0, dpr * S, (dpr * W) / 2, (dpr * H) / 2);

      // jade mist and gold dust
      const mist = g.createRadialGradient(0, 0, 0.05, 0, 0, 0.5);
      mist.addColorStop(0, "rgba(43,217,159,0.12)");
      mist.addColorStop(0.6, "rgba(43,217,159,0.04)");
      mist.addColorStop(1, "rgba(43,217,159,0)");
      g.fillStyle = mist;
      g.fillRect(-0.5 * (W / S), -0.5 * (H / S), W / S, H / S);
      DUST.forEach((d) => {
        const a = d.a + t * d.s * 0.3;
        const tw2 = 0.5 + 0.5 * Math.sin(t * 2 + d.a * 5);
        g.fillStyle = d.z > 0.5 ? `rgba(255,216,115,${(0.5 * tw2).toFixed(3)})` : `rgba(201,255,233,${(0.4 * tw2).toFixed(3)})`;
        g.beginPath();
        g.arc(Math.cos(a) * d.r, Math.sin(a) * d.r * 0.8, 0.0025 + d.z * 0.003, 0, Math.PI * 2);
        g.fill();
      });

      jade.draw(g, t);
      gold.draw(g, t);
      drawPearl(g, t, S);
      g.globalAlpha = 1;
    };

    const stopLoop = runLoop(cv, frame);
    return () => {
      stopLoop();
      stopFit();
      tw.kill();
    };
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px]">
      <div className="pointer-events-none absolute inset-[8%] rounded-full border border-emerald/10 shadow-[0_0_80px_rgba(43,217,159,0.12)_inset]" />
      <canvas
        ref={canvas}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="A gold dragon and an emerald dragon chasing a glowing pearl"
      />
    </div>
  );
}
