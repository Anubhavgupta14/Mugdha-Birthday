import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { sound } from "@/game/audio";
import { say, pick } from "@/game/mito";
import type { PuzzleApi } from "../PuzzleShell";

const PAIRS = [
  { planet: { e: "🏜️", t: "Dead, eroded topsoil" }, body: { e: "🦠", t: "Gut dysbiosis" }, why: "Soil IS the planet's microbiome. No bugs, no nutrients." },
  { planet: { e: "🔥", t: "Wildfires that never stop" }, body: { e: "🌋", t: "Chronic inflammation" }, why: "A fire that was meant to heal, stuck in the 'on' position." },
  { planet: { e: "🧴", t: "Plastic-choked oceans" }, body: { e: "🧪", t: "Toxic overload (an overwhelmed liver)" }, why: "More toxins in than the detox pathways can clear." },
  { planet: { e: "🌾", t: "Endless monoculture farms" }, body: { e: "🍽️", t: "Eating the same 5 foods daily" }, why: "Low diversity means a fragile ecosystem, inside and out." },
  { planet: { e: "💡", t: "Cities that never switch off" }, body: { e: "🌙", t: "Circadian rhythm disruption" }, why: "Light at night confuses every clock, in cells and in cities." },
  { planet: { e: "🌫️", t: "Smog-filled skies" }, body: { e: "⚡", t: "Oxidative stress" }, why: "Too many free radicals, not enough antioxidants to clean up." },
];

const COLORS = ["#2bd99f", "#ff6b3d", "#6cc8ff", "#f7b518", "#c084fc", "#ff8fb1"];

const WRONG = [
  "Hmm, that's not its twin. Think: which body system does the same job?",
  "Interesting diagnosis, doctor… but no. Gaia wants a second opinion. 😅",
  "Nope! The Sugar Syndicate would've prescribed that one.",
];

export default function Diagnosis({ onSolve }: PuzzleApi) {
  const order = useMemo(() => [3, 0, 5, 1, 4, 2], []);
  const [sel, setSel] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const root = useRef<HTMLDivElement>(null);

  const pickPlanet = (i: number) => {
    if (matched.includes(i)) return;
    sound.play("click");
    setSel(i);
  };

  const pickBody = (j: number) => {
    if (matched.includes(j)) return;
    if (sel === null) {
      say("First pick a planetary symptom on the left, Doctor.", "think", 3500);
      return;
    }
    if (sel === j) {
      const next = [...matched, j];
      setMatched(next);
      setSel(null);
      sound.play("success");
      say(PAIRS[j].why, "happy", 5000);
      gsap.fromTo(root.current!.querySelectorAll(`[data-pair="${j}"]`), { scale: 1.08 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      if (next.length === PAIRS.length) setTimeout(onSolve, 1300);
    } else {
      sound.play("error");
      say(pick(WRONG), "shock", 4000);
      const el = root.current!.querySelector(`[data-body="${j}"]`);
      if (el) gsap.fromTo(el, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    }
  };

  return (
    <div ref={root} className="grid grid-cols-2 gap-3 sm:gap-6">
      <div>
        <div className="mb-2 text-xs font-semibold tracking-[0.2em] text-sky uppercase">🌍 Earth&apos;s symptoms</div>
        <div className="space-y-2">
          {PAIRS.map((p, i) => {
            const m = matched.includes(i);
            return (
              <button
                key={i}
                data-pair={m ? i : undefined}
                onClick={() => pickPlanet(i)}
                className={`flex w-full items-center gap-2 rounded-2xl border-2 px-3 py-3 text-left text-sm transition sm:gap-3 sm:text-base ${
                  m ? "" : sel === i ? "border-gold bg-gold/15" : "glass border-transparent hover:border-white/30"
                }`}
                style={m ? { borderColor: COLORS[i], background: `${COLORS[i]}22` } : undefined}
              >
                <span className="text-2xl sm:text-3xl">{p.planet.e}</span>
                <span className="leading-tight">{p.planet.t}</span>
                {m && <span className="ml-auto text-lg">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <div className="mb-2 text-xs font-semibold tracking-[0.2em] text-rose uppercase">🧍‍♀️ The body&apos;s twin</div>
        <div className="space-y-2">
          {order.map((j) => {
            const p = PAIRS[j];
            const m = matched.includes(j);
            return (
              <button
                key={j}
                data-body={j}
                data-pair={m ? j : undefined}
                onClick={() => pickBody(j)}
                className={`flex w-full items-center gap-2 rounded-2xl border-2 px-3 py-3 text-left text-sm transition sm:gap-3 sm:text-base ${
                  m ? "" : "glass border-transparent hover:border-white/30"
                }`}
                style={m ? { borderColor: COLORS[j], background: `${COLORS[j]}22` } : undefined}
              >
                <span className="text-2xl sm:text-3xl">{p.body.e}</span>
                <span className="leading-tight">{p.body.t}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="col-span-2 text-center text-sm text-muted">
        Root causes found: <b className="text-gold">{matched.length}</b> / {PAIRS.length}
      </div>
    </div>
  );
}
