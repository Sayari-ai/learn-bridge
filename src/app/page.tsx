"use client";

import Link from "next/link";
import { LESSONS } from "@/lib/content";
import { totalStars, useProgress } from "@/lib/progress";
import Mascot from "@/components/Mascot";

export default function Home() {
  const progress = useProgress();

  const stars = totalStars(progress);

  return (
    <main className="flex-1 flex flex-col items-center gap-8 p-6 max-w-2xl mx-auto w-full">
      <header className="w-full flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-extrabold text-mango-deep">AfriKlang</h1>
          <p className="text-sm font-semibold opacity-60">Pont d’apprentissage</p>
        </div>
        <div
          className="flex items-center gap-2 bg-sun/40 rounded-full px-4 py-2 text-xl font-extrabold"
          aria-label={`${stars} étoiles gagnées`}
        >
          ⭐ {stars}
        </div>
      </header>

      <div className="flex flex-col items-center gap-2 text-center">
        <Mascot className="w-36 h-36 animate-bounce-soft" />
        <p className="text-xl font-bold">Mĩ kwɛ́ ! Bonjour !</p>
        <p className="text-base opacity-70 max-w-xs">
          Du gungbe vers le français, en jouant.
        </p>
      </div>

      <nav className="w-full grid grid-cols-1 gap-5" aria-label="Leçons">
        {LESSONS.map((lesson) => {
          const lessonStars = progress[lesson.id]?.stars ?? 0;
          return (
            <Link
              key={lesson.id}
              href={`/lesson/${lesson.id}`}
              className="flex items-center gap-5 bg-card rounded-3xl p-5 shadow-md ring-4
                ring-mango/15 hover:ring-mango/40 active:scale-95 transition-all"
            >
              <span className="text-6xl" aria-hidden="true">
                {lesson.emoji}
              </span>
              <span className="flex-1">
                <span className="block text-2xl font-extrabold">{lesson.title}</span>
                <span
                  className="block text-xl"
                  aria-label={`${lessonStars} étoiles sur 3`}
                >
                  {"⭐".repeat(lessonStars)}
                  <span className="opacity-20">{"⭐".repeat(3 - lessonStars)}</span>
                </span>
              </span>
              <span className="text-3xl text-mango" aria-hidden="true">
                ▶
              </span>
            </Link>
          );
        })}
      </nav>

      <footer className="mt-auto pb-4 flex flex-col items-center gap-2 text-center">
        <Link href="/adults" className="text-sm opacity-50 underline">
          Espace parents & enseignant·e·s
        </Link>
        <p className="text-xs opacity-40 max-w-sm">
          Prototype — contenu linguistique d’exemple, en attente de validation
          par des expert·e·s du gungbe.
        </p>
      </footer>
    </main>
  );
}
