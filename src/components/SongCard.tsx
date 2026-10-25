import { useEffect, useState } from "react";
import { sound } from "@/game/audio";
import type { Song } from "@/game/content";

/** Lightweight YouTube player: a thumbnail until clicked, then the real embed. */
export default function SongCard({ song, label = "Song unlocked", compact = false }: { song: Song; label?: string; compact?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const start = () => setPlaying(true);

  // pause the ambient music while the video is on screen; it comes back when the card goes away
  useEffect(() => {
    if (!playing) return;
    return sound.hold();
  }, [playing]);
  return (
    <div className={`glass overflow-hidden rounded-2xl ${compact ? "" : "w-full max-w-md"}`}>
      <div className="relative aspect-video w-full bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${song.id}?autoplay=1&rel=0`}
            title={`${song.title} by ${song.artist}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={start} className="group absolute inset-0 h-full w-full" aria-label={`Play ${song.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-gold text-2xl text-night shadow-[0_0_40px_rgba(247,181,24,0.7)] transition group-hover:scale-110">
                ▶
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="text-[0.7rem] font-semibold tracking-[0.18em] text-gold uppercase">🎵 {label}</div>
          <div className="truncate font-display text-lg leading-tight">
            {song.title} <span className="text-muted">· {song.artist}</span>
          </div>
          <div className={`text-sm text-muted ${compact ? "line-clamp-2" : ""}`}>{song.why}</div>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${song.id}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-xs text-muted underline-offset-2 hover:text-cream hover:underline"
        >
          YouTube ↗
        </a>
      </div>
    </div>
  );
}
