import { useRef, useState } from "react";
import gsap from "gsap";
import { sound } from "@/game/audio";
import { say } from "@/game/mito";
import { FINAL_WORD, LETTERS } from "@/game/puzzles";

export default function FinalGate({ onSolve }: { onSolve: () => void }) {
  const [slots, setSlots] = useState<(number | null)[]>(Array(6).fill(null));
  const [opened, setOpened] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);

  const used = slots.filter((s) => s !== null) as number[];

  const check = (next: (number | null)[]) => {
    if (next.some((s) => s === null)) return;
    const word = next.map((i) => LETTERS[i!]).join("");
    if (word === FINAL_WORD) {
      setOpened(true);
      sound.play("reveal");
      say("THRIVE. Of course it was THRIVE. It was always THRIVE. 😭💛", "love", 8000);
      const tl = gsap.timeline({ onComplete: onSolve });
      tl.to(".gate-slot", { backgroundColor: "#f7b518", color: "#0b0820", stagger: 0.08, duration: 0.3 })
        .to(".gate-slot", { y: -10, stagger: 0.06, yoyo: true, repeat: 1, duration: 0.25 })
        .to(".gate-left", { rotateY: 110, duration: 1.6, ease: "power3.inOut" }, "+=0.3")
        .to(".gate-right", { rotateY: -110, duration: 1.6, ease: "power3.inOut" }, "<")
        .to(".gate-light", { opacity: 1, scale: 1.6, duration: 1.4 }, "<0.3")
        .to(root.current, { opacity: 0, duration: 0.6 }, "+=0.2");
    } else {
      sound.play("error");
      say(
        word === "THRIEV" || word === "THIRVE"
          ? "SO close. Spell-check says: almost. 🙈"
          : `"${word}"? Lovely word, but the gate isn't convinced. Think about the business card…`,
        "think",
      );
      if (row.current) gsap.fromTo(row.current, { x: -10 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    }
  };

  const place = (i: number) => {
    if (opened || used.includes(i)) return;
    sound.play("click");
    const n = [...slots];
    const k = n.indexOf(null);
    if (k < 0) return;
    n[k] = i;
    setSlots(n);
    check(n);
  };

  const remove = (k: number) => {
    if (opened || slots[k] === null) return;
    sound.play("click");
    setSlots(slots.map((s, j) => (j === k ? null : s)));
  };

  return (
    <div ref={root} className="mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-4 pt-24 pb-32 text-center">
      <div className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">The Final Gate</div>
      <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">One word heals the planet</h2>
      <p className="mt-3 max-w-xl text-lg text-muted">
        &ldquo;What every cell, every human and one very lucky planet deserve to do.&rdquo;
        <br />
        <span className="font-hand text-xl text-gold-soft">(Psst: it&apos;s also on your business card.)</span>
      </p>

      <div className="relative mt-8 w-full max-w-lg" style={{ perspective: 1400 }}>
        <div className="gate-light pointer-events-none absolute inset-0 rounded-t-[50%] bg-[radial-gradient(circle,#fff7e6,#f7b518_40%,transparent_70%)] opacity-0" />
        <div className="relative flex h-64 overflow-hidden rounded-t-[50%] border-4 border-gold/60 sm:h-80">
          {["gate-left origin-left", "gate-right origin-right"].map((c, i) => (
            <div
              key={c}
              className={`${c} relative h-full w-1/2 bg-[linear-gradient(160deg,#3a2a12,#1f160a)] ${i === 0 ? "border-r" : "border-l"} border-gold/50`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-3 rounded-t-[60%] border border-gold/30" />
              <div className="absolute inset-0 grid place-items-center text-5xl opacity-70">{i === 0 ? "🌿" : "🌿"}</div>
            </div>
          ))}
        </div>
      </div>

      <div ref={row} className="mt-6 flex gap-1.5 sm:gap-2">
        {slots.map((s, k) => (
          <button
            key={k}
            onClick={() => remove(k)}
            className="gate-slot grid h-14 w-11 place-items-center rounded-xl border-2 border-gold/60 bg-black/40 font-display text-3xl font-bold text-gold-soft sm:h-16 sm:w-14"
            aria-label={s === null ? `Empty slot ${k + 1}` : `Remove ${LETTERS[s]}`}
          >
            {s === null ? "" : LETTERS[s]}
          </button>
        ))}
      </div>

      <div className="mt-6 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Your seed letters</div>
      <div className="mt-2 flex gap-2">
        {LETTERS.map((l, i) => (
          <button
            key={i}
            onClick={() => place(i)}
            disabled={used.includes(i) || opened}
            className="grid h-12 w-10 place-items-center rounded-lg bg-gradient-to-br from-gold-soft to-gold font-display text-2xl font-bold text-night shadow-[0_0_20px_rgba(247,181,24,0.45)] transition hover:-translate-y-1 disabled:opacity-20 disabled:shadow-none sm:h-14 sm:w-12"
          >
            {l}
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted/70">Tap letters to place them · tap a slot to take one back</p>
    </div>
  );
}
