import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { sound } from "@/game/audio";
import { say } from "@/game/mito";
import type { PuzzleApi } from "../PuzzleShell";

gsap.registerPlugin(Draggable);

const KEY = 9;
const PLAIN = "I POWER EVERY CELL. I WAS ONCE A FREE-LIVING BACTERIUM. ONLY YOUR MOTHER PASSED ME ON TO YOU. WHAT AM I?";
const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const STEP = 360 / 26;

const shiftText = (s: string, k: number) =>
  s.replace(/[A-Z]/g, (c) => A[(((c.charCodeAt(0) - 65 + k) % 26) + 26) % 26]);

const CIPHER = shiftText(PLAIN, KEY);

function Ring({ r, letters, color, size }: { r: number; letters: string; color: string; size: number }) {
  return (
    <>
      {letters.split("").map((ch, i) => {
        const a = ((i * STEP - 90) * Math.PI) / 180;
        return (
          <text
            key={ch}
            x={150 + r * Math.cos(a)}
            y={150 + r * Math.sin(a)}
            fill={color}
            fontSize={size}
            fontWeight={700}
            textAnchor="middle"
            dominantBaseline="central"
            transform={`rotate(${i * STEP} ${150 + r * Math.cos(a)} ${150 + r * Math.sin(a)})`}
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {ch}
          </text>
        );
      })}
    </>
  );
}

export default function CipherWheel({ onSolve }: PuzzleApi) {
  const [shift, setShift] = useState(0);
  const [answer, setAnswer] = useState("");
  const inner = useRef<HTMLDivElement>(null);
  const drag = useRef<Draggable | null>(null);
  const announced = useRef(false);
  const decoded = shiftText(CIPHER, -shift);
  const readable = shift === KEY;

  useEffect(() => {
    if (!inner.current) return;
    const [d] = Draggable.create(inner.current, {
      type: "rotation",
      snap: (v) => Math.round(v / STEP) * STEP,
      onDrag() {
        setShift(((Math.round(this.rotation / STEP) % 26) + 26) % 26);
      },
      onRelease() {
        const snapped = Math.round(this.rotation / STEP) * STEP;
        gsap.to(this.target, { rotation: snapped, duration: 0.25, onComplete: () => this.update() });
        setShift(((Math.round(snapped / STEP) % 26) + 26) % 26);
      },
    });
    drag.current = d;
    return () => {
      d.kill();
    };
  }, []);

  useEffect(() => {
    sound.play("click");
    if (shift === KEY && !announced.current) {
      announced.current = true;
      sound.play("chime");
      say("Wait… a riddle about something that powers every cell and comes from your mother? Why does this feel so… personal? 🥹", "love", 8000);
    }
  }, [shift]);

  const nudge = (d: number) => {
    if (!inner.current) return;
    const cur = Number(gsap.getProperty(inner.current, "rotation"));
    const next = Math.round(cur / STEP) * STEP + d * STEP;
    gsap.to(inner.current, { rotation: next, duration: 0.25, ease: "power2.out", onComplete: () => drag.current?.update() });
    setShift(((Math.round(next / STEP) % 26) + 26) % 26);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const a = answer.toUpperCase().replace(/[^A-Z]/g, "");
    if (a.includes("MITOCHONDRI")) {
      say("IT'S ME! I'm the answer! Best. Birthday. Ever. 🥳", "laugh");
      onSolve();
      return;
    }
    sound.play("error");
    if (a.includes("ATP")) say("So close! ATP is what I MAKE. What am I?", "think");
    else if (a.includes("SUN")) say("Aww, poetic. The sun powers the planet, but who powers your cells?", "think");
    else if (!readable) say("Spin the wheel first. Right now the message reads like Lord Glucose Spike's diet plan: nonsense.", "laugh");
    else say("Nope! Hint: it's small, bean-shaped and talking to you right now.", "shock");
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
      <div className="flex flex-col items-center">
        <div className="relative aspect-square w-full max-w-[360px] select-none">
          <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full">
            <defs>
              <radialGradient id="cwOuter" cx="50%" cy="50%" r="50%">
                <stop offset="0.6" stopColor="#3b1d5e" />
                <stop offset="1" stopColor="#1d1240" />
              </radialGradient>
            </defs>
            <circle cx="150" cy="150" r="148" fill="url(#cwOuter)" stroke="#f7b518" strokeWidth="2" />
            <Ring r={131} letters={A} color="#ffd873" size={15} />
            <circle cx="150" cy="150" r="116" fill="none" stroke="#f7b51866" />
            {/* reading window at the top */}
            <rect x="138" y="2" width="24" height="96" rx="12" fill="#f7b51822" stroke="#f7b518" strokeWidth="1.5" />
          </svg>
          <div ref={inner} className="absolute inset-[11%] cursor-grab touch-none rounded-full active:cursor-grabbing">
            <svg viewBox="0 0 300 300" className="h-full w-full">
              <circle cx="150" cy="150" r="148" fill="#2a8e6e" stroke="#8be38f" strokeWidth="3" />
              <circle cx="150" cy="150" r="106" fill="#1b5c48" />
              <Ring r={127} letters={A.toLowerCase()} color="#eafff4" size={22} />
              <text x="150" y="146" textAnchor="middle" fill="#8be38f" fontSize="18" fontWeight="700" letterSpacing="3">
                DRAG
              </text>
              <text x="150" y="170" textAnchor="middle" fill="#8be38f" fontSize="13" letterSpacing="2">
                TO DECODE
              </text>
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button className="btn-ghost" onClick={() => nudge(-1)} aria-label="Rotate left">
            ◀
          </button>
          <span className="w-28 text-center text-sm text-muted">
            shift <b className="font-mono text-lg text-gold">{shift}</b>
          </span>
          <button className="btn-ghost" onClick={() => nudge(1)} aria-label="Rotate right">
            ▶
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass rounded-2xl p-5">
          <div className="text-xs font-semibold tracking-[0.2em] text-rose uppercase">Intercepted transmission</div>
          <p className="mt-2 font-mono text-sm leading-relaxed tracking-wide break-words text-muted">{CIPHER}</p>
        </div>
        <div className={`rounded-2xl border p-5 transition-colors duration-500 ${readable ? "border-emerald bg-emerald/10" : "border-white/10 bg-black/20"}`}>
          <div className="text-xs font-semibold tracking-[0.2em] text-emerald uppercase">Decoded (live)</div>
          <p className={`mt-2 font-mono text-base leading-relaxed tracking-wide break-words ${readable ? "text-cream" : "text-muted/80"}`}>{decoded}</p>
        </div>
        <form onSubmit={submit} className="flex flex-wrap gap-2">
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer…"
            className="min-w-0 flex-1 rounded-full border border-white/20 bg-black/30 px-5 py-3 text-lg outline-none placeholder:text-muted/60 focus:border-gold"
          />
          <button className="btn-gold">Answer</button>
        </form>
      </div>
    </div>
  );
}
