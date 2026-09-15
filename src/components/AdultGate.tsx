"use client";

import { useCallback, useRef, useState } from "react";
import { ReactNode } from "react";

const HOLD_MS = 3000;

/** Hold-to-unlock gate so young children can't reach the adult area. */
export default function AdultGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHold = useCallback(() => {
    setHolding(true);
    timer.current = setTimeout(() => setUnlocked(true), HOLD_MS);
  }, []);

  const cancelHold = useCallback(() => {
    setHolding(false);
    if (timer.current) clearTimeout(timer.current);
  }, []);

  if (unlocked) return <>{children}</>;

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-8 p-8 text-center">
      <p className="text-2xl font-bold">Espace adultes</p>
      <p className="max-w-sm text-lg opacity-80">
        Cette page est réservée aux parents et aux enseignant·e·s. Maintenez le
        bouton appuyé pendant 3 secondes pour entrer.
      </p>
      <button
        type="button"
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        className={`px-10 py-6 rounded-3xl text-xl font-bold text-white shadow-lg select-none
          ${holding ? "bg-leaf-deep scale-95" : "bg-leaf"} transition-all`}
      >
        {holding ? "Continuez d’appuyer…" : "Maintenir pour entrer"}
      </button>
    </main>
  );
}
