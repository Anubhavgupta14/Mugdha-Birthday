import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LEVELS } from "@/game/puzzles";
import Earth from "./Earth";

gsap.registerPlugin(useGSAP);

export default function LevelIntro({ level, health, onGo }: { level: 1 | 2 | 3; health: number; onGo: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const L = LEVELS[level];

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".lv-num", { scale: 3, opacity: 0, duration: 1, ease: "expo.out" })
        .from(".lv-in", { y: 24, opacity: 0, stagger: 0.12, duration: 0.7 }, "-=0.4")
        .from(".lv-earth", { scale: 0.6, opacity: 0, duration: 1 }, "-=0.8");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-4 pt-20 pb-28 text-center">
      <div className="lv-num font-display text-[7rem] leading-none font-black sm:text-[10rem]" style={{ color: L.color, textShadow: `0 0 60px ${L.color}88` }}>
        {level}
      </div>
      <div className="lv-in text-xs font-semibold tracking-[0.3em] text-muted uppercase">Level {level} of 3</div>
      <h2 className="lv-in mt-2 font-display text-4xl font-bold sm:text-5xl">
        {L.emoji} {L.name}
      </h2>
      <p className="lv-in mt-3 text-lg text-muted">{L.tagline}</p>
      <div className="lv-earth my-6 w-40">
        <Earth health={health} />
      </div>
      <p className="lv-in glass max-w-xl rounded-2xl px-5 py-4 text-base italic">{L.villain}</p>
      <button className="lv-in cursor-pointer btn-gold mt-8 text-lg" onClick={onGo}>
        Enter Level {level} →
      </button>
    </div>
  );
}
