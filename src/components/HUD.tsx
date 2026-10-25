import { useSyncExternalStore } from "react";
import { sound } from "@/game/audio";
import { FINAL_WORD } from "@/game/puzzles";
import ThriveSun from "./ThriveSun";

const useSound = () =>
  useSyncExternalStore(
    (f) => sound.subscribe(f),
    () => `${sound.muted}|${sound.ambientOn}`,
    () => "false|false",
  );

export default function HUD({ health, letters }: { health: number; letters: string[] }) {
  const [muted, ambient] = useSound().split("|").map((v) => v === "true");
  const pct = Math.round(health * 100);
  const color = health < 0.35 ? "#ff6b3d" : health < 0.7 ? "#f7b518" : "#2bd99f";

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/5 bg-night/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <ThriveSun className="h-7 w-7 shrink-0 animate-[spin_30s_linear_infinite]" />
        <span className="hidden font-display text-sm font-semibold tracking-wide md:block">Operation: Heal Planet Earth</span>

        <div className="ml-auto flex min-w-0 flex-1 items-center gap-2 md:ml-6 md:max-w-xs">
          <span className="text-lg" aria-hidden>
            {health < 0.35 ? "🤒" : health < 0.7 ? "😐" : "😊"}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between text-[0.6rem] font-semibold tracking-[0.15em] text-muted uppercase">
              <span>Gaia&apos;s health</span>
              <span style={{ color }}>{pct}%</span>
            </div>
            <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}` }} />
            </div>
          </div>
        </div>

        <div className="hidden gap-1 sm:flex" aria-label="Seed letters collected">
          {FINAL_WORD.split("").map((_, i) => (
            <span
              key={i}
              className={`grid h-7 w-6 place-items-center rounded-md font-display text-sm font-bold ${letters[i] ? "bg-gold text-night" : "border border-white/15 text-white/20"}`}
            >
              {letters[i] ?? "·"}
            </span>
          ))}
        </div>

        <button
          onClick={() => (ambient ? sound.stopAmbient() : sound.startAmbient())}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-base hover:bg-white/10"
          title={ambient ? "Pause ambient music" : "Play ambient music"}
          aria-label={ambient ? "Pause ambient music" : "Play ambient music"}
        >
          {ambient ? "🎶" : "🎵"}
        </button>
        <button
          onClick={() => sound.setMuted(!muted)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-base hover:bg-white/10"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>
    </header>
  );
}
