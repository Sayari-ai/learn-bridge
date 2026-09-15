"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Activity, buildQueue, buildRevisionQueue } from "@/lib/activities";
import { Lesson } from "@/lib/content";
import { saveLessonProgress } from "@/lib/progress";
import { speak, stopSpeaking } from "@/lib/speech";
import ActivityView from "@/components/lesson/ActivityView";
import ProgressPath from "@/components/ProgressPath";
import Celebration from "@/components/Celebration";
import Mascot from "@/components/Mascot";

type Phase = "intro" | "playing" | "revision" | "done";

function starsForMistakes(mistakes: number): number {
  if (mistakes <= 1) return 3;
  if (mistakes <= 3) return 2;
  return 1;
}

export default function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [queue, setQueue] = useState<Activity[]>([]);
  const [index, setIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [struggledIds, setStruggledIds] = useState<string[]>([]);
  const [stars, setStars] = useState(0);

  const start = useCallback(() => {
    setQueue(buildQueue(lesson));
    setIndex(0);
    setMistakes(0);
    setStruggledIds([]);
    setPhase("playing");
    // First user gesture: unlock and greet.
    speak(`On y va ! ${lesson.title}`, "fr");
  }, [lesson]);

  const finish = useCallback(
    (finalMistakes: number, finalStruggled: string[]) => {
      const earned = starsForMistakes(finalMistakes);
      setStars(earned);
      saveLessonProgress(lesson.id, {
        stars: earned,
        completedAt: new Date().toISOString(),
        needsPractice: finalStruggled,
      });
      setPhase("done");
      speak("Félicitations ! Tu as gagné des étoiles !", "fr");
    },
    [lesson.id],
  );

  const handleComplete = useCallback(
    (firstTry: boolean) => {
      const activity = queue[index];
      const conceptId =
        activity && "concept" in activity ? activity.concept.id : null;

      const nextMistakes = firstTry ? mistakes : mistakes + 1;
      const nextStruggled =
        !firstTry && conceptId && !struggledIds.includes(conceptId)
          ? [...struggledIds, conceptId]
          : struggledIds;
      setMistakes(nextMistakes);
      setStruggledIds(nextStruggled);

      if (index + 1 < queue.length) {
        setIndex(index + 1);
        return;
      }

      // Step 7 — Adapt: revisit struggled concepts once, then celebrate.
      if (phase === "playing" && nextStruggled.length > 0) {
        const revision = buildRevisionQueue(lesson, nextStruggled);
        if (revision.length > 0) {
          setQueue(revision);
          setIndex(0);
          setPhase("revision");
          speak("On révise ensemble !", "fr");
          return;
        }
      }
      finish(nextMistakes, nextStruggled);
    },
    [queue, index, mistakes, struggledIds, phase, lesson, finish],
  );

  if (phase === "intro") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6 text-center">
        <Mascot className="w-32 h-32 animate-bounce-soft" />
        <p className="text-5xl" aria-hidden="true">
          {lesson.emoji}
        </p>
        <h1 className="text-3xl font-extrabold">{lesson.title}</h1>
        <button
          type="button"
          onClick={start}
          aria-label="Commencer la leçon"
          className="w-32 h-32 rounded-full bg-mango text-white text-6xl shadow-xl
            flex items-center justify-center active:scale-90 transition-transform animate-pulse-ring"
        >
          ▶
        </button>
        <Link href="/" className="text-lg opacity-60 underline" onClick={stopSpeaking}>
          ← Retour
        </Link>
      </main>
    );
  }

  if (phase === "done") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6 text-center">
        <Celebration />
        <Mascot className="w-32 h-32 animate-wiggle" mood="cheer" />
        <div className="text-6xl" role="img" aria-label={`${stars} étoiles sur 3`}>
          {"⭐".repeat(stars)}
          <span className="opacity-20">{"⭐".repeat(3 - stars)}</span>
        </div>
        <h1 className="text-3xl font-extrabold">Bravo !</h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={start}
            className="px-8 py-5 rounded-3xl bg-sky text-white text-xl font-bold shadow-lg
              active:scale-95 transition-transform"
          >
            🔁 Encore
          </button>
          <Link
            href="/"
            onClick={stopSpeaking}
            className="px-8 py-5 rounded-3xl bg-leaf text-white text-xl font-bold shadow-lg
              active:scale-95 transition-transform"
          >
            🏠 Accueil
          </Link>
        </div>
      </main>
    );
  }

  const activity = queue[index];
  return (
    <main className="flex-1 flex flex-col items-center gap-6 p-6">
      <div className="w-full flex items-center justify-center gap-4">
        <Link href="/" aria-label="Quitter la leçon" onClick={stopSpeaking} className="text-2xl">
          🏠
        </Link>
        <ProgressPath current={index} total={queue.length} />
      </div>
      {phase === "revision" ? (
        <p className="text-lg font-semibold text-sky-deep">On révise ! 💪</p>
      ) : null}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {activity ? (
          <ActivityView key={`${phase}-${index}`} activity={activity} onComplete={handleComplete} />
        ) : null}
      </div>
    </main>
  );
}
