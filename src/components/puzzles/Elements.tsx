import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { sound } from "@/game/audio";
import { say, pick } from "@/game/mito";
import Earth from "../Earth";
import type { PuzzleApi } from "../PuzzleShell";

const ELEMENTS = [
  { e: "🌍", name: "Prithvi", en: "Earth", color: "#3fc46f" },
  { e: "💧", name: "Jal", en: "Water", color: "#38bdf8" },
  { e: "🔥", name: "Agni", en: "Fire", color: "#ff6b3d" },
  { e: "🌬️", name: "Vayu", en: "Air", color: "#e2e8f0" },
  { e: "✨", name: "Akasha", en: "Space", color: "#c084fc" },
];
const SEQ = [2, 0, 4, 1, 3];
const ROUNDS = [3, 4, 5];

type Phase = "idle" | "showing" | "input" | "won";

const OOPS = [
  "Count Cortisol cackles. Deep breath, 4-7-8, and let's watch again.",
  "Oops, the elements got shuffled. Even Gaia forgets things when she's stressed.",
  "Close! Rewatching it slowly, like a mindful meal.",
];

export default function Elements({ onSolve, hintsUsed }: PuzzleApi) {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [entered, setEntered] = useState(0);
  const [showNum, setShowNum] = useState<number | null>(null);
  const pads = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const slow = hintsUsed >= 2;
  const len = ROUNDS[round];

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const flash = (i: number) => {
    sound.elementTone(i);
    const el = pads.current[i];
    if (!el) return;
    gsap.fromTo(
      el,
      { scale: 1.18, boxShadow: `0 0 50px 12px ${ELEMENTS[i].color}`, filter: "brightness(1.6)" },
      { scale: 1, boxShadow: `0 0 0px 0px ${ELEMENTS[i].color}`, filter: "brightness(1)", duration: 0.7, ease: "power2.out" },
    );
  };

  const play = (r = round) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("showing");
    setEntered(0);
    const gap = slow ? 1100 : 700;
    for (let k = 0; k < ROUNDS[r]; k++) {
      timers.current.push(
        setTimeout(() => {
          flash(SEQ[k]);
          setShowNum(k + 1);
        }, 600 + k * gap),
      );
    }
    timers.current.push(
      setTimeout(() => {
        setShowNum(null);
        setPhase("input");
      }, 600 + ROUNDS[r] * gap),
    );
  };

  const press = (i: number) => {
    if (phase !== "input") return;
    flash(i);
    if (SEQ[entered] !== i) {
      sound.play("error");
      say(pick(OOPS), "shock", 4500);
      setPhase("showing");
      timers.current.push(setTimeout(() => play(), 1200));
      return;
    }
    const n = entered + 1;
    setEntered(n);
    if (n === len) {
      if (round === ROUNDS.length - 1) {
        setPhase("won");
        timers.current.push(setTimeout(onSolve, 900));
      } else {
        sound.play("success");
        say(round === 0 ? "Rhythm restored: 1/3! Gaia's heart rate variability just improved." : "2/3! Count Cortisol is sweating. Literally. Cortisol.", "happy", 4000);
        setPhase("showing");
        timers.current.push(
          setTimeout(() => {
            setRound(round + 1);
            play(round + 1);
          }, 1500),
        );
      }
    }
  };

  const R = 40; // % radius of the pad circle

  return (
    <div className="grid items-center gap-6 lg:grid-cols-[1fr_300px]">
      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        <div className="absolute inset-[27%]">
          <Earth health={0.45 + round * 0.12 + (phase === "won" ? 0.2 : 0)} face className="h-full w-full" />
        </div>
        {ELEMENTS.map((el, i) => {
          const a = ((i / 5) * 360 - 90) * (Math.PI / 180);
          return (
            <button
              key={el.name}
              ref={(n) => {
                pads.current[i] = n;
              }}
              onClick={() => press(i)}
              disabled={phase !== "input"}
              className="absolute flex h-[23%] w-[23%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 bg-night/80 transition-colors disabled:cursor-default"
              style={{ left: `${50 + R * Math.cos(a)}%`, top: `${50 + R * Math.sin(a)}%`, borderColor: el.color }}
            >
              <span className="text-3xl sm:text-4xl">{el.e}</span>
              <span className="text-[0.6rem] font-semibold tracking-wider sm:text-xs" style={{ color: el.color }}>
                {el.name}
              </span>
              {slow && <span className="text-[0.55rem] text-muted sm:text-[0.65rem]">{el.en}</span>}
            </button>
          );
        })}
        {showNum !== null && slow && (
          <div className="pointer-events-none absolute top-0 right-0 grid h-10 w-10 place-items-center rounded-full bg-gold font-bold text-night">{showNum}</div>
        )}
      </div>

      <div className="glass rounded-3xl p-5 text-center">
        <div className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Round {Math.min(round + 1, 3)} of 3</div>
        <div className="mt-2 flex justify-center gap-2">
          {ROUNDS.map((_, r) => (
            <span key={r} className={`h-2 w-10 rounded-full ${r < round || phase === "won" ? "bg-emerald" : r === round ? "bg-gold" : "bg-white/15"}`} />
          ))}
        </div>
        <div className="mt-4 min-h-12 font-display text-xl">
          {phase === "idle" && "Ready when you are."}
          {phase === "showing" && "Watch closely…"}
          {phase === "input" && `Your turn: ${entered}/${len}`}
          {phase === "won" && "Harmony restored ✨"}
        </div>
        <div className="mt-3 flex justify-center gap-2">
          {phase === "idle" && (
            <button className="btn-gold" onClick={() => play()}>
              Begin the sequence
            </button>
          )}
          {phase === "input" && (
            <button className="btn-ghost" onClick={() => play()}>
              ↻ Replay
            </button>
          )}
        </div>
        {hintsUsed >= 3 && (
          <div className="mt-4 rounded-xl bg-black/30 p-3 text-left text-sm">
            <div className="font-hand text-lg text-rose">Mito&apos;s cheat sheet:</div>
            {ROUNDS.map((n, r) => (
              <div key={r} className="text-muted">
                R{r + 1}: {SEQ.slice(0, n).map((k) => ELEMENTS[k].e).join(" → ")}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
