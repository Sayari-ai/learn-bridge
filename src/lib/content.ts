// ---------------------------------------------------------------------------
// PLACEHOLDER LINGUISTIC CONTENT
// Gungbe (Gun) samples approximated from Gbe-family (Fon/Gun) sources.
// MUST be validated by native speakers and local-language experts before any
// use with children (see research doc §3.4, §9 "Teacher-in-the-loop").
// In production, audio is recorded by native speakers / AfriKlang TTS.
// ---------------------------------------------------------------------------

export type Concept = {
  id: string;
  /** Word in the child's home language (Gungbe) */
  gungbe: string;
  /** Word in the school language (French), with article */
  french: string;
  /** Visual representation (emoji for the prototype) */
  emoji: string;
};

export type ApplyInstruction = {
  /** Classroom-style instruction in French */
  textFr: string;
  /** Gungbe scaffold shown under the instruction */
  textGungbe: string;
  targetId: string;
  choiceIds: string[];
};

export type Lesson = {
  id: string;
  /** Display title in French (school language) */
  title: string;
  emoji: string;
  concepts: Concept[];
  instructions: ApplyInstruction[];
};

export const LESSONS: Lesson[] = [
  {
    id: "premiers-mots",
    title: "Mes premiers mots",
    emoji: "🌍",
    concepts: [
      { id: "eau", gungbe: "sìn", french: "l’eau", emoji: "💧" },
      { id: "chien", gungbe: "avún", french: "le chien", emoji: "🐶" },
      { id: "maison", gungbe: "xwé", french: "la maison", emoji: "🏠" },
      { id: "arbre", gungbe: "atín", french: "l’arbre", emoji: "🌳" },
    ],
    instructions: [
      {
        textFr: "Montre le chien !",
        textGungbe: "Xlɛ́ avún !",
        targetId: "chien",
        choiceIds: ["chien", "maison", "arbre"],
      },
      {
        textFr: "Où est l’eau ?",
        textGungbe: "Fítɛ̀ sìn tè ?",
        targetId: "eau",
        choiceIds: ["arbre", "eau", "chien"],
      },
    ],
  },
  {
    id: "ecole",
    title: "À l’école",
    emoji: "🎒",
    concepts: [
      { id: "livre", gungbe: "wéma", french: "le livre", emoji: "📖" },
      { id: "chaise", gungbe: "azinkpo", french: "la chaise", emoji: "🪑" },
      { id: "maitre", gungbe: "mɛ̀si", french: "le maître", emoji: "🧑🏾‍🏫" },
      { id: "ecole", gungbe: "wémaxɔmɛ", french: "l’école", emoji: "🏫" },
    ],
    instructions: [
      {
        textFr: "Prends le livre !",
        textGungbe: "Só wéma !",
        targetId: "livre",
        choiceIds: ["chaise", "livre", "ecole"],
      },
      {
        textFr: "Montre la chaise !",
        textGungbe: "Xlɛ́ azinkpo !",
        targetId: "chaise",
        choiceIds: ["livre", "maitre", "chaise"],
      },
    ],
  },
  {
    id: "nombres",
    title: "Les nombres",
    emoji: "🥭",
    concepts: [
      { id: "un", gungbe: "ɖokpo", french: "un", emoji: "🥭" },
      { id: "deux", gungbe: "awè", french: "deux", emoji: "🥭🥭" },
      { id: "trois", gungbe: "atɔ̀n", french: "trois", emoji: "🥭🥭🥭" },
      { id: "quatre", gungbe: "ɛnɛ̀", french: "quatre", emoji: "🥭🥭🥭🥭" },
    ],
    instructions: [
      {
        textFr: "Montre deux mangues !",
        textGungbe: "Xlɛ́ mángò awè !",
        targetId: "deux",
        choiceIds: ["un", "deux", "quatre"],
      },
      {
        textFr: "Montre quatre mangues !",
        textGungbe: "Xlɛ́ mángò ɛnɛ̀ !",
        targetId: "quatre",
        choiceIds: ["trois", "un", "quatre"],
      },
    ],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
