import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Earth from "./Earth";
import { MitoFace } from "./Mito";

gsap.registerPlugin(useGSAP);

const LINES = [
  "📅 25 October 2026. Planet Earth has a fever. 🌡️",
  "Diagnosis: chronic inflammation, leaky soil, blood sugar on a rollercoaster and about 200 years without proper sleep.",
  "The culprits: the Sugar Syndicate. Lord Glucose Spike 🍩, Baron Seed Oil 🍟 and Count Cortisol ⏰.",
  "Conventional medicine prescribed… more plastic. It did not help.",
  "Only one person on Earth always asks the right question: \"But what's the ROOT CAUSE?\"",
];

export default function Briefing({ onGo }: { onGo: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(".brief-earth", { scale: 0.5, opacity: 0, duration: 1.2, ease: "back.out(1.4)" })
        .to(".brief-earth", { x: -6, duration: 0.08, repeat: 7, yoyo: true }, "-=0.2")
        .from(".brief-line", { opacity: 0, y: 16, duration: 0.6, stagger: 0.9 }, "-=0.2")
        .from(".brief-rest", { opacity: 0, y: 20, duration: 0.6, stagger: 0.15 }, "+=0.2");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mx-auto grid min-h-dvh max-w-6xl items-center gap-8 px-4 pt-24 pb-28 md:grid-cols-[0.9fr_1.1fr]">
      <div className="brief-earth relative mx-auto w-full max-w-[380px]">
        <Earth health={0.05} className="w-full drop-shadow-[0_0_60px_rgba(255,77,46,0.35)]" />
        <div className="absolute -top-2 right-2 rotate-6 rounded-lg bg-ember px-3 py-1 text-sm font-bold text-night shadow-lg">Patient: Gaia · Temp 104°F</div>
      </div>
      <div>
        <div className="text-xs font-semibold tracking-[0.25em] text-ember uppercase">Mission briefing</div>
        <div className="mt-3 space-y-3 text-lg leading-relaxed">
          {LINES.map((l) => (
            <p key={l} className="brief-line">
              {l}
            </p>
          ))}
        </div>
        <p className="brief-rest mt-5 font-display text-2xl leading-snug sm:text-3xl">
          Agent Mugdha, Gaia needs her <span className="text-shine font-semibold">Chief Healing Officer.</span>
        </p>
        <div className="brief-rest glass mt-6 flex items-start gap-3 rounded-2xl p-4 text-sm text-muted">
          <MitoFace className="h-12 w-14 shrink-0" mood="love" />
          <p>
            Hi! I&apos;m <b className="text-cream">Mito</b>, your friendly neighbourhood mitochondrion. Stuck? Press <b className="text-gold">💡 Hint</b>. Really stuck? There&apos;s a
            secret <b className="text-gold">CEO button</b> for that. Every solved puzzle gives you a <b className="text-cream">Seed Letter</b>, and there are{" "}
            <b className="text-cream">gifts</b> hidden at the end of each level. 🎁
          </p>
        </div>
        <button className="brief-rest cursor-pointer btn-gold mt-7 text-lg" onClick={onGo}>
          Let&apos;s heal this planet →
        </button>
      </div>
    </div>
  );
}
