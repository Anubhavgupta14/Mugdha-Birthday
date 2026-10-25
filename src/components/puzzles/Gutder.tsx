import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { sound } from "@/game/audio";
import { say } from "@/game/mito";
import type { PuzzleApi } from "../PuzzleShell";

gsap.registerPlugin(Draggable);

type Food = { emoji: string; name: string; good: boolean; bio: string; line: string };

const FOODS: Food[] = [
  { emoji: "🥕", name: "Homemade Kanji", good: true, bio: "Fermented carrot drink. Tangy, Punjabi, 100% alive.", line: "Fermented, tangy and probiotic. The bugs are doing bhangra." },
  { emoji: "🧃", name: "\"100% Natural\" Packaged Juice", good: false, bio: "No added preservatives! (Just a whole lot of sugar.)", line: "A sugar bomb in a 'natural' costume. Lord Glucose Spike sends his thanks." },
  { emoji: "🧄", name: "Garlic & Onions", good: true, bio: "Smelly. Misunderstood. Rich in inulin.", line: "A prebiotic fibre buffet! (Apologies to everyone sitting near you.)" },
  { emoji: "🍪", name: "Low-fat 'Digestive' Biscuits", good: false, bio: "It literally says digestive on the pack.", line: "Refined flour, sugar and seed oils, wearing the word 'digestive' as a disguise." },
  { emoji: "🧈", name: "A Spoon of Ghee", good: true, bio: "Golden. Ancestral. Smells like Nani's kitchen.", line: "Butyrate, baby! The colon cells' favourite fuel." },
  { emoji: "💊", name: "Antibiotics for a Viral Cold", good: false, bio: "Just in case, na?", line: "Antibiotics don't touch viruses. They do flatten the good bugs." },
  { emoji: "🍌", name: "Raw Banana", good: true, bio: "Green, starchy and a bit shy.", line: "Resistant starch! The bugs ferment it like fine wine." },
  { emoji: "🥤", name: "Diet Soda (Zero Sugar!)", good: false, bio: "Zero calories, zero guilt, zero sugar.", line: "Artificial sweeteners can upset the microbiome. Zero sugar, zero friends." },
  { emoji: "🍲", name: "Slow-cooked Bone Broth", good: true, bio: "Simmered for 24 hours. Has patience.", line: "Glycine and collagen give the gut lining a warm hug." },
  { emoji: "🍟", name: "Samosa Fried in Reused Oil", good: false, bio: "Third time's the charm, says the oil.", line: "Oxidised seed oil means an inflammation party. Gaia is not invited." },
  { emoji: "🥗", name: "30 Different Plants a Week", good: true, bio: "Loves variety. Very inclusive.", line: "Diversity on the plate means diversity in the gut. Inclusive microbiome!" },
];

const WRONG_GOOD = ["Wait, you swiped LEFT on that? The microbes are filing a complaint with HR.", "Rejected?! That one was a keeper. The bugs are heartbroken."];
const WRONG_BAD = ["Swiped right on THAT? Gaia just bloated 3 sizes. 🫃", "Red flag! That's a Sugar Syndicate catfish. Gaia's gut is gurgling."];

export default function Gutder({ onSolve }: PuzzleApi) {
  const [deck, setDeck] = useState<Food[]>(FOODS);
  const [fed, setFed] = useState<Food[]>([]);
  const [binned, setBinned] = useState(0);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const deckRef = useRef(deck);
  const top = deck[0];
  const done = deck.length === 0;

  useEffect(() => {
    deckRef.current = deck;
  }, [deck]);

  useEffect(() => {
    if (done) {
      const t = setTimeout(onSolve, 900);
      return () => clearTimeout(t);
    }
  }, [done, onSolve]);

  const decide = (right: boolean) => {
    const food = deckRef.current[0];
    if (!food || busy.current || !card.current) return;
    busy.current = true;
    const correct = food.good === right;
    if (correct) {
      sound.play(right ? "success" : "whoosh");
      say(food.line, right ? "love" : "laugh", 5000);
      gsap.to(card.current, {
        x: right ? 520 : -520,
        rotate: right ? 30 : -30,
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          if (right) setFed((f) => [...f, food]);
          else setBinned((b) => b + 1);
          setDeck((d) => d.slice(1));
          busy.current = false;
        },
      });
    } else {
      sound.play(food.good ? "error" : "burp");
      setFlash("bad");
      say(food.good ? WRONG_GOOD[Math.random() < 0.5 ? 0 : 1] : WRONG_BAD[Math.random() < 0.5 ? 0 : 1], "shock", 5000);
      gsap
        .timeline({
          onComplete: () => {
            setFlash(null);
            // send it to the back of the deck for another go
            setDeck((d) => (d.length > 1 ? [...d.slice(1), d[0]] : d));
            busy.current = false;
          },
        })
        .to(card.current, { x: right ? 60 : -60, rotate: right ? 6 : -6, duration: 0.15 })
        .to(card.current, { x: 0, rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.35)" });
    }
  };

  const decideRef = useRef(decide);
  useEffect(() => {
    decideRef.current = decide;
  });

  useEffect(() => {
    if (!card.current) return;
    gsap.fromTo(card.current, { scale: 0.85, opacity: 0, x: 0, rotate: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" });
    const [d] = Draggable.create(card.current, {
      type: "x,y",
      bounds: area.current ?? undefined,
      edgeResistance: 0.6,
      onDrag() {
        gsap.set(this.target, { rotate: this.x / 14 });
        setFlash(this.x > 60 ? "good" : this.x < -60 ? "bad" : null);
      },
      onRelease() {
        setFlash(null);
        if (Math.abs(this.x) > 90) {
          gsap.set(this.target, { y: 0 });
          decideRef.current(this.x > 0);
        } else gsap.to(this.target, { x: 0, y: 0, rotate: 0, duration: 0.4, ease: "back.out(2)" });
      },
    });
    return () => {
      d.kill();
    };
  }, [top]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") decideRef.current(true);
      if (e.key === "ArrowLeft") decideRef.current(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goodTotal = FOODS.filter((f) => f.good).length;

  return (
    <div className="grid items-start gap-6 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col items-center">
        <div ref={area} className="relative flex h-[380px] w-full max-w-sm items-center justify-center overflow-visible">
          {deck[1] && <div className="glass absolute h-[330px] w-[86%] translate-y-3 scale-95 rounded-3xl opacity-60" />}
          {top ? (
            <div
              ref={card}
              key={top.name + deck.length}
              className={`absolute flex h-[340px] w-[88%] cursor-grab touch-none flex-col overflow-hidden rounded-3xl border-2 bg-gradient-to-b from-[#2b1d55] to-[#1a1238] shadow-2xl select-none active:cursor-grabbing ${
                flash === "good" ? "border-emerald" : flash === "bad" ? "border-ember" : "border-white/15"
              }`}
            >
              <div className="relative grid flex-1 place-items-center bg-[radial-gradient(circle_at_50%_40%,rgba(247,181,24,0.25),transparent_65%)] text-[7rem] leading-none">
                {top.emoji}
                {flash === "good" && <span className="absolute top-4 left-4 -rotate-12 rounded-lg border-4 border-emerald px-2 font-display text-2xl font-black text-emerald">FEED</span>}
                {flash === "bad" && <span className="absolute top-4 right-4 rotate-12 rounded-lg border-4 border-ember px-2 font-display text-2xl font-black text-ember">NOPE</span>}
              </div>
              <div className="bg-black/30 px-5 py-4">
                <div className="font-display text-xl font-semibold">{top.name}</div>
                <div className="text-sm text-muted">{top.bio}</div>
              </div>
            </div>
          ) : (
            <div className="text-center font-display text-2xl text-emerald">All matched! 💚</div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-6">
          <button onClick={() => decide(false)} disabled={done} aria-label="Swipe left: imposter" className="grid h-16 w-16 place-items-center rounded-full border-2 border-ember bg-ember/10 text-2xl transition hover:scale-110 hover:bg-ember/25">
            ❌
          </button>
          <span className="text-xs text-muted">drag, tap, or ← →</span>
          <button onClick={() => decide(true)} disabled={done} aria-label="Swipe right: feed the gut" className="grid h-16 w-16 place-items-center rounded-full border-2 border-emerald bg-emerald/10 text-2xl transition hover:scale-110 hover:bg-emerald/25">
            💚
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="text-xs font-semibold tracking-[0.2em] text-emerald uppercase">Gaia&apos;s microbiome</div>
        <div className="mt-1 font-display text-3xl">
          {fed.length}/{goodTotal} <span className="text-base text-muted">matches</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald to-leaf transition-all duration-700" style={{ width: `${(fed.length / goodTotal) * 100}%` }} />
        </div>
        <div className="mt-4 flex min-h-12 flex-wrap gap-1.5 text-2xl">
          {fed.map((f) => (
            <span key={f.name} title={f.name} className="animate-[bounce_1s_ease-in-out_2]">
              {f.emoji}
            </span>
          ))}
        </div>
        <div className="mt-4 border-t border-white/10 pt-3 text-sm text-muted">
          🗑️ Imposters returned to the Sugar Syndicate: <b className="text-cream">{binned}</b>
        </div>
      </div>
    </div>
  );
}
