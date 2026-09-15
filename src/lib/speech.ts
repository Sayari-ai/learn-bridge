// Prototype speech layer.
// Production replaces this with AfriKlang ASR/TTS (recorded native-speaker
// audio for Gungbe). Browser speechSynthesis has no Gungbe voice, so home-
// language prompts are spoken slowly with a generic voice as a stand-in.

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  const v = window.speechSynthesis.getVoices();
  if (v.length > 0) cachedVoices = v;
  return cachedVoices;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export type SpeakLang = "fr" | "gungbe";

export function speak(text: string, lang: SpeakLang): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = loadVoices();
    const frVoice = voices.find((v) => v.lang.toLowerCase().startsWith("fr"));
    if (frVoice) utterance.voice = frVoice;
    utterance.lang = "fr-FR";
    // Slow, gentle delivery for young children; slower still for the
    // placeholder Gungbe pronunciation.
    utterance.rate = lang === "gungbe" ? 0.7 : 0.85;
    utterance.pitch = 1.1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (
    (w.SpeechRecognition as new () => SpeechRecognitionLike) ??
    (w.webkitSpeechRecognition as new () => SpeechRecognitionLike) ??
    null
  );
}

export function speechRecognitionAvailable(): boolean {
  return getRecognitionCtor() !== null;
}

/** Listen once for French speech; resolves with transcript or null. */
export function listenOnce(timeoutMs = 6000): Promise<string | null> {
  return new Promise((resolve) => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      resolve(null);
      return;
    }
    const recognition = new Ctor();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    let settled = false;
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        recognition.abort();
      } catch {
        // already stopped
      }
      resolve(value);
    };

    const timer = setTimeout(() => finish(null), timeoutMs);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? null;
      finish(transcript);
    };
    recognition.onerror = () => finish(null);
    recognition.onend = () => finish(null);
    try {
      recognition.start();
    } catch {
      finish(null);
    }
  });
}

/** Lenient match for early learners: accent/article-insensitive inclusion. */
export function roughlyMatches(heard: string, expected: string): boolean {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/^(le |la |les |l'|l’|un |une |des )/, "")
      .replace(/[^a-z0-9 ]/g, "")
      .trim();
  const h = clean(heard);
  const e = clean(expected);
  return h.length > 0 && (h.includes(e) || e.includes(h));
}
