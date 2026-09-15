"use client";

import { useCallback, useState } from "react";
import { listenOnce, roughlyMatches, speak, speechRecognitionAvailable } from "@/lib/speech";

type MicButtonProps = {
  expected: string;
  onResult: (correct: boolean) => void;
};

type MicState = "idle" | "listening" | "heard-good" | "heard-retry";

/**
 * "Repeat after me" input. Uses browser ASR (fr-FR) when available;
 * otherwise falls back to an honest self-report tap ("J'ai répété !").
 * Production replaces this with AfriKlang child-speech assessment.
 */
export default function MicButton({ expected, onResult }: MicButtonProps) {
  const [state, setState] = useState<MicState>("idle");
  const asrAvailable = speechRecognitionAvailable();

  const startListening = useCallback(async () => {
    if (state === "listening") return;
    setState("listening");
    const heard = await listenOnce();
    if (heard && roughlyMatches(heard, expected)) {
      setState("heard-good");
      await speak("Bravo !", "fr");
      onResult(true);
    } else {
      setState("heard-retry");
      // Encourage, never punish: the child can try again or move on.
      await speak("Encore une fois ?", "fr");
    }
  }, [state, expected, onResult]);

  if (!asrAvailable) {
    return (
      <button
        type="button"
        onClick={() => onResult(true)}
        className="px-10 py-6 rounded-3xl bg-sky text-white text-2xl font-bold shadow-lg
          active:scale-95 transition-transform"
      >
        🗣️ J’ai répété !
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={startListening}
        aria-label="Appuie et répète le mot"
        className={`w-28 h-28 rounded-full text-5xl text-white shadow-lg flex items-center
          justify-center active:scale-90 transition-transform
          ${state === "listening" ? "bg-berry animate-pulse-ring" : "bg-sky"}`}
      >
        🎤
      </button>
      {state === "heard-retry" ? (
        <button
          type="button"
          // No penalty: browser ASR is unreliable for child speech, and the
          // failure may be the microphone's fault. Assessment happens in the
          // tap-based steps.
          onClick={() => onResult(true)}
          className="px-6 py-3 rounded-2xl bg-mango/20 text-foreground text-lg font-semibold
            active:scale-95 transition-transform"
        >
          Continuer ➜
        </button>
      ) : null}
    </div>
  );
}
