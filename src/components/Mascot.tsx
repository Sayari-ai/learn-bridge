type MascotProps = {
  className?: string;
  mood?: "happy" | "cheer";
};

/** "Klang" — a friendly grey parrot, the app's guide. */
export default function Mascot({ className = "", mood = "happy" }: MascotProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Klang le perroquet"
    >
      {/* tail */}
      <path d="M52 88 Q40 112 56 116 Q60 100 64 92 Z" fill="#e11d48" />
      {/* body */}
      <ellipse cx="60" cy="66" rx="30" ry="34" fill="#9ca3af" />
      <ellipse cx="60" cy="74" rx="20" ry="22" fill="#d1d5db" />
      {/* wing */}
      <path d="M34 60 Q26 84 46 92 Q40 74 44 58 Z" fill="#6b7280" />
      {/* head */}
      <circle cx="60" cy="34" r="22" fill="#9ca3af" />
      <circle cx="60" cy="34" r="22" fill="none" stroke="#6b7280" strokeWidth="1" />
      {/* face patch */}
      <ellipse cx="66" cy="34" rx="12" ry="13" fill="#f3f4f6" />
      {/* eye */}
      <circle cx="66" cy="31" r="4.5" fill="#3d2c1e" />
      <circle cx="67.5" cy="29.5" r="1.5" fill="#fff" />
      {/* beak */}
      <path d="M76 34 Q88 36 82 44 Q78 48 74 44 Q72 38 76 34 Z" fill="#374151" />
      {/* happy brow / cheer star */}
      {mood === "cheer" ? (
        <g fill="#f59e0b">
          <path d="M28 12 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 Z" />
          <path d="M92 8 l2.5 5 5 1 -3.7 3.3 0.8 5 -4.6 -2.5 -4.6 2.5 0.8 -5 -3.7 -3.3 5 -1 Z" />
        </g>
      ) : null}
      {/* feet */}
      <path d="M52 98 q2 8 8 8 q6 0 8 -8" fill="none" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
