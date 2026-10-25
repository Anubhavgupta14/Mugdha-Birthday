import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import confetti from "canvas-confetti";
import { say } from "@/game/mito";
import { sound } from "@/game/audio";
import { SONGS } from "@/game/content";
import SongCard from "@/components/SongCard";
import GiftReveal from "./GiftReveal";
import { createConfetti, prefersReducedMotion, type Cannon } from "./fx";
import type { GiftProps } from "./types";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

const AMOUNT = 250_000_000;
const GOLDS = ["#f7b518", "#ffd873", "#fff1b0", "#e09a00", "#c98a00"];

export default function ManifestGift({ onContinue }: GiftProps) {
  return (
    <GiftReveal level={3} title="The ₹25 Crore Manifestation" accent="#f7b518" onContinue={onContinue}>
      <ManifestScene />
    </GiftReveal>
  );
}

const fmt = (v: number) => `${Math.round(v).toLocaleString("en-IN")}`;

function ManifestScene() {
  const root = useRef<HTMLDivElement>(null);
  const amount = useRef<SVGTextElement>(null);
  const cannon = useRef<Cannon | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const c = createConfetti(36);
    cannon.current = c;
    const t = setTimeout(() => say("Shh… the Universe is writing you a cheque. Don't distract it. ✍️", "think"), 600);
    return () => {
      clearTimeout(t);
      c.destroy();
      cannon.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const counter = { v: 0 };
      let lastCoin = 0;
      const setAmount = (v: number) => {
        if (amount.current) amount.current.textContent = fmt(v);
      };

      let shapes: confetti.Shape[] = ["circle"];
      try {
        shapes = [
          confetti.shapeFromText({ text: "₹", scalar: 2.2, color: "#f7b518" }),
          confetti.shapeFromText({ text: "₹", scalar: 2.2, color: "#ffd873" }),
          "circle",
          "circle",
        ];
      } catch {
        // older browsers: plain gold circles
      }

      const stampOrigin = () => {
        const r = root.current?.querySelector(".chq-stamp")?.getBoundingClientRect();
        return r ? { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight } : { x: 0.5, y: 0.5 };
      };

      const slam = () => {
        sound.bell(70, 0, 0.5, 0.55);
        sound.bell(140, 0, 0.25, 0.3);
        sound.play("success");
        const fire = cannon.current?.fire;
        if (fire) {
          fire({
            particleCount: 90,
            spread: 360,
            startVelocity: 32,
            origin: stampOrigin(),
            colors: GOLDS,
            shapes: ["circle", "star"],
            scalar: 1.1,
            disableForReducedMotion: true,
          });
        }
      };

      const rain = () => {
        const fire = cannon.current?.fire;
        if (!fire) return;
        fire({
          particleCount: 16,
          angle: 270,
          spread: 50,
          startVelocity: 8 + Math.random() * 10,
          gravity: 0.9,
          ticks: 420,
          drift: Math.random() - 0.5,
          origin: { x: 0.1 + Math.random() * 0.8, y: -0.08 },
          colors: GOLDS,
          shapes,
          scalar: 2.2,
          flat: false,
          disableForReducedMotion: true,
        });
      };

      const t = gsap.timeline({ delay: 0.4 });
      t.fromTo(
        ".chq",
        { y: 50, rotationX: 28, opacity: 0, transformPerspective: 900 },
        { y: 0, rotationX: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
      )
        .fromTo(".chq-payee", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
        .fromTo(
          counter,
          { v: 0 },
          {
            v: AMOUNT,
            duration: 3,
            ease: "power2.inOut",
            onStart: () => setAmount(0),
            onUpdate: () => {
              setAmount(counter.v);
              const now = performance.now();
              if (now - lastCoin > 120) {
                lastCoin = now;
                sound.play("coin");
              }
            },
            onComplete: () => {
              setAmount(AMOUNT);
              sound.play("chime");
            },
          },
          "+=0.1",
        )
        .fromTo(
          ".chq-amount-box",
          { attr: { transform: "scale(1)" } },
          { attr: { transform: "scale(1.08)" }, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
        )
        .fromTo(".chq-words", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "-=0.1")
        .fromTo(".chq-memo", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "-=0.25")
        .fromTo(".chq-sig-clip", { attr: { width: 0 } }, { attr: { width: 240 }, duration: 1.4, ease: "power1.inOut" })
        .fromTo(".chq-flourish", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, ease: "power2.out" }, "-=0.15")
        .addLabel("stamp", "+=0.35")
        .fromTo(
          ".chq-stamp",
          { attr: { transform: "rotate(-24) scale(3.2)" }, opacity: 0 },
          { attr: { transform: "rotate(0) scale(1)" }, opacity: 0.94, duration: 0.4, ease: "power4.in" },
          "stamp",
        )
        .call(slam, [], "stamp+=0.4")
        .call(() => say("It's official! The Universe doesn't bounce cheques. ₹25 Cr, recurring! 💸", "shock"), [], "stamp+=1.1")
        .fromTo(".chq-ring", { attr: { r: 30 }, opacity: 0.7 }, { attr: { r: 170 }, opacity: 0, duration: 0.7, ease: "power2.out" }, "stamp+=0.4")
        .to(".chq", { keyframes: { x: [-10, 9, -6, 4, -2, 0], y: [5, -4, 2, -1, 0, 0] }, duration: 0.45, ease: "none" }, "stamp+=0.4");
      for (let k = 0; k < 12; k++) t.call(rain, [], `stamp+=${0.55 + k * 0.22}`);
      t.fromTo(".chq-replay", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "stamp+=1.2");
      if (reduced) t.timeScale(3);
      tl.current = t;

      gsap.timeline({ delay: 1.2 }).from(".mf-card > *", { opacity: 0, y: 16, duration: 0.7, stagger: 0.18, ease: "power3.out" });
      gsap.fromTo(
        ".mf-done",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.65, delay: reduced ? 3 : 9.4, ease: "back.out(2)" },
      );
      gsap.fromTo(".chq-sheen", { x: -220 }, { x: 820, duration: 2.4, ease: "power1.inOut", repeat: -1, repeatDelay: 3.5, delay: 2 });
    },
    { scope: root },
  );

  const replay = () => {
    sound.play("click");
    tl.current?.restart();
  };

  return (
    <div ref={root} className="grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
      <div className="flex flex-col items-center gap-3">
        <Cheque amountRef={amount} />
        <button onClick={replay} className="chq-replay btn-ghost text-sm opacity-0">
          ↻ Cash it again
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <div className="mf-card glass relative overflow-hidden rounded-3xl px-5 py-7 text-center sm:px-8">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl" />
          <p className="font-regal text-[0.7rem] tracking-[0.35em] text-gold uppercase">Today&apos;s affirmation · say it thrice</p>
          <p className="mt-4 font-display text-2xl leading-snug text-cream sm:text-3xl">
            iThrive is a <span className="text-shine font-semibold">₹25 Crore</span> company healing the planet.
          </p>
          <div className="mt-5 flex flex-col gap-1 font-hand text-[1.7rem] leading-tight text-gold-soft">
            <span className="mf-done">It is done.</span>
            <span className="mf-done">It is done.</span>
            <span className="mf-done">It is done. 🙏</span>
          </div>
          <p className="mt-5 text-sm text-muted">Accounts team has been notified. The CA is crying happy tears. 🧾😭</p>
        </div>
        <div className="mf-card">
          <SongCard song={SONGS.manifest} />
        </div>
      </div>
    </div>
  );
}

/* ---------- The cheque ---------- */

const f1 = (n: number) => n.toFixed(1);

const GUILLOCHE = (() => {
  const lines: string[] = [];
  for (let k = 0; k < 20; k++) {
    for (const ph of [0, Math.PI]) {
      let d = "";
      for (let x = 20; x <= 580; x += 6) {
        const y = 92 + k * 13 + 5 * Math.sin(x / 26 + k * 0.45 + ph) + 3 * Math.sin(x / 11 - k * 0.7);
        d += `${x === 20 ? "M" : "L"}${x} ${f1(y)}`;
      }
      lines.push(d);
    }
  }
  return lines;
})();

const ROSETTE = Array.from({ length: 7 }, (_, j) => {
  let d = "";
  for (let i = 0; i <= 240; i++) {
    const a = (i / 240) * Math.PI * 2;
    const r = 25 + 6 * Math.sin(12 * a + j * 0.45) + 2 * Math.cos(5 * a - j);
    d += `${i ? "L" : "M"}${f1(62 + r * Math.cos(a))} ${f1(62 + r * Math.sin(a))}`;
  }
  return d + "Z";
});

const CORNER = (cx: number, cy: number) => {
  let d = "";
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    const r = 5 + 3 * Math.abs(Math.cos(4 * a));
    d += `${i ? "L" : "M"}${f1(cx + r * Math.cos(a))} ${f1(cy + r * Math.sin(a))}`;
  }
  return d + "Z";
};
const CORNERS = [CORNER(30, 30), CORNER(570, 30), CORNER(30, 350), CORNER(570, 350)];

function Cheque({ amountRef }: { amountRef: RefObject<SVGTextElement | null> }) {
  return (
    <div className="w-full max-w-[680px] [perspective:900px]">
      <svg
        viewBox="0 0 600 380"
        className="chq w-full overflow-visible opacity-0 drop-shadow-[0_24px_50px_rgba(247,181,24,0.28)]"
        role="img"
        aria-label="A cheque from The Universal Bank of Abundance: pay iThrive, Mugdha Pradhan, twenty-five crore rupees, annually, recurring. Signed, The Universe. Stamped: Manifested."
      >
        <defs>
          <linearGradient id="chq-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="0.45" stopColor="#fbe9b4" />
            <stop offset="1" stopColor="#efcd6e" />
          </linearGradient>
          <linearGradient id="chq-band" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe9a6" />
            <stop offset="0.5" stopColor="#d9a21b" />
            <stop offset="1" stopColor="#a87000" />
          </linearGradient>
          <pattern id="chq-weave" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="none" stroke="#7a5200" strokeWidth="0.7" opacity="0.7" />
            <circle cx="6" cy="6" r="1.1" fill="#fff4cc" />
          </pattern>
          <linearGradient id="chq-sheen-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id="chq-shape">
            <rect x="6" y="6" width="588" height="368" rx="14" />
          </clipPath>
          <clipPath id="chq-sig">
            <rect className="chq-sig-clip" x="340" y="240" width="0" height="80" />
          </clipPath>
          <filter id="chq-ink" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.4 1.75" result="m" />
            <feComposite in="SourceGraphic" in2="m" operator="in" />
          </filter>
        </defs>

        <g clipPath="url(#chq-shape)">
          <rect x="0" y="0" width="600" height="380" fill="url(#chq-paper)" />
          <g stroke="#b8860b" strokeWidth="0.6" fill="none" opacity="0.16">
            {GUILLOCHE.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <text x="300" y="250" textAnchor="middle" className="font-display" fontSize="210" fill="#b8860b" opacity="0.07">
            ∞
          </text>
          <path
            d="M6 20 a14 14 0 0 1 14 -14 H580 a14 14 0 0 1 14 14 V360 a14 14 0 0 1 -14 14 H20 a14 14 0 0 1 -14 -14 Z M20 26 a6 6 0 0 1 6 -6 H574 a6 6 0 0 1 6 6 V354 a6 6 0 0 1 -6 6 H26 a6 6 0 0 1 -6 -6 Z"
            fill="url(#chq-band)"
            fillRule="evenodd"
          />
          <path
            d="M6 20 a14 14 0 0 1 14 -14 H580 a14 14 0 0 1 14 14 V360 a14 14 0 0 1 -14 14 H20 a14 14 0 0 1 -14 -14 Z M20 26 a6 6 0 0 1 6 -6 H574 a6 6 0 0 1 6 6 V354 a6 6 0 0 1 -6 6 H26 a6 6 0 0 1 -6 -6 Z"
            fill="url(#chq-weave)"
            fillRule="evenodd"
          />
          <rect x="24" y="24" width="552" height="332" rx="4" fill="none" stroke="#a87000" strokeWidth="0.8" />
          {CORNERS.map((d, i) => (
            <path key={i} d={d} fill="#fff4cc" stroke="#7a5200" strokeWidth="0.8" />
          ))}
          <rect
            className="chq-sheen"
            x="0"
            y="-40"
            width="140"
            height="460"
            fill="url(#chq-sheen-g)"
            transform="skewX(-18)"
            style={{ mixBlendMode: "soft-light" }}
          />
        </g>

        {/* bank */}
        <g stroke="#a87000" strokeWidth="0.55" fill="none" opacity="0.75">
          {ROSETTE.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <circle cx="62" cy="62" r="11" fill="#f7b518" stroke="#7a5200" strokeWidth="1" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={f1(62 + 13 * Math.cos(a))}
              y1={f1(62 + 13 * Math.sin(a))}
              x2={f1(62 + 17 * Math.cos(a))}
              y2={f1(62 + 17 * Math.sin(a))}
              stroke="#c98a00"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
        <text x="104" y="54" className="font-regal" fontSize="14.5" fontWeight="700" fill="#5a3d00" letterSpacing="0.6">
          THE UNIVERSAL BANK OF ABUNDANCE
        </text>
        <text x="104" y="72" className="font-sans" fontSize="9" fill="#7a5a10" letterSpacing="0.4">
          Cosmic Main Branch · Milky Way · IFSC ABUN0000∞
        </text>

        <text x="456" y="96" className="font-sans" fontSize="7.5" fill="#7a5a10" letterSpacing="2">
          DATE
        </text>
        <text x="572" y="96" textAnchor="end" className="font-hand" fontSize="17" fill="#3b2600">
          Every birthday
        </text>
        <line x1="486" y1="101" x2="574" y2="101" stroke="#8a6510" strokeWidth="0.8" />

        {/* payee */}
        <text x="30" y="118" className="font-sans" fontSize="7.5" fill="#7a5a10" letterSpacing="2">
          PAY TO THE ORDER OF
        </text>
        <text className="chq-payee font-hand" x="36" y="150" fontSize="31" fill="#2a1700">
          iThrive · Mugdha Pradhan
        </text>
        <line x1="30" y1="158" x2="360" y2="158" stroke="#8a6510" strokeWidth="0.8" />

        <g transform="translate(476 141)">
          <g className="chq-amount-box">
            <g transform="translate(-476 -141)">
              <rect x="378" y="118" width="196" height="46" rx="6" fill="#fffaf0" stroke="#9a6b06" strokeWidth="1.2" />
              <rect x="382" y="122" width="188" height="38" rx="4" fill="none" stroke="#d9a21b" strokeWidth="0.6" strokeDasharray="2 2" />
              <text x="390" y="150" className="font-display" fontSize="22" fontWeight="600" fill="#7a4b00">
                ₹
              </text>
              <text
                ref={amountRef}
                x="564"
                y="150"
                textAnchor="end"
                className="font-sans"
                fontSize="22"
                fontWeight="700"
                fill="#2a1700"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                0
              </text>
            </g>
          </g>
        </g>

        {/* words */}
        <g className="chq-words">
          <text x="30" y="190" className="font-sans" fontSize="7.5" fill="#7a5a10" letterSpacing="2">
            RUPEES
          </text>
          <text x="36" y="219" className="font-hand" fontSize="23" fill="#2a1700">
            Twenty-Five Crore Rupees Only, <tspan fill="#a3122a">annually, recurring</tspan> ♾️
          </text>
          <line x1="30" y1="226" x2="574" y2="226" stroke="#8a6510" strokeWidth="0.8" />
        </g>

        {/* memo */}
        <g className="chq-memo">
          <text x="30" y="256" className="font-sans" fontSize="7.5" fill="#7a5a10" letterSpacing="2">
            MEMO
          </text>
          <text x="36" y="282" className="font-hand" fontSize="23" fill="#2a1700">
            For healing 10 lakh lives 🪷
          </text>
          <line x1="30" y1="290" x2="300" y2="290" stroke="#8a6510" strokeWidth="0.8" />
        </g>

        {/* signature */}
        <g clipPath="url(#chq-sig)">
          <text x="352" y="290" className="font-hand" fontSize="36" fontWeight="700" fill="#1b2a6b" transform="rotate(-4 352 290)">
            The Universe ✨
          </text>
        </g>
        <path
          className="chq-flourish"
          d="M350 300 C 400 314, 470 288, 520 300 S 566 304, 574 288"
          fill="none"
          stroke="#1b2a6b"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <line x1="336" y1="306" x2="574" y2="306" stroke="#8a6510" strokeWidth="0.8" />
        <text x="455" y="320" textAnchor="middle" className="font-sans" fontSize="7" fill="#7a5a10" letterSpacing="2">
          AUTHORISED SIGNATORY
        </text>

        <text
          x="432"
          y="347"
          textAnchor="middle"
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="11"
          fill="#4a3500"
          opacity="0.7"
          letterSpacing="2"
        >
          ⑆000025⑆ 2500000000⑈ ∞ 07
        </text>

        {/* stamp */}
        <g transform="translate(188 324) rotate(-8)">
          <circle className="chq-ring" r="30" fill="none" stroke="#c8102e" strokeWidth="3" opacity="0" />
          <g className="chq-stamp" opacity="0" filter="url(#chq-ink)" style={{ mixBlendMode: "multiply" }}>
            <rect x="-104" y="-31" width="208" height="62" rx="9" fill="rgba(200,16,46,0.07)" stroke="#c8102e" strokeWidth="4" />
            <rect x="-96" y="-23" width="192" height="46" rx="5" fill="none" stroke="#d4a017" strokeWidth="1.6" />
            <text
              y="7"
              textAnchor="middle"
              className="font-regal"
              fontSize="22"
              fontWeight="700"
              fill="#c8102e"
              textLength="172"
              lengthAdjust="spacingAndGlyphs"
            >
              MANIFESTED ✓
            </text>
            <text y="18" textAnchor="middle" className="font-sans" fontSize="6.5" fontWeight="700" fill="#b8860b" letterSpacing="2">
              ★ BY ORDER OF THE UNIVERSE ★
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
