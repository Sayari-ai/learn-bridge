"use client";

import { useCallback, useState } from "react";
import { speak, SpeakLang } from "@/lib/speech";

type AudioButtonProps = {
  text: string;
  lang: SpeakLang;
  label: string;
  size?: "big" | "small";
  className?: string;
};

/** Speaker button — the main way a pre-literate child triggers audio. */
export default function AudioButton({
  text,
  lang,
  label,
  size = "big",
  className = "",
}: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);

  const play = useCallback(async () => {
    if (playing) return;
    setPlaying(true);
    await speak(text, lang);
    setPlaying(false);
  }, [playing, text, lang]);

  const sizeClasses =
    size === "big"
      ? "w-24 h-24 text-5xl"
      : "w-14 h-14 text-2xl";

  return (
    <button
      type="button"
      onClick={play}
      aria-label={label}
      className={`${sizeClasses} ${className} rounded-full bg-mango text-white shadow-lg
        flex items-center justify-center select-none
        active:scale-90 transition-transform
        ${playing ? "animate-pulse-ring" : ""}`}
    >
      {playing ? "🔊" : "🔉"}
    </button>
  );
}
