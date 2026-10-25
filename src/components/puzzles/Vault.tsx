import { useRef, useState } from "react";
import gsap from "gsap";
import { sound } from "@/game/audio";
import { say, pick } from "@/game/mito";
import type { PuzzleApi } from "../PuzzleShell";

const CODE = [7, 4, 9, 8];

const CLUES = [
  { sym: "🛡️", title: "The Gut Garrison", text: "Roughly this many tens of percent of your immune system lives in your gut. Write the tens digit." },
  { sym: "☀️", title: "The Sunshine Gang", text: "Vitamin D runs with a gang that dissolves in fat, not water. Count the whole gang, D included." },
  { sym: "🧬", title: "The Non-Negotiables", text: "Amino acids your body cannot make, so you MUST eat them. How many?" },
  { sym: "🅱️", title: "The B-Team", text: "B1 to B12, but B4, B8, B10 and B11 got kicked off the team. How many B vitamins are left?" },
];

const WRONG = [
  "Vault says no. Baron Seed Oil is laughing in hydrogenated.",
  "BZZT. Wrong code. Even the vault has trust issues.",
  "Not quite! Tip: each riddle is a textbook number. You literally teach this stuff 😄",
];

export default function Vault({ onSolve }: PuzzleApi) {
  const [digits, setDigits] = useState([0, 0, 0, 0]);
  const [open, setOpen] = useState(false);
  const [tries, setTries] = useState(0);
  const door = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const spin = (i: number, d: number) => {
    if (open) return;
    sound.play("click");
    setDigits((ds) => ds.map((v, j) => (j === i ? (v + d + 10) % 10 : v)));
  };

  const tryOpen = () => {
    if (open) return;
    if (digits.every((d, i) => d === CODE[i])) {
      setOpen(true);
      sound.play("unlock");
      const tl = gsap.timeline({ onComplete: onSolve });
      tl.to(".vault-wheel", { rotate: 540, duration: 1.1, ease: "power2.inOut" })
        .to(door.current, { rotateY: -105, duration: 1.3, ease: "power3.inOut", transformOrigin: "left center" }, "-=0.2")
        .from(".bug", { scale: 0, opacity: 0, stagger: 0.04, duration: 0.5, ease: "back.out(3)" }, "-=0.6");
    } else {
      setTries((t) => t + 1);
      sound.play("error");
      say(tries >= 2 ? WRONG[2] : pick(WRONG.slice(0, 2)), "shock");
      if (panel.current) {
        panel.current.classList.remove("shake");
        void panel.current.offsetWidth;
        panel.current.classList.add("shake");
      }
    }
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        {CLUES.map((c) => (
          <div key={c.sym} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{c.sym}</span>
              <span className="font-display text-lg font-semibold">{c.title}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <div className="relative aspect-square w-full max-w-[380px]" style={{ perspective: 1200 }}>
          {/* what's behind the door */}
          <div className="absolute inset-[6%] grid place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle,#1d6b4f,#082a20)] shadow-inner">
            <div className="flex max-w-[70%] flex-wrap justify-center gap-1 text-3xl">
              {Array.from("🦠🧫🦠🌿🦠🧫🦠🌱🦠🧫🦠🌿").map((b, i) => (
                <span key={i} className="bug inline-block">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div
            ref={door}
            className="absolute inset-0 rounded-full border-[10px] border-[#8a6d2e] bg-[radial-gradient(circle_at_35%_30%,#d9b85c,#8a6d2e_55%,#4d3a12)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(0,0,0,0.5)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* rivets */}
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                className="absolute h-3 w-3 rounded-full bg-[#5c461a] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"
                style={{ left: `${50 + 45 * Math.cos((i / 16) * Math.PI * 2)}%`, top: `${50 + 45 * Math.sin((i / 16) * Math.PI * 2)}%`, transform: "translate(-50%,-50%)" }}
              />
            ))}
            <svg viewBox="0 0 100 100" className="vault-wheel absolute inset-[28%] opacity-70">
              <circle cx="50" cy="50" r="12" fill="#4d3a12" />
              {[0, 60, 120].map((a) => (
                <rect key={a} x="46" y="6" width="8" height="88" rx="4" fill="#4d3a12" transform={`rotate(${a} 50 50)`} />
              ))}
            </svg>
            <div className="absolute inset-x-0 top-[11%] text-center font-regal text-[0.65rem] tracking-[0.3em] text-[#3d2c0b] sm:text-xs">BARON SEED OIL&apos;S VAULT</div>
            <div className="absolute inset-x-0 bottom-[12%] text-center text-[0.65rem] tracking-widest text-[#3d2c0b]">no good bugs allowed</div>
          </div>
        </div>

        <div ref={panel} className="glass mt-5 flex items-end gap-2 rounded-2xl p-3 sm:gap-3">
          {digits.map((d, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="mb-1 text-xl">{CLUES[i].sym}</span>
              <button onClick={() => spin(i, 1)} className="h-7 w-12 rounded-t-lg bg-white/10 text-sm hover:bg-white/20" aria-label={`Increase digit ${i + 1}`}>
                ▲
              </button>
              <div className="grid h-14 w-12 place-items-center bg-black/50 font-mono text-3xl text-gold-soft tabular-nums">{d}</div>
              <button onClick={() => spin(i, -1)} className="h-7 w-12 rounded-b-lg bg-white/10 text-sm hover:bg-white/20" aria-label={`Decrease digit ${i + 1}`}>
                ▼
              </button>
            </div>
          ))}
          <button onClick={tryOpen} disabled={open} className="btn-gold ml-1 self-center !px-4 sm:!px-6">
            {open ? "🔓" : "Open"}
          </button>
        </div>
      </div>
    </div>
  );
}
