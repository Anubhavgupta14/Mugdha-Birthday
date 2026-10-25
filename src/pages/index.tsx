import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Starfield from "@/components/Starfield";
import HUD from "@/components/HUD";
import Mito from "@/components/Mito";
import Intro from "@/components/Intro";
import Briefing from "@/components/Briefing";
import LevelIntro from "@/components/LevelIntro";
import PuzzleShell from "@/components/PuzzleShell";
import FinalGate from "@/components/FinalGate";
import Healing from "@/components/Healing";
import Finale from "@/components/Finale";
import Gutder from "@/components/puzzles/Gutder";
import Vault from "@/components/puzzles/Vault";
import CipherWheel from "@/components/puzzles/CipherWheel";
import SugarCurve from "@/components/puzzles/SugarCurve";
import Diagnosis from "@/components/puzzles/Diagnosis";
import Elements from "@/components/puzzles/Elements";
import PhoenixGift from "@/components/gifts/PhoenixGift";
import DragonGift from "@/components/gifts/DragonGift";
import ManifestGift from "@/components/gifts/ManifestGift";
import { sound } from "@/game/audio";
import { hush, say } from "@/game/mito";
import { LEVELS, PUZZLES, type PuzzleId } from "@/game/puzzles";
import type { PuzzleApi } from "@/components/PuzzleShell";

const STAGES = [
  "intro",
  "briefing",
  "level1",
  "gutder",
  "vault",
  "gift1",
  "level2",
  "cipher",
  "sugar",
  "gift2",
  "level3",
  "diagnosis",
  "elements",
  "gift3",
  "gate",
  "healing",
  "finale",
] as const;
type Stage = (typeof STAGES)[number];

const PUZZLE_UI: Record<PuzzleId, (api: PuzzleApi) => React.ReactNode> = {
  gutder: (api) => <Gutder {...api} />,
  vault: (api) => <Vault {...api} />,
  cipher: (api) => <CipherWheel {...api} />,
  sugar: (api) => <SugarCurve {...api} />,
  diagnosis: (api) => <Diagnosis {...api} />,
  elements: (api) => <Elements {...api} />,
};

const SAVE_KEY = "mugdha-quest-v1";

export default function Home() {
  const [idx, setIdx] = useState(0);
  const [saved, setSaved] = useState(0);
  const stage: Stage = STAGES[idx];
  const view = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ?stage=vault jumps straight to a stage (handy for previewing)
    const jump = STAGES.indexOf(new URLSearchParams(window.location.search).get("stage") as Stage);
    if (jump > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIdx(jump);
      return;
    }
    try {
      const n = Number(localStorage.getItem(SAVE_KEY) ?? 0);
       
      if (n > 1 && n < STAGES.length) setSaved(n);
    } catch {}
  }, []);

  const go = (n: number) => {
    sound.unlock();
    hush();
    // opacity only: a transform on <main> would trap the gifts' position:fixed overlays
    gsap.to(view.current, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        setIdx(n);
        window.scrollTo({ top: 0 });
        try {
          localStorage.setItem(SAVE_KEY, String(n));
        } catch {}
        gsap.fromTo(view.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out", clearProps: "all" });
      },
    });
  };
  const next = () => go(idx + 1);

  const start = () => {
    sound.unlock();
    sound.startAmbient();
    go(1);
  };
  const resume = () => {
    sound.unlock();
    sound.startAmbient();
    go(saved);
  };

  useEffect(() => {
    if (stage === "level1") say("Level 1! Fun fact: there are more microbes in your gut than stars in the Milky Way. No pressure. 😄", "happy", 7000);
    if (stage === "level2") say("Level 2. I'm a little nervous: this one is about my home turf, energy. ⚡", "think", 7000);
    if (stage === "level3") say("Final level! Count Cortisol is guarding it. He hasn't slept since 1820. Be gentle.", "laugh", 7000);
    if (stage === "gate") say("Six seed letters. One word. You've got this, CHO! 🌱", "love", 6000);
  }, [stage]);

  const solvedCount = PUZZLES.filter((p) => STAGES.indexOf(p.id) < idx).length;
  const health = stage === "healing" || stage === "finale" ? 1 : 0.05 + solvedCount * 0.12;
  const letters = PUZZLES.filter((p) => STAGES.indexOf(p.id) < idx).map((p) => p.letter);
  const levelNow = idx <= STAGES.indexOf("gift1") ? 1 : idx <= STAGES.indexOf("gift2") ? 2 : 3;
  const tint = stage === "finale" || stage === "healing" ? "#2bd99f" : idx < 2 ? "#f7b518" : LEVELS[levelNow].color;

  const puzzle = PUZZLES.find((p) => p.id === stage);

  return (
    <>
      <Head>
        <title>Operation: Heal Planet Earth · Happy Birthday Mugdha</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,#2a1650_0%,#0b0820_55%,#05040f_100%)]" />
      <Starfield tint={tint} />
      {stage !== "intro" && <HUD health={health} letters={letters} />}
      {stage !== "intro" && <Mito />}

      <main ref={view}>
        {stage === "intro" && <Intro onStart={start} canResume={saved > 0} onResume={resume} />}
        {stage === "briefing" && <Briefing onGo={next} />}
        {stage === "level1" && <LevelIntro level={1} health={health} onGo={next} />}
        {stage === "level2" && <LevelIntro level={2} health={health} onGo={next} />}
        {stage === "level3" && <LevelIntro level={3} health={health} onGo={next} />}
        {puzzle && (
          <PuzzleShell key={puzzle.id} meta={puzzle} step={(PUZZLES.indexOf(puzzle) % 2) + 1} total={2} onDone={next}>
            {PUZZLE_UI[puzzle.id]}
          </PuzzleShell>
        )}
        {stage === "gift1" && <PhoenixGift onContinue={next} />}
        {stage === "gift2" && <DragonGift onContinue={next} />}
        {stage === "gift3" && <ManifestGift onContinue={next} />}
        {stage === "gate" && <FinalGate onSolve={next} />}
        {stage === "healing" && <Healing onDone={next} />}
        {stage === "finale" && (
          <Finale
            onReplay={() => {
              try {
                localStorage.removeItem(SAVE_KEY);
              } catch {}
              setSaved(0);
              go(0);
            }}
          />
        )}
      </main>
    </>
  );
}
