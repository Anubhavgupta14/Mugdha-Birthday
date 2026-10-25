import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { sound } from "@/game/audio";
import { createConfetti, prefersReducedMotion, type Cannon } from "./fx";

gsap.registerPlugin(useGSAP);

const ROMAN = ["I", "II", "III"] as const;

type Props = {
  level: 1 | 2 | 3;
  title: string;
  /** Hex colour, e.g. "#ff6b3d". Tints the backdrop, gift box and confetti. */
  accent: string;
  children: ReactNode;
  onContinue: () => void;
  continueLabel?: string;
};

export default function GiftReveal({ level, title, accent, children, onContinue, continueLabel = "Continue the mission →" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const cannon = useRef<Cannon | null>(null);
  const burstDone = useRef(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const c = createConfetti();
    cannon.current = c;
    return () => {
      c.destroy();
      cannon.current = null;
    };
  }, []);

  const burst = () => {
    if (burstDone.current) return;
    burstDone.current = true;
    sound.play("reveal");
    const fire = cannon.current?.fire;
    if (!fire) return;
    const colors = [accent, "#f7b518", "#ffd873", "#fff7e6", "#ff8fb1"];
    const base = { colors, disableForReducedMotion: true, zIndex: 35 };
    fire({ ...base, particleCount: 140, spread: 110, startVelocity: 48, origin: { x: 0.5, y: 0.45 }, scalar: 1.1 });
    fire({ ...base, particleCount: 60, angle: 60, spread: 60, startVelocity: 55, origin: { x: 0, y: 0.8 } });
    fire({ ...base, particleCount: 60, angle: 120, spread: 60, startVelocity: 55, origin: { x: 1, y: 0.8 } });
  };

  useGSAP(
    () => {
      const rays = gsap.to(".gr-rays", { rotation: 360, duration: 18, ease: "none", repeat: -1 });
      const t = gsap.timeline({
        onComplete: () => {
          rays.kill();
          setOpened(true);
        },
      });
      t.from(".gr-stage", { scale: 0.2, y: 80, opacity: 0, duration: 0.55, ease: "back.out(1.8)" })
        .from(".gr-label", { opacity: 0, letterSpacing: "0.8em", duration: 0.7, ease: "power3.out" }, 0.25)
        .from(".gr-sub", { opacity: 0, y: 10, duration: 0.5 }, 0.45)
        .to(".gr-box", { keyframes: { rotation: [0, -9, 9, -11, 11, -6, 0] }, duration: 0.8, ease: "none", transformOrigin: "50% 90%" }, 0.5)
        .to(".gr-glow", { opacity: 1, scale: 1.25, duration: 0.8, ease: "power2.in" }, 0.5)
        .call(() => sound.play("whoosh"), [], 1.25)
        .to(".gr-lid", { y: -260, x: 70, rotation: 38, opacity: 0, duration: 0.8, ease: "power2.out", transformOrigin: "50% 50%" }, 1.3)
        .fromTo(
          ".gr-beam",
          { opacity: 0, scaleY: 0.2 },
          { opacity: 1, scaleY: 1, duration: 0.45, ease: "power2.out", transformOrigin: "50% 100%" },
          1.32,
        )
        .fromTo(".gr-rays", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }, 1.32)
        .fromTo(".gr-flash", { opacity: 0 }, { opacity: 0.85, duration: 0.12, yoyo: true, repeat: 1 }, 1.32)
        .call(burst, [], 1.35)
        .to(".gr-intro", { opacity: 0, scale: 1.08, duration: 0.45, ease: "power2.in" }, 2.25);
      if (prefersReducedMotion()) t.timeScale(2.5);
      tl.current = t;
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!opened) return;
      gsap.fromTo(".gr-content > *", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" });
    },
    { scope: root, dependencies: [opened] },
  );

  const skip = () => {
    if (opened) return;
    tl.current?.kill();
    gsap.killTweensOf(".gr-rays");
    burst();
    setOpened(true);
  };

  const backdrop = [
    `radial-gradient(ellipse 90% 55% at 50% 0%, color-mix(in srgb, ${accent} 26%, transparent), transparent 70%)`,
    `radial-gradient(ellipse 70% 50% at 50% 110%, color-mix(in srgb, ${accent} 14%, transparent), transparent 70%)`,
    "radial-gradient(ellipse at 50% 40%, #1d1240 0%, #0b0820 70%)",
  ].join(", ");

  return (
    <div ref={root} className="fixed inset-0 z-30 overflow-x-hidden overflow-y-auto overscroll-contain" style={{ background: backdrop }}>
      {!opened && (
        <div
          className="gr-intro fixed inset-0 z-10 flex cursor-pointer flex-col items-center justify-center overflow-hidden px-4"
          onClick={skip}
          role="button"
          tabIndex={0}
          aria-label="Open gift"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && skip()}
        >
          <div className="gr-stage relative grid h-[min(64vw,300px)] w-[min(64vw,300px)] place-items-center">
            <div
              className="gr-rays pointer-events-none absolute -inset-[70%] opacity-0"
              style={{
                background: `repeating-conic-gradient(from 0deg, color-mix(in srgb, ${accent} 45%, transparent) 0deg 5deg, transparent 5deg 15deg)`,
                maskImage: "radial-gradient(circle, #000 12%, transparent 62%)",
                WebkitMaskImage: "radial-gradient(circle, #000 12%, transparent 62%)",
              }}
            />
            <div
              className="gr-glow pointer-events-none absolute inset-0 rounded-full opacity-40 blur-2xl"
              style={{ background: `radial-gradient(circle, ${accent} 0%, color-mix(in srgb, ${accent} 40%, transparent) 40%, transparent 70%)` }}
            />
            <GiftBox accent={accent} />
            <div className="gr-flash pointer-events-none absolute inset-[-20%] rounded-full bg-[radial-gradient(circle,#fff_0%,rgba(255,247,230,0.6)_35%,transparent_70%)] opacity-0" />
          </div>
          <p className="gr-label text-shine mt-8 text-center font-regal text-2xl font-bold tracking-[0.3em] sm:text-4xl">GIFT UNLOCKED</p>
          <p className="gr-sub mt-3 text-center text-sm text-muted sm:text-base">
            Gift {ROMAN[level - 1]} of III · <span className="text-cream">{title}</span>
          </p>
          <p className="gr-sub mt-8 text-xs tracking-wider text-muted/60">tap to open</p>
        </div>
      )}

      {opened && (
        <div className="gr-content mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 pt-8 sm:px-6 sm:pt-12">
          <header className="mb-6 text-center sm:mb-10">
            <p className="font-regal text-xs font-semibold tracking-[0.35em] uppercase sm:text-sm" style={{ color: accent }}>
              Gift {ROMAN[level - 1]} of III · Unlocked
            </p>
            <h1 className="text-shine mt-2 font-display text-4xl leading-tight font-semibold sm:text-6xl">{title}</h1>
          </header>
          <div className="flex-1">{children}</div>
          <div className="sticky bottom-0 -mx-4 mt-10 flex justify-end bg-gradient-to-t from-night via-night/85 to-transparent px-4 pt-10 pb-5 sm:mx-0 sm:justify-center sm:px-0">
            <button
              className="btn-gold text-base sm:text-lg"
              onClick={() => {
                sound.play("click");
                onContinue();
              }}
            >
              {continueLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GiftBox({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 200 200" className="gr-box relative h-full w-full overflow-visible drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" aria-hidden>
      <defs>
        <linearGradient id="gr-shade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </linearGradient>
        <linearGradient id="gr-ribbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e09a00" />
          <stop offset="0.5" stopColor="#ffe9a6" />
          <stop offset="1" stopColor="#c98a00" />
        </linearGradient>
        <filter id="gr-soft" x="-30%" y="-10%" width="160%" height="120%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <linearGradient id="gr-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff7e6" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#ffd873" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffd873" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="182" rx="66" ry="8" fill="#000" opacity="0.35" />
      <polygon
        className="gr-beam"
        points="44,96 156,96 230,-120 -30,-120"
        fill="url(#gr-beam)"
        filter="url(#gr-soft)"
        opacity="0"
        style={{ mixBlendMode: "screen" }}
      />
      <rect x="40" y="94" width="120" height="84" rx="6" fill={accent} />
      <rect x="40" y="94" width="120" height="84" rx="6" fill="url(#gr-shade)" />
      <rect x="40" y="94" width="120" height="10" fill="#000" opacity="0.18" />
      <rect x="92" y="94" width="16" height="84" fill="url(#gr-ribbon)" />
      <g className="gr-lid">
        <rect x="32" y="74" width="136" height="24" rx="5" fill={accent} />
        <rect x="32" y="74" width="136" height="24" rx="5" fill="url(#gr-shade)" />
        <rect x="90" y="74" width="20" height="24" fill="url(#gr-ribbon)" />
        <path d="M100 74 C 78 38, 46 50, 62 70 C 70 79, 90 77, 100 74 Z" fill="url(#gr-ribbon)" stroke="#a87000" strokeWidth="1.2" />
        <path d="M100 74 C 122 38, 154 50, 138 70 C 130 79, 110 77, 100 74 Z" fill="url(#gr-ribbon)" stroke="#a87000" strokeWidth="1.2" />
        <path d="M96 76 L 84 100 L 92 96 L 96 104 Z M104 76 L 116 100 L 108 96 L 104 104 Z" fill="#e09a00" />
        <circle cx="100" cy="73" r="8" fill="url(#gr-ribbon)" stroke="#a87000" strokeWidth="1.2" />
      </g>
    </svg>
  );
}
