import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import confetti from "canvas-confetti";
import Earth from "./Earth";
import { sound } from "@/game/audio";
import { BLESSING } from "@/game/content";

gsap.registerPlugin(useGSAP);

const STEPS = ["The fever breaks… 🌡️", "The soil wakes up 🌱", "The oceans run clear 🌊", "The forests breathe again 🌳", "Gaia smiles. 💚"];

/** A golden diya: brass bowl, wick and a living flame (animated by the blessing timeline). */
function Diya({ className }: { className?: string }) {
  return (
    <svg viewBox="-120 -175 240 215" className={`overflow-visible ${className ?? ""}`} aria-hidden>
      <defs>
        <radialGradient id="diyaHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffb938" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff6b3d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="diyaFlameOuter" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#ff6b3d" />
          <stop offset="0.55" stopColor="#ffa31a" />
          <stop offset="1" stopColor="#ffd873" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="diyaFlameInner" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#fff7e6" />
          <stop offset="1" stopColor="#ffe08a" />
        </linearGradient>
        <linearGradient id="diyaBowl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="0.45" stopColor="#e09a00" />
          <stop offset="1" stopColor="#8a4b06" />
        </linearGradient>
        <linearGradient id="diyaOil" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7a3d0a" />
          <stop offset="0.5" stopColor="#c7841a" />
          <stop offset="1" stopColor="#7a3d0a" />
        </linearGradient>
      </defs>

      <circle className="diya-halo" cx="0" cy="-70" r="95" fill="url(#diyaHalo)" />
      {[-28, -10, 8, 24].map((x, i) => (
        <circle key={i} className="diya-spark" cx={x * 0.5} cy="-110" r={1.6 + (i % 2)} fill="#ffe08a" />
      ))}

      {/* the light: outer group pops in when lit, inner group flickers forever */}
      <g className="diya-light">
        <g className="diya-flame">
          <path d="M0 -150 C 16 -118, 30 -84, 0 -28 C -30 -84, -16 -118, 0 -150 Z" fill="url(#diyaFlameOuter)" />
          <path d="M0 -118 C 9 -96, 17 -72, 0 -34 C -17 -72, -9 -96, 0 -118 Z" fill="url(#diyaFlameInner)" />
          <ellipse cx="0" cy="-38" rx="6" ry="9" fill="#9fd8ff" opacity="0.75" />
        </g>
      </g>
      <path d="M0 -30 L0 -18" stroke="#2a1608" strokeWidth="3.5" strokeLinecap="round" />

      <g className="diya-bowl">
        <path d="M-96 -14 C -86 30, 86 30, 96 -14 Z" fill="url(#diyaBowl)" stroke="#ffd873" strokeWidth="1.5" />
        <ellipse cx="0" cy="-14" rx="96" ry="11" fill="url(#diyaOil)" stroke="#ffe08a" strokeWidth="2" />
        {/* scalloped band and dots */}
        <path
          d="M-80 4 q10 9 20 0 q10 9 20 0 q10 9 20 0 q10 9 20 0 q10 9 20 0 q10 9 20 0 q10 9 20 0 q10 9 20 0"
          fill="none"
          stroke="#fff3c4"
          strokeWidth="1.6"
          opacity="0.8"
        />
        {[-70, -50, -30, -10, 10, 30, 50, 70].map((x) => (
          <circle key={x} cx={x} cy="15" r="1.8" fill="#fff3c4" opacity="0.75" />
        ))}
        <ellipse cx="0" cy="27" rx="38" ry="7" fill="#8a4b06" stroke="#e09a00" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export default function Healing({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [health, setHealth] = useState(0.77);
  const [phase, setPhase] = useState<"heal" | "bless">("heal");

  useGSAP(
    () => {
      if (phase !== "heal") return;
      const h = { v: 0.77 };
      const tl = gsap.timeline();
      tl.from(".heal-earth", { scale: 0.7, opacity: 0, duration: 1.2, ease: "back.out(1.5)" })
        .to(h, { v: 1, duration: STEPS.length * 1.3, ease: "sine.inOut", onUpdate: () => setHealth(h.v) })
        .from(".heal-step", { opacity: 0, y: 14, stagger: 1.3, duration: 0.6 }, "<")
        .call(() => {
          sound.play("reveal");
          const colors = ["#2bd99f", "#8be38f", "#6cc8ff", "#f7b518"];
          confetti({ particleCount: 160, spread: 120, origin: { y: 0.45 }, colors, scalar: 1.1 });
          setTimeout(() => confetti({ particleCount: 100, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors }), 250);
          setTimeout(() => confetti({ particleCount: 100, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors }), 400);
        })
        .from(".heal-cta", { opacity: 0, y: 20, duration: 0.6 });
      gsap.to(".heal-ring", { scale: 1.6, opacity: 0, duration: 2.6, repeat: -1, stagger: 0.8, ease: "power1.out" });
    },
    { scope: root, dependencies: [phase] },
  );

  useGSAP(
    () => {
      if (phase !== "bless") return;
      sound.play("reveal");
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".rays", { opacity: 0, scale: 0.6, duration: 2 })
        .from(".diya-bowl", { y: 30, opacity: 0, duration: 1 }, "-=1.6")
        // the lamp is lit
        .call(() => sound.play("chime"))
        .from(".diya-light", { scale: 0, transformOrigin: "50% 100%", duration: 1.2, ease: "elastic.out(1, 0.45)" })
        .from(".diya-halo", { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 1.4 }, "<")
        .from(".bless-in", { opacity: 0, y: 18, stagger: 0.35, duration: 0.9 }, "-=0.6");
      gsap.to(".rays", { rotate: 360, duration: 90, repeat: -1, ease: "none" });
      gsap.to(".diya-flame", {
        scaleY: "random(0.88, 1.12)",
        scaleX: "random(0.93, 1.05)",
        skewX: "random(-5, 5)",
        transformOrigin: "50% 100%",
        duration: 0.16,
        ease: "sine.inOut",
        repeat: -1,
        repeatRefresh: true,
      });
      gsap.to(".diya-halo", { scale: 1.08, opacity: 0.85, transformOrigin: "50% 50%", duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.utils.toArray<SVGElement>(".diya-spark").forEach((s, i) => {
        gsap
          .timeline({ repeat: -1, repeatRefresh: true, delay: 1.5 + i * 0.55 })
          .fromTo(s, { y: 0, x: 0, opacity: 0 }, { y: -70, x: "random(-14, 14)", duration: 2.2, ease: "power1.out" })
          .to(s, { opacity: 1, duration: 0.5 }, 0)
          .to(s, { opacity: 0, duration: 0.8 }, 1.4);
      });
    },
    { scope: root, dependencies: [phase] },
  );

  if (phase === "bless")
    return (
      <div ref={root} className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 pt-20 pb-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(247,181,24,0.35),rgba(255,107,61,0.12)_40%,transparent_70%)]" />
        <div
          className="rays pointer-events-none absolute top-[20%] left-1/2 aspect-square w-[160vmax] -translate-x-1/2 -translate-y-1/2 opacity-40"
          style={{ background: "repeating-conic-gradient(from 0deg, rgba(255,216,115,0.35) 0deg 6deg, transparent 6deg 18deg)", maskImage: "radial-gradient(circle, black, transparent 60%)" }}
        />
        <div className="relative max-w-2xl text-center">
          <Diya className="mx-auto w-44 drop-shadow-[0_0_30px_rgba(255,163,26,0.55)] sm:w-56" />
          <div className="bless-in mt-2 text-xs font-semibold tracking-[0.35em] text-gold-soft uppercase">A blessing from the Divine Mother</div>
          <p className="bless-in mt-4 text-xl leading-relaxed whitespace-pre-line text-gold-soft sm:text-2xl">{BLESSING.shloka}</p>
          <p className="bless-in mt-2 text-sm whitespace-pre-line text-muted italic">{BLESSING.transliteration}</p>
          <p className="bless-in mt-1 text-sm text-muted">{BLESSING.meaning}</p>
          <p className="bless-in glass mt-6 rounded-3xl px-6 py-5 font-display text-lg leading-relaxed sm:text-xl">{BLESSING.message}</p>
          <button className="bless-in btn-gold mt-8 text-lg" onClick={onDone}>
            🙏 Receive the blessing
          </button>
        </div>
      </div>
    );

  return (
    <div ref={root} className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-4 pt-20 pb-28 text-center">
      <div className="relative w-full max-w-[260px] sm:max-w-[320px]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="heal-ring absolute inset-[10%] rounded-full border-2 border-emerald/70" />
        ))}
        <div className="heal-earth relative">
          <Earth health={health} className="w-full drop-shadow-[0_0_70px_rgba(43,217,159,0.45)]" />
        </div>
      </div>
      <div className="mt-5 space-y-1 font-display text-xl sm:text-2xl">
        {STEPS.map((s) => (
          <p key={s} className="heal-step">
            {s}
          </p>
        ))}
      </div>
      <div className="heal-cta mt-8">
        <p className="text-lg text-muted">
          Planet Earth: <b className="text-emerald">100% healed</b>. Root cause: <i>finally</i> addressed.
        </p>
        <button className="btn-gold mt-5 text-lg" onClick={() => setPhase("bless")}>
          Someone wants to bless you ✨
        </button>
      </div>
    </div>
  );
}
