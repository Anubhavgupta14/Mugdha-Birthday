import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { sound } from "@/game/audio";
import { say, pick } from "@/game/mito";
import { LEVELS, type PuzzleMeta } from "@/game/puzzles";

export type PuzzleApi = { onSolve: () => void; hintsUsed: number };

const OVERRIDE_LINES = [
  "Delegated. The team will have it done by EOD. (They always do.)",
  "CEO Override accepted. Someone in the team just got a 2 AM Slack message.",
  "Override granted. Executive privilege: 100% legal, 0% guilt.",
];

export default function PuzzleShell({
  meta,
  step,
  total,
  onDone,
  children,
}: {
  meta: PuzzleMeta;
  step: number;
  total: number;
  onDone: () => void;
  children: (api: PuzzleApi) => ReactNode;
}) {
  const [hintsUsed, setHintsUsed] = useState(0);
  const [solved, setSolved] = useState(false);
  const [overridden, setOverridden] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const level = LEVELS[meta.level];

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".ps-in", { y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!solved || !win.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".win-card", { scale: 0.7, opacity: 0, duration: 0.6, ease: "back.out(1.8)" })
        .from(".win-letter", { scale: 0, rotate: -200, duration: 0.9, ease: "elastic.out(1, 0.5)" }, "-=0.2")
        .from(".win-rest", { y: 14, opacity: 0, stagger: 0.1, duration: 0.4 }, "-=0.5");
    }, win);
    return () => ctx.revert();
  }, [solved]);

  const onSolve = () => {
    if (solved) return;
    sound.play("success");
    setTimeout(() => sound.play("unlock"), 450);
    setSolved(true);
    say(meta.solvedLine, "laugh", 7000);
  };

  const takeHint = () => {
    if (hintsUsed >= 3) return;
    sound.play("chime");
    const n = hintsUsed + 1;
    setHintsUsed(n);
    say(meta.hints[n - 1], n === 3 ? "love" : "think", 12000);
  };

  const override = () => {
    sound.play("whoosh");
    setOverridden(true);
    say(pick(OVERRIDE_LINES), "laugh", 7000);
    setTimeout(onSolve, 700);
  };

  return (
    <div ref={root} className="mx-auto w-full max-w-5xl px-4 pt-20 pb-36 sm:pt-24">
      <div className="ps-in mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: level.color }}>
        <span>
          Level {meta.level} · {level.name}
        </span>
        <span className="text-muted">
          Puzzle {step}/{total}
        </span>
      </div>
      <h2 className="ps-in font-display text-3xl leading-tight font-semibold sm:text-4xl">{meta.title}</h2>
      <p className="ps-in mt-2 max-w-3xl text-[1.02rem] leading-relaxed text-muted">{meta.brief}</p>

      <div className="ps-in mt-6">{children({ onSolve, hintsUsed })}</div>

      {hintsUsed > 0 && (
        <ol className="ps-in mt-6 space-y-2">
          {meta.hints.slice(0, hintsUsed).map((h, i) => (
            <li key={i} className="glass flex gap-3 rounded-xl px-4 py-3 text-sm">
              <span className="shrink-0 font-semibold text-gold">Hint {i + 1}</span>
              <span>{h}</span>
            </li>
          ))}
        </ol>
      )}

      {!solved && (
        <div className="mt-8 flex flex-col items-end gap-2 sm:fixed sm:right-6 sm:bottom-6 sm:z-30 sm:mt-0">
          {hintsUsed >= 3 && (
            <button onClick={override} className="btn-gold text-sm" disabled={overridden}>
              👑 CEO Override: delegate to the team
            </button>
          )}
          <button onClick={takeHint} disabled={hintsUsed >= 3} className="btn-ghost glass text-sm disabled:opacity-50">
            💡 {hintsUsed >= 3 ? "No hints left" : `Hint (${3 - hintsUsed} left)`}
          </button>
        </div>
      )}

      {solved && (
        <div ref={win} className="fixed inset-0 z-40 grid place-items-center bg-night/70 p-4 backdrop-blur-sm">
          <div className="win-card glass w-full max-w-md rounded-3xl p-7 text-center">
            <div className="win-rest text-xs font-semibold tracking-[0.25em] text-emerald uppercase">Puzzle solved</div>
            <div className="win-rest mt-1 font-display text-2xl">You found a Seed Letter</div>
            <div className="win-letter mx-auto my-5 grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-gold-soft to-gold font-display text-6xl font-bold text-night shadow-[0_0_50px_rgba(247,181,24,0.6)]">
              {meta.letter}
            </div>
            <p className="win-rest text-sm text-muted">Keep it safe. All six letters open the Final Gate.</p>
            <p className="win-rest mt-2 text-sm text-emerald">🌍 Earth&apos;s health is going up</p>
            <button onClick={onDone} className="win-rest btn-gold mt-6">
              Onwards →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
