import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import confetti from "canvas-confetti";
import ThriveSun from "./ThriveSun";
import Earth from "./Earth";
import SongCard from "./SongCard";
import { sound } from "@/game/audio";
import { say } from "@/game/mito";
import { ACHIEVEMENTS, HERO, NEXT_QUESTS, PLAYLIST, SONGS, WISHES } from "@/game/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const GIFTS = [
  { e: "🔥", t: "The Phoenix", s: "Rise, always" },
  { e: "🐉", t: "The Dragons", s: "Courage & Clarity" },
  { e: "💰", t: "₹25 Cr ARR", s: "Manifested" },
  { e: "🪷", t: "Divine Blessing", s: "From the Mother" },
  { e: "🌍", t: "A Healed Planet", s: "100% Gaia" },
];

function Counter({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const o = { v: 0 };
    gsap.to(o, {
      v: to,
      duration: 2.4,
      ease: "power2.out",
      scrollTrigger: { trigger: el.current, start: "top 90%" },
      onUpdate: () => {
        if (el.current) el.current.textContent = Math.round(o.v).toLocaleString("en-IN") + suffix;
      },
    });
  });
  return (
    <span ref={el} className={className}>
      0{suffix}
    </span>
  );
}

export default function Finale({ onReplay }: { onReplay: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [singing, setSinging] = useState(false);

  const sing = () => {
    if (singing) return;
    const release = sound.hold();
    const dur = sound.happyBirthday();
    setSinging(true);
    setTimeout(() => {
      setSinging(false);
      release();
    }, dur * 1000);
  };

  useEffect(() => {
    const t1 = setTimeout(() => {
      sing();
      say(`HAPPY BIRTHDAY, ${HERO.name.toUpperCase()}!!! 🎂 Every mitochondrion on this planet is throwing a party for you.`, "laugh", 9000);
    }, 1200);
    const fire = () => {
      const colors = ["#f7b518", "#ffd873", "#ff8fb1", "#2bd99f", "#fff7e6"];
      confetti({ particleCount: 140, spread: 100, origin: { y: 0.35 }, colors });
      confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors });
      confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors });
    };
    fire();
    const t2 = setTimeout(fire, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      gsap.to(".fin-petals", { rotation: 360, svgOrigin: "100 100", duration: 50, repeat: -1, ease: "none" });
      gsap.to(".fin-glow", { scale: 1.12, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".fin-sun", { scale: 0, rotate: -180, duration: 1.8, ease: "expo.out" })
        .from(".fin-photo", { y: 100, opacity: 0, duration: 1.3 }, "-=1.3")
        .from(".fin-title .text-shine", { y: 60, opacity: 0, rotateX: -80, stagger: 0.05, duration: 0.8 }, "-=0.8")
        .from(".fin-sub", { opacity: 0, y: 20, stagger: 0.15, duration: 0.7 }, "-=0.4");

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      gsap.utils.toArray<HTMLElement>(".ach").forEach((el, i) => {
        gsap.from(el, { x: i % 2 ? 60 : -60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
      });
      gsap.from(".timeline-line", { scaleY: 0, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 80%", end: "bottom 60%", scrub: true } });
    },
    { scope: root },
  );

  const title = `Happy Birthday, ${HERO.name}!`;

  return (
    <div ref={root} className="overflow-x-hidden">
      {/* hero */}
      <section className="relative mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center px-4 pt-20 pb-10 text-center">
        <div className="relative aspect-square w-full max-w-[520px]">
          <div className="fin-sun absolute inset-0">
            <div className="fin-glow absolute inset-[5%] rounded-full bg-[radial-gradient(circle,rgba(247,181,24,0.6),transparent_68%)] blur-2xl" />
            <ThriveSun className="absolute inset-[4%] h-[92%] w-[92%] drop-shadow-[0_0_50px_rgba(247,181,24,0.7)]" petalsClassName="fin-petals" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/mugdha-bust.webp"
            alt={HERO.fullName}
            className="fin-photo absolute bottom-0 left-1/2 w-[76%] -translate-x-1/2 [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
          />
        </div>
        <h1 className="fin-title -mt-6 font-display text-[2.6rem] leading-tight font-black sm:-mt-10 sm:text-7xl" style={{ perspective: 600 }}>
          {title.split(" ").map((word, w, words) => (
            <span key={w} className="inline-block whitespace-nowrap">
              {word.split("").map((ch, i) => (
                <span key={i} className="text-shine inline-block">
                  {ch}
                </span>
              ))}
              {w < words.length - 1 && "\u00a0"}
            </span>
          ))}
        </h1>
        <p className="fin-sub mt-3 font-hand text-3xl text-gold-soft">Chief Healing Officer of Planet Earth 🌍</p>
        <p className="fin-sub mt-2 max-w-xl text-lg text-muted">
          You healed the planet in one sitting. Typical. Now scroll down: there&apos;s a mission report, a hall of fame and a lot of love waiting for you.
        </p>
        <div className="fin-sub mt-6 flex flex-wrap justify-center gap-3">
          <button className="btn-gold" onClick={sing} disabled={singing}>
            {singing ? "🎵 Playing…" : "🎂 Play the birthday song"}
          </button>
          <a href="#soundtrack" className="btn-ghost">
            🎧 Your soundtrack
          </a>
        </div>
        <div className="fin-sub mt-10 animate-bounce text-2xl text-muted">↓</div>
      </section>

      {/* mission report */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="reveal text-center">
          <div className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase">Mission report</div>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Operation complete ✓</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-[1fr_1.4fr]">
          <div className="reveal glass flex items-center gap-5 rounded-3xl p-6">
            <Earth health={1} className="w-28 shrink-0 sm:w-36" />
            <div>
              <div className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Patient: Gaia</div>
              <div className="font-display text-5xl font-bold text-emerald">
                <Counter to={100} suffix="%" />
              </div>
              <div className="text-sm text-muted">healed. Fever gone. Microbiome thriving. Sleeping 8 hrs.</div>
            </div>
          </div>
          <div className="reveal grid grid-cols-2 gap-4">
            <div className="glass rounded-3xl p-5">
              <div className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Lives changed</div>
              <div className="font-display text-4xl font-bold text-gold">
                <Counter to={3000} suffix="+" />
              </div>
              <div className="text-sm text-muted">clients aged 2 to 75</div>
            </div>
            <div className="glass rounded-3xl p-5">
              <div className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Conditions reversed</div>
              <div className="font-display text-4xl font-bold text-rose">
                <Counter to={174} suffix="+" />
              </div>
              <div className="text-sm text-muted">at the root</div>
            </div>
            <div className="glass col-span-2 rounded-3xl p-5">
              <div className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Next stop</div>
              <div className="font-display text-4xl font-bold text-shine">
                <Counter to={1000000} />
              </div>
              <div className="text-sm text-muted">lives healed. 10 lakh. We&apos;re coming with you. 💛</div>
            </div>
          </div>
        </div>

        <div className="reveal mt-8">
          <div className="mb-3 text-center text-xs font-semibold tracking-[0.25em] text-muted uppercase">Gifts collected</div>
          <div className="flex flex-wrap justify-center gap-3">
            {GIFTS.map((g) => (
              <div key={g.t} className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
                <span className="text-3xl">{g.e}</span>
                <span className="text-left">
                  <span className="block font-semibold">{g.t}</span>
                  <span className="block text-xs text-muted">{g.s}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* hall of fame */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="reveal text-center">
          <div className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Hall of Fame</div>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Look what you&apos;ve built</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">A highlight reel. The real list is much longer, and it&apos;s written in thousands of healthier lives.</p>
        </div>
        <div className="timeline relative mt-12">
          <div className="timeline-line absolute top-0 bottom-0 left-5 w-0.5 bg-gradient-to-b from-gold via-rose to-emerald md:left-1/2 md:-translate-x-1/2" />
          <div className="space-y-6">
            {ACHIEVEMENTS.map((a, i) => (
              <div key={a.title} className={`ach relative flex items-start gap-4 pl-14 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-10" : "md:pr-10 md:pl-0 md:text-right"}`}>
                <span
                  className={`absolute top-3 left-5 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border-2 border-gold bg-night text-lg md:left-auto ${
                    i % 2 ? "md:left-0" : "md:right-0 md:translate-x-1/2"
                  }`}
                >
                  {a.icon}
                </span>
                <div className="glass w-full rounded-2xl p-4">
                  {a.year && <div className="text-xs font-semibold tracking-[0.2em] text-gold">{a.year}</div>}
                  <div className="font-display text-xl font-semibold">{a.title}</div>
                  <p className="mt-1 text-sm text-muted">{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {NEXT_QUESTS.map((q) => (
            <div key={q.title} className="reveal rounded-3xl border border-dashed border-gold/50 bg-gold/5 p-6">
              <div className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">Coming soon ✨</div>
              <div className="mt-2 font-display text-2xl font-bold">
                {q.icon} {q.title}
              </div>
              <p className="mt-1 text-muted">{q.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* wishes */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="reveal text-center">
          <div className="text-xs font-semibold tracking-[0.3em] text-rose uppercase">From the tribe</div>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Birthday wishes 💌</h2>
        </div>
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {WISHES.map((w, i) => (
            <figure
              key={i}
              className="reveal mb-4 break-inside-avoid rounded-3xl p-6 text-[#2a1530] shadow-xl"
              style={{ background: ["#fff7e6", "#ffe4ec", "#e6fff4", "#fff1c9", "#ece6ff"][i % 5], rotate: `${[-1.5, 1, -0.5, 1.5, -1][i % 5]}deg` }}
            >
              <blockquote className="font-hand text-2xl leading-snug">&ldquo;{w.text}&rdquo;</blockquote>
              <figcaption className="mt-3 text-sm font-semibold opacity-70">— {w.from}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* soundtrack */}
      <section id="soundtrack" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <div className="reveal text-center">
          <div className="text-xs font-semibold tracking-[0.3em] text-sky uppercase">Birthday soundtrack</div>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Songs for the healer 🎧</h2>
        </div>
        <div className="reveal mx-auto mt-10 max-w-2xl">
          <SongCard song={SONGS.heal} label="The anthem of this mission" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYLIST.filter((s) => s.id !== SONGS.heal.id).map((s) => (
            <div key={s.id} className="reveal">
              <SongCard song={s} label="Birthday mix" compact />
            </div>
          ))}
        </div>
      </section>

      <footer className="px-4 pt-10 pb-32 text-center">
        <ThriveSun className="mx-auto h-14 w-14 animate-[spin_40s_linear_infinite]" />
        <p className="mt-4 font-display text-2xl">With love, gratitude and a healed planet,</p>
        <p className="font-hand text-3xl text-gold-soft">Team iThrive · 25 October 2026</p>
        <button className="btn-ghost mt-8 text-sm" onClick={onReplay}>
          ↺ Replay the quest
        </button>
      </footer>
    </div>
  );
}
