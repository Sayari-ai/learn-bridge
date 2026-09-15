"use client";

const COLORS = ["#f59e0b", "#16a34a", "#38bdf8", "#e11d48", "#fde047"];

// Deterministic scatter (pure render): pseudo-random from the piece index.
const PIECES = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  delay: ((i * 13) % 12) / 10,
  color: COLORS[i % COLORS.length],
}));

/** Full-screen confetti burst for lesson completion. */
export default function Celebration() {
  return (
    <div aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            animationDelay: `${p.delay}s`,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
