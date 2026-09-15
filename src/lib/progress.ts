// Offline-first progress store (localStorage only — privacy by design:
// no accounts, no personal data, nothing leaves the device).

import { useSyncExternalStore } from "react";

export type LessonProgress = {
  stars: number; // 0–3
  completedAt: string | null;
  /** Concept ids the child struggled with; the Adapt step revisits them. */
  needsPractice: string[];
};

export type Progress = Record<string, LessonProgress>;

const KEY = "afriklang-progress-v1";
const EMPTY: Progress = {};

const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// Cache keyed on the raw string so getSnapshot returns a stable reference.
let cache: { raw: string | null; parsed: Progress } = { raw: null, parsed: EMPTY };

function getSnapshot(): Progress {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cache.raw) {
    let parsed: Progress = EMPTY;
    if (raw) {
      try {
        parsed = JSON.parse(raw) as Progress;
      } catch {
        parsed = EMPTY;
      }
    }
    cache = { raw, parsed };
  }
  return cache.parsed;
}

function getServerSnapshot(): Progress {
  return EMPTY;
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return EMPTY;
  return getSnapshot();
}

export function saveLessonProgress(lessonId: string, update: LessonProgress): void {
  if (typeof window === "undefined") return;
  const progress = loadProgress();
  const previous = progress[lessonId];
  // Keep the best star score across attempts.
  const stars = Math.max(previous?.stars ?? 0, update.stars);
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ ...progress, [lessonId]: { ...update, stars } }),
    );
  } catch {
    // Storage unavailable (private mode): progress is session-only.
  }
  notify();
}

export function totalStars(progress: Progress): number {
  return Object.values(progress).reduce((sum, p) => sum + p.stars, 0);
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  notify();
}
