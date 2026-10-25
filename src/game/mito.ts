// Mito the mitochondrion: the sidekick who comments on everything.
// A minimal external store so any component can make Mito talk.

import { useSyncExternalStore } from "react";

export type Mood = "happy" | "think" | "shock" | "laugh" | "love";
export type MitoLine = { text: string; mood: Mood; key: number };

let current: MitoLine | null = null;
let n = 0;
const subs = new Set<() => void>();
let hideTimer: ReturnType<typeof setTimeout> | null = null;

export function say(text: string, mood: Mood = "happy", ms = 6500) {
  current = { text, mood, key: ++n };
  subs.forEach((f) => f());
  if (hideTimer) clearTimeout(hideTimer);
  if (ms > 0)
    hideTimer = setTimeout(() => {
      current = null;
      subs.forEach((f) => f());
    }, ms);
}

export function hush() {
  current = null;
  subs.forEach((f) => f());
}

export function useMito() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => current,
    () => null,
  );
}

export const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
