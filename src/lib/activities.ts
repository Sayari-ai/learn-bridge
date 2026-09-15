import { ApplyInstruction, Concept, Lesson } from "./content";

// Activity queue implementing the learner loop from the research doc §7:
// Listen → Understand → Bridge → Practise → Read → Apply → Adapt.

export type Activity =
  | { kind: "listen"; concept: Concept }
  | { kind: "understand"; concept: Concept; choices: Concept[] }
  | { kind: "bridge"; concept: Concept }
  | { kind: "practise-speak"; concept: Concept }
  | { kind: "practise-match"; concept: Concept; choices: Concept[] }
  | { kind: "read"; concept: Concept; choices: Concept[] }
  | { kind: "apply"; instruction: ApplyInstruction; choices: Concept[] };

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function choicesFor(concept: Concept, pool: Concept[], count = 3): Concept[] {
  const others = shuffle(pool.filter((c) => c.id !== concept.id)).slice(0, count - 1);
  return shuffle([concept, ...others]);
}

export function buildQueue(lesson: Lesson): Activity[] {
  const queue: Activity[] = [];
  const pool = lesson.concepts;

  // Per concept: hear it in Gungbe, prove understanding, then bridge to French
  // and practise saying it.
  for (const concept of pool) {
    queue.push({ kind: "listen", concept });
    queue.push({ kind: "understand", concept, choices: choicesFor(concept, pool) });
    queue.push({ kind: "bridge", concept });
    queue.push({ kind: "practise-speak", concept });
  }

  // Mixed practice: French audio → picture.
  for (const concept of shuffle(pool)) {
    queue.push({ kind: "practise-match", concept, choices: choicesFor(concept, pool) });
  }

  // Early reading: written French word → picture.
  for (const concept of shuffle(pool)) {
    queue.push({ kind: "read", concept, choices: choicesFor(concept, pool) });
  }

  // Apply: classroom-style instructions.
  for (const instruction of lesson.instructions) {
    const choices = instruction.choiceIds
      .map((id) => pool.find((c) => c.id === id))
      .filter((c): c is Concept => Boolean(c));
    queue.push({ kind: "apply", instruction, choices: shuffle(choices) });
  }

  return queue;
}

/** Adapt step: short revision round for concepts the child missed. */
export function buildRevisionQueue(lesson: Lesson, struggledIds: string[]): Activity[] {
  const queue: Activity[] = [];
  const pool = lesson.concepts;
  const toRevise = pool.filter((c) => struggledIds.includes(c.id)).slice(0, 2);
  for (const concept of toRevise) {
    queue.push({ kind: "bridge", concept });
    queue.push({ kind: "practise-match", concept, choices: choicesFor(concept, pool) });
  }
  return queue;
}
