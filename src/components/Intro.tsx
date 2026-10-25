import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ThriveSun from "./ThriveSun";
import { HERO } from "@/game/content";

gsap.registerPlugin(useGSAP);

export default function Intro({ onStart, canResume, onResume }: { onStart: () => void; canResume: boolean; onResume: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".sun-petals", { rotation: 360, svgOrigin: "100 100", duration: 60, repeat: -1, ease: "none" });
      gsap.to(".sun-glow", { scale: 1.08, opacity: 0.9, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".sun-wrap", { scale: 0.3, opacity: 0, duration: 1.6, ease: "expo.out" })
        .from(".hero-img", { y: 80, opacity: 0, duration: 1.2 }, "-=1.1")
        .from(".intro-in", { y: 30, opacity: 0, stagger: 0.12, duration: 0.8 }, "-=0.7");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative mx-auto grid min-h-dvh max-w-6xl items-center gap-4 px-4 pt-10 pb-24 md:grid-cols-[1.05fr_1fr] md:gap-10 md:pt-0">
      <div className="relative order-1 mx-auto aspect-[4/5] w-full max-w-[440px] md:order-2">
        <div className="sun-wrap absolute inset-x-[-8%] top-[-4%] aspect-square">
          <div className="sun-glow absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(247,181,24,0.55),rgba(247,181,24,0)_70%)] opacity-70 blur-2xl" />
          <ThriveSun className="absolute inset-0 h-full w-full drop-shadow-[0_0_40px_rgba(247,181,24,0.6)]" petalsClassName="sun-petals" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/mugdha-bust.webp"
          alt={HERO.fullName}
          className="hero-img absolute inset-x-[6%] bottom-0 w-[88%] [mask-image:linear-gradient(to_bottom,black_78%,transparent)]"
        />
      </div>

      <div className="order-2 text-center md:order-1 md:text-left">
        <p className="intro-in mt-5 font-hand text-2xl text-gold-soft">Incoming transmission for Agent {HERO.name}…</p>
        <h1 className="intro-in mt-1 font-display text-5xl leading-[0.95] font-bold sm:text-6xl lg:text-7xl">
          Operation:
          <br />
          <span className="text-shine">Heal Planet Earth</span>
        </h1>
        <p className="intro-in mx-auto mt-5 max-w-md text-lg text-muted md:mx-0">
          A birthday quest for <b className="text-cream">{HERO.fullName}</b>, {HERO.title}. 3 levels, 6 puzzles, a few dragons and one very sick planet.
        </p>
        <div className="intro-in mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
          {canResume ? (
            <>
              <button className="btn-gold text-lg" onClick={onResume}>
                Resume the mission →
              </button>
              <button className="btn-ghost" onClick={onStart}>
                Start over
              </button>
            </>
          ) : (
            <button className="btn-gold cursor-pointer text-lg" onClick={onStart}>
              Accept the mission 🌍
            </button>
          )}
        </div>
        <p className="intro-in mt-4 text-xs text-muted/70">🔊 Sound on for the full experience · ~20 minutes · hints included</p>
      </div>
    </div>
  );
}
