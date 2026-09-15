"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Activity } from "@/lib/activities";
import { Concept } from "@/lib/content";
import { speak } from "@/lib/speech";
import AudioButton from "@/components/AudioButton";
import PictureCard from "@/components/PictureCard";
import MicButton from "@/components/MicButton";
import Mascot from "@/components/Mascot";

type ActivityViewProps = {
  activity: Activity;
  /** Called when the activity is finished; firstTry=false if the child struggled. */
  onComplete: (firstTry: boolean) => void;
};

const ENCOURAGEMENTS = ["Bravo !", "Super !", "Très bien !", "Génial !"];

function cheer(): Promise<void> {
  const word = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
  return speak(word, "fr");
}

/** Big friendly "next" button used after passive steps. */
function ContinueButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Continuer"
      className="w-24 h-24 rounded-full bg-leaf text-white text-5xl shadow-lg
        flex items-center justify-center active:scale-90 transition-transform"
    >
      ➜
    </button>
  );
}

/** Shared tap-the-picture exercise (Understand / Practise / Read / Apply). */
function ChoiceExercise({
  choices,
  targetId,
  onComplete,
  autoSpeak,
  children,
}: {
  choices: Concept[];
  targetId: string;
  onComplete: (firstTry: boolean) => void;
  autoSpeak?: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [correctPicked, setCorrectPicked] = useState(false);
  const missed = useRef(false);
  const spoken = useRef(false);

  useEffect(() => {
    if (!spoken.current && autoSpeak) {
      spoken.current = true;
      autoSpeak();
    }
  }, [autoSpeak]);

  const pick = useCallback(
    async (concept: Concept) => {
      if (correctPicked) return;
      if (concept.id === targetId) {
        setCorrectPicked(true);
        await cheer();
        onComplete(!missed.current);
      } else {
        missed.current = true;
        setWrongIds((ids) => [...ids, concept.id]);
        await speak("Essaie encore !", "fr");
      }
    },
    [correctPicked, targetId, onComplete],
  );

  return (
    <div className="flex flex-col items-center gap-8">
      {children}
      <div className="flex flex-wrap items-center justify-center gap-5">
        {choices.map((c) => (
          <PictureCard
            key={c.id}
            emoji={c.emoji}
            label={c.french}
            onSelect={() => pick(c)}
            state={
              correctPicked && c.id === targetId
                ? "correct"
                : wrongIds.includes(c.id)
                  ? "wrong"
                  : "idle"
            }
          />
        ))}
      </div>
    </div>
  );
}

export default function ActivityView({ activity, onComplete }: ActivityViewProps) {
  // Auto-play the prompt when a passive step appears (child taps to replay).
  useEffect(() => {
    if (activity.kind === "listen") speak(activity.concept.gungbe, "gungbe");
    else if (activity.kind === "bridge") speak(activity.concept.french, "fr");
    // Keyed remount per activity: run once per instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step 1 — Listen: hear the concept in the home language.
  if (activity.kind === "listen") {
    const { concept } = activity;
    return (
      <div className="flex flex-col items-center gap-8 animate-pop-in">
        <Mascot className="w-24 h-24 animate-bounce-soft" />
        <PictureCard emoji={concept.emoji} label={concept.gungbe} size="big" />
        <p className="text-4xl font-extrabold">{concept.gungbe}</p>
        <div className="flex items-center gap-6">
          <AudioButton text={concept.gungbe} lang="gungbe" label={`Écouter ${concept.gungbe}`} />
          <ContinueButton onClick={() => onComplete(true)} />
        </div>
      </div>
    );
  }

  // Step 2 — Understand: home-language prompt → tap the right picture.
  if (activity.kind === "understand") {
    const { concept, choices } = activity;
    return (
      <ChoiceExercise
        choices={choices}
        targetId={concept.id}
        onComplete={onComplete}
        autoSpeak={() => speak(concept.gungbe, "gungbe")}
      >
        <div className="flex items-center gap-4">
          <AudioButton text={concept.gungbe} lang="gungbe" label={`Écouter ${concept.gungbe}`} size="small" />
          <p className="text-3xl font-extrabold">{concept.gungbe} ?</p>
        </div>
      </ChoiceExercise>
    );
  }

  // Step 3 — Bridge: same concept in the school language, home language as scaffold.
  if (activity.kind === "bridge") {
    const { concept } = activity;
    return (
      <div className="flex flex-col items-center gap-6 animate-pop-in">
        <PictureCard emoji={concept.emoji} label={concept.french} size="big" />
        <p className="text-xl font-semibold opacity-60">{concept.gungbe}</p>
        <p className="text-lg opacity-60" aria-hidden="true">
          ⬇️
        </p>
        <p className="text-5xl font-extrabold text-mango-deep">{concept.french}</p>
        <div className="flex items-center gap-6">
          <AudioButton text={concept.french} lang="fr" label={`Écouter ${concept.french}`} />
          <ContinueButton onClick={() => onComplete(true)} />
        </div>
      </div>
    );
  }

  // Step 4a — Practise: say the French word.
  if (activity.kind === "practise-speak") {
    const { concept } = activity;
    return (
      <div className="flex flex-col items-center gap-8 animate-pop-in">
        <PictureCard emoji={concept.emoji} label={concept.french} size="big" />
        <p className="text-4xl font-extrabold text-mango-deep">{concept.french}</p>
        <div className="flex items-center gap-6">
          <AudioButton text={concept.french} lang="fr" label={`Écouter ${concept.french}`} size="small" />
          <MicButton expected={concept.french} onResult={(ok) => onComplete(ok)} />
        </div>
      </div>
    );
  }

  // Step 4b — Practise: French audio → tap the picture.
  if (activity.kind === "practise-match") {
    const { concept, choices } = activity;
    return (
      <ChoiceExercise
        choices={choices}
        targetId={concept.id}
        onComplete={onComplete}
        autoSpeak={() => speak(concept.french, "fr")}
      >
        <AudioButton text={concept.french} lang="fr" label={`Écouter ${concept.french}`} />
      </ChoiceExercise>
    );
  }

  // Step 5 — Read: written French word → tap the picture.
  if (activity.kind === "read") {
    const { concept, choices } = activity;
    return (
      <ChoiceExercise choices={choices} targetId={concept.id} onComplete={onComplete}>
        <div className="flex flex-col items-center gap-2">
          <p className="text-5xl font-extrabold tracking-wide">{concept.french}</p>
          <AudioButton text={concept.french} lang="fr" label={`Écouter ${concept.french}`} size="small" />
        </div>
      </ChoiceExercise>
    );
  }

  // Step 6 — Apply: classroom-style instruction.
  const { instruction, choices } = activity;
  return (
    <ChoiceExercise
      choices={choices}
      targetId={instruction.targetId}
      onComplete={onComplete}
      autoSpeak={() => speak(instruction.textFr, "fr")}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <AudioButton text={instruction.textFr} lang="fr" label="Écouter la consigne" size="small" />
          <p className="text-3xl font-extrabold">{instruction.textFr}</p>
        </div>
        <p className="text-lg font-semibold opacity-60">{instruction.textGungbe}</p>
      </div>
    </ChoiceExercise>
  );
}
