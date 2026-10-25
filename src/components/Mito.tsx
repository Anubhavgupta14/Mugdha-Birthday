import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMito, type Mood } from "@/game/mito";

/** The little mitochondrion character. */
export function MitoFace({ mood = "happy", className }: { mood?: Mood; className?: string }) {
  const mouth: Record<Mood, string> = {
    happy: "M44 62 Q55 72 66 62",
    think: "M46 66 Q55 63 64 66",
    shock: "M51 64 a4 5 0 1 0 8 0 a4 5 0 1 0 -8 0",
    laugh: "M42 60 Q55 78 68 60 Z",
    love: "M44 62 Q55 72 66 62",
  };
  return (
    <svg viewBox="0 0 110 90" className={className} aria-hidden>
      <defs>
        <radialGradient id="mitoBody" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffb4a2" />
          <stop offset="1" stopColor="#ff6b6b" />
        </radialGradient>
      </defs>
      <ellipse cx="55" cy="47" rx="50" ry="36" fill="url(#mitoBody)" stroke="#c2410c" strokeWidth="3" />
      {/* cristae: the famous inner folds */}
      <path
        d="M14 47 C 20 30, 26 64, 32 40 S 44 66, 50 38 S 62 66, 68 38 S 80 66, 86 40 S 94 62, 97 47"
        fill="none"
        stroke="#ffd6cc"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <ellipse cx="55" cy="56" rx="22" ry="17" fill="#ffe1d6" opacity="0.92" />
      {mood === "love" ? (
        <>
          <path d="M41 44 l5 -5 a3 3 0 0 1 5 4 l-5 6 -5 -6 a3 3 0 0 1 0 0 Z" fill="#e11d48" transform="translate(-4 4)" />
          <path d="M60 44 l5 -5 a3 3 0 0 1 5 4 l-5 6 -5 -6 Z" fill="#e11d48" transform="translate(2 4)" />
        </>
      ) : mood === "laugh" ? (
        <>
          <path d="M40 50 q5 -6 10 0" stroke="#3b0d0d" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M60 50 q5 -6 10 0" stroke="#3b0d0d" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="45" cy="50" r={mood === "shock" ? 5 : 4} fill="#3b0d0d" />
          <circle cx="65" cy="50" r={mood === "shock" ? 5 : 4} fill="#3b0d0d" />
          <circle cx="46.5" cy="48.5" r="1.4" fill="#fff" />
          <circle cx="66.5" cy="48.5" r="1.4" fill="#fff" />
        </>
      )}
      {mood === "think" && <path d="M38 41 l12 -3 M60 38 l12 3" stroke="#3b0d0d" strokeWidth="2.5" strokeLinecap="round" />}
      <path d={mouth[mood]} stroke="#3b0d0d" strokeWidth="3" fill={mood === "laugh" ? "#7f1d1d" : "none"} strokeLinecap="round" />
      <circle cx="36" cy="60" r="4" fill="#ff8fa3" opacity="0.7" />
      <circle cx="74" cy="60" r="4" fill="#ff8fa3" opacity="0.7" />
    </svg>
  );
}

/** Floating sidekick in the corner. Talks whenever someone calls say(). */
export default function Mito() {
  const line = useMito();
  const wrap = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrap.current) return;
    const t = gsap.to(wrap.current, { y: -8, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    return () => {
      t.kill();
    };
  }, []);

  useEffect(() => {
    if (!line || !bubble.current || !wrap.current) return;
    gsap.fromTo(bubble.current, { scale: 0.6, opacity: 0, y: 10 }, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(2)" });
    gsap.fromTo(wrap.current, { rotate: -8 }, { rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }, [line]);

  return (
    <div className="pointer-events-none fixed bottom-24 left-3 z-40 flex items-end gap-2 sm:bottom-5 sm:left-5">
      <div ref={wrap} className="shrink-0">
        <MitoFace mood={line?.mood ?? "happy"} className="h-14 w-16 drop-shadow-[0_6px_16px_rgba(255,107,107,0.45)] sm:h-20 sm:w-24" />
      </div>
      {line && (
        <div
          ref={bubble}
          key={line.key}
          className="relative mb-8 max-w-[min(72vw,340px)] origin-bottom-left rounded-2xl rounded-bl-sm bg-cream px-4 py-3 text-[0.95rem] leading-snug text-[#2a1530] shadow-2xl"
        >
          <span className="mb-0.5 block font-hand text-lg leading-none text-[#c2410c]">Mito says</span>
          {line.text}
        </div>
      )}
    </div>
  );
}
