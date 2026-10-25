import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { sound } from "@/game/audio";
import { say } from "@/game/mito";
import type { PuzzleApi } from "../PuzzleShell";

type ItemId = "carbs" | "walk" | "fibre" | "protein";
const ITEMS: Record<ItemId, { emoji: string; name: string; sub: string }> = {
  carbs: { emoji: "🍚", name: "Carbs", sub: "rice, roti" },
  walk: { emoji: "🚶‍♀️", name: "10-min walk", sub: "gentle stroll" },
  fibre: { emoji: "🥗", name: "Fibre", sub: "salad, sabzi" },
  protein: { emoji: "🍳", name: "Protein & fat", sub: "paneer, eggs, dal" },
};
const START: ItemId[] = ["carbs", "walk", "fibre", "protein"];

const BASE = 88;
const TARGET = 120;

/** A toy glucose model. Order matters: fibre and protein before carbs blunt the spike, and a walk after helps too. */
function riseFor(order: ItemId[]) {
  const pos = (id: ItemId) => order.indexOf(id);
  const c = pos("carbs");
  let rise = 85;
  if (pos("fibre") < c) rise *= 0.7;
  if (pos("protein") < c) rise *= 0.75;
  if (pos("walk") > c) rise *= 0.8;
  if (pos("fibre") < pos("protein")) rise *= 0.85;
  return rise;
}

const W = 600;
const H = 260;
const yOf = (g: number) => H - ((g - 60) / (200 - 60)) * H;
const xOf = (t: number) => (t / 180) * W;

function glucose(t: number, rise: number) {
  const tp = 30 + (85 - rise) * 0.4; // flatter curves peak later
  const f = (t / tp) * Math.exp(1 - t / tp);
  const crash = rise > 40 ? (rise - 40) * 0.6 * Math.exp(-Math.pow((t - tp * 3) / 25, 2)) : 0;
  return BASE + rise * f - crash;
}

function pathFor(rise: number) {
  let d = "";
  for (let t = 0; t <= 180; t += 3) d += `${t === 0 ? "M" : "L"}${xOf(t).toFixed(1)} ${yOf(glucose(t, rise)).toFixed(1)} `;
  return d;
}

export default function SugarCurve({ onSolve }: PuzzleApi) {
  const [slots, setSlots] = useState<(ItemId | null)[]>([null, null, null, null]);
  const [peak, setPeak] = useState<number | null>(null);
  const line = useRef<SVGPathElement>(null);
  const area = useRef<SVGPathElement>(null);
  const rider = useRef<SVGGElement>(null);
  const shown = useRef({ rise: 85 });
  const solvedRef = useRef(false);

  const placed = slots.filter(Boolean) as ItemId[];
  const tray = START.filter((id) => !placed.includes(id));
  const full = placed.length === 4;

  const draw = () => {
    const r = shown.current.rise;
    const d = pathFor(r);
    line.current?.setAttribute("d", d);
    area.current?.setAttribute("d", `${d} L${W} ${H} L0 ${H} Z`);
    let best = 0;
    for (let t = 0; t <= 180; t += 1) if (glucose(t, r) > glucose(best, r)) best = t;
    rider.current?.setAttribute("transform", `translate(${xOf(best)} ${yOf(glucose(best, r)) - 6})`);
  };

  useEffect(() => {
    draw();
     
  }, []);

  useEffect(() => {
    if (!full) return;
    const rise = riseFor(placed);
    const p = BASE + rise;
    sound.play("whoosh");
    const tw = gsap.to(shown.current, { rise, duration: 1.6, ease: "elastic.out(1, 0.5)", onUpdate: draw });
    const t = setTimeout(() => {
      setPeak(p);
      if (p < TARGET) {
        if (!solvedRef.current) {
          solvedRef.current = true;
          say("Flat as a yoga mat. Lord Glucose Spike has nothing to ride! 🧘‍♀️", "love");
          setTimeout(onSolve, 1200);
        }
      } else {
        sound.play("error");
        if (p > 150) say("WHEEEE! 🎢 Lord Glucose Spike is surfing that curve. Gaia will be hangry in 2 hours.", "shock");
        else if (p > 130) say("Better… but there's still a crash coming. Gaia is eyeing the biscuit tin.", "think");
        else say("Sooo close! One tiny swap and it's flat.", "think");
      }
    }, 1300);
    return () => {
      tw.kill();
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, slots.join()]);

  const place = (id: ItemId) => {
    sound.play("click");
    setPeak(null);
    setSlots((s) => {
      const i = s.indexOf(null);
      if (i < 0) return s;
      const n = [...s];
      n[i] = id;
      return n;
    });
  };
  const unplace = (i: number) => {
    if (!slots[i]) return;
    sound.play("click");
    setPeak(null);
    setSlots((s) => s.map((v, j) => (j === i ? null : v)));
  };

  const danger = peak !== null && peak >= 140;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.3fr]">
      <div className="space-y-4">
        <div>
          <div className="mb-2 text-xs font-semibold tracking-[0.2em] text-muted uppercase">The plate (tap to add)</div>
          <div className="flex min-h-[92px] flex-wrap gap-2">
            {tray.map((id) => (
              <button key={id} onClick={() => place(id)} className="glass flex w-[calc(50%-4px)] items-center gap-2 rounded-2xl px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-gold sm:w-auto">
                <span className="text-3xl">{ITEMS[id].emoji}</span>
                <span>
                  <span className="block font-semibold">{ITEMS[id].name}</span>
                  <span className="block text-xs text-muted">{ITEMS[id].sub}</span>
                </span>
              </button>
            ))}
            {tray.length === 0 && <div className="self-center text-sm text-muted">Plate cleared. Tap a step below to swap it out.</div>}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Eating order</div>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {slots.map((id, i) => (
              <li key={i}>
                <button
                  onClick={() => unplace(i)}
                  className={`flex h-24 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed transition ${
                    id ? "border-gold bg-gold/10" : "border-white/20"
                  }`}
                >
                  <span className="text-[0.65rem] font-semibold tracking-widest text-muted uppercase">{["1st", "2nd", "3rd", "4th"][i]}</span>
                  {id ? (
                    <>
                      <span className="text-3xl">{ITEMS[id].emoji}</span>
                      <span className="text-xs">{ITEMS[id].name}</span>
                    </>
                  ) : (
                    <span className="text-2xl text-white/20">+</span>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="glass rounded-3xl p-4 sm:p-5">
        <div className="flex items-baseline justify-between">
          <div className="text-xs font-semibold tracking-[0.2em] text-rose uppercase">Gaia&apos;s glucose (mg/dL)</div>
          <div className={`font-mono text-sm ${peak === null ? "text-muted" : peak < TARGET ? "text-emerald" : danger ? "text-ember" : "text-gold"}`}>
            peak: {peak === null ? "—" : Math.round(peak)}
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full overflow-visible">
          <defs>
            <linearGradient id="gcFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#ff8fb1" stopOpacity="0.45" />
              <stop offset="1" stopColor="#ff8fb1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[80, 100, 120, 140, 160, 180].map((g) => (
            <g key={g}>
              <line x1="0" x2={W} y1={yOf(g)} y2={yOf(g)} stroke={g === TARGET ? "#2bd99f" : "#ffffff14"} strokeDasharray={g === TARGET ? "8 6" : undefined} strokeWidth={g === TARGET ? 2 : 1} />
              <text x="4" y={yOf(g) - 4} fill={g === TARGET ? "#2bd99f" : "#ffffff55"} fontSize="12">
                {g}
                {g === TARGET ? " · target" : ""}
              </text>
            </g>
          ))}
          <path ref={area} fill="url(#gcFill)" />
          <path ref={line} fill="none" stroke="#ff8fb1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <g ref={rider}>
            <text textAnchor="middle" fontSize="30" y="-4">
              🍩
            </text>
          </g>
          {[0, 60, 120, 180].map((t) => (
            <text key={t} x={xOf(t)} y={H + 18} fill="#ffffff66" fontSize="12" textAnchor={t === 0 ? "start" : t === 180 ? "end" : "middle"}>
              {t} min
            </text>
          ))}
        </svg>
        <p className="mt-6 text-xs text-muted">🍩 = Lord Glucose Spike, riding the peak. Leave him nothing to ride.</p>
      </div>
    </div>
  );
}
