"use client";

import Link from "next/link";
import { LESSONS } from "@/lib/content";
import { resetProgress, useProgress } from "@/lib/progress";
import AdultGate from "@/components/AdultGate";

function AdultsContent() {
  const progress = useProgress();

  const conceptName = (lessonId: string, conceptId: string) =>
    LESSONS.find((l) => l.id === lessonId)?.concepts.find((c) => c.id === conceptId)
      ?.french ?? conceptId;

  return (
    <main className="flex-1 flex flex-col gap-8 p-6 max-w-2xl mx-auto w-full">
      <header className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-extrabold text-mango-deep">
          Espace parents & enseignant·e·s
        </h1>
        <Link href="/" className="text-lg underline opacity-70">
          ← Accueil
        </Link>
      </header>

      <section className="bg-card rounded-3xl p-6 shadow-md flex flex-col gap-3">
        <h2 className="text-xl font-bold">Ce que l’enfant apprend</h2>
        <p className="opacity-80">
          L’enfant part de sa langue (gungbe) pour construire du vocabulaire, de
          la compréhension orale et une première lecture en français — la langue
          de l’école. Chaque leçon suit le parcours : écouter, comprendre, faire
          le pont, pratiquer, lire, appliquer, s’adapter.
        </p>
      </section>

      <section className="bg-card rounded-3xl p-6 shadow-md flex flex-col gap-4">
        <h2 className="text-xl font-bold">Progrès</h2>
        {LESSONS.map((lesson) => {
          const p = progress[lesson.id];
          return (
            <div key={lesson.id} className="flex flex-col gap-1 border-b border-mango/10 pb-3 last:border-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {lesson.emoji} {lesson.title}
                </span>
                <span aria-label={`${p?.stars ?? 0} étoiles sur 3`}>
                  {"⭐".repeat(p?.stars ?? 0)}
                  <span className="opacity-20">{"⭐".repeat(3 - (p?.stars ?? 0))}</span>
                </span>
              </div>
              {p?.needsPractice?.length ? (
                <p className="text-sm opacity-70">
                  À revoir : {p.needsPractice.map((id) => conceptName(lesson.id, id)).join(", ")}
                </p>
              ) : p?.completedAt ? (
                <p className="text-sm text-leaf-deep">Acquis sans difficulté</p>
              ) : (
                <p className="text-sm opacity-50">Pas encore commencé</p>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={resetProgress}
          className="self-start px-5 py-3 rounded-2xl bg-berry/10 text-berry font-semibold
            active:scale-95 transition-transform"
        >
          Réinitialiser les progrès
        </button>
      </section>

      <section className="bg-card rounded-3xl p-6 shadow-md flex flex-col gap-3">
        <h2 className="text-xl font-bold">Sécurité & confidentialité</h2>
        <ul className="list-disc pl-5 opacity-80 flex flex-col gap-1">
          <li>Aucun compte, aucune donnée personnelle collectée.</li>
          <li>Les progrès restent uniquement sur cet appareil.</li>
          <li>Pas de publicité, pas de conversation libre avec une IA.</li>
          <li>Contenu limité à un programme défini, à valider par des enseignant·e·s.</li>
        </ul>
        <p className="text-sm opacity-60">
          Prototype : le contenu gungbe est un exemple et doit être validé par des
          locuteurs natifs et des expert·e·s en langues locales. Les voix sont des
          voix de synthèse provisoires.
        </p>
      </section>
    </main>
  );
}

export default function AdultsPage() {
  return (
    <AdultGate>
      <AdultsContent />
    </AdultGate>
  );
}
