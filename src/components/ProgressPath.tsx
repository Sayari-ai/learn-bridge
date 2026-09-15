type ProgressPathProps = {
  current: number;
  total: number;
};

/** Non-numeric progress: a growing path of mangoes (pre-literate friendly). */
export default function ProgressPath({ current, total }: ProgressPathProps) {
  const percent = total === 0 ? 0 : Math.min(100, Math.round((current / total) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progression de la leçon"
      className="w-full max-w-md h-6 rounded-full bg-mango/15 overflow-hidden relative"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-sun to-mango transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
      <span
        className="absolute top-1/2 -translate-y-1/2 text-xl transition-all duration-500"
        style={{ left: `calc(${percent}% - 14px)` }}
        aria-hidden="true"
      >
        🥭
      </span>
    </div>
  );
}
