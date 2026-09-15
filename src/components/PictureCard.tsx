"use client";

type PictureCardProps = {
  emoji: string;
  label: string;
  onSelect?: () => void;
  state?: "idle" | "correct" | "wrong";
  size?: "big" | "medium";
};

/** Large tappable picture — primary answer input for young children. */
export default function PictureCard({
  emoji,
  label,
  onSelect,
  state = "idle",
  size = "medium",
}: PictureCardProps) {
  const stateClasses =
    state === "correct"
      ? "ring-8 ring-leaf bg-leaf/10 scale-105"
      : state === "wrong"
        ? "ring-8 ring-berry/60 bg-berry/10 opacity-70"
        : "ring-4 ring-mango/20 bg-card hover:ring-mango/50";

  const sizeClasses =
    size === "big" ? "text-8xl min-h-44 px-10" : "text-6xl min-h-32 px-6";

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!onSelect}
      aria-label={label}
      className={`${stateClasses} ${sizeClasses} rounded-3xl shadow-md
        flex items-center justify-center select-none leading-none
        transition-all active:scale-95 animate-pop-in`}
    >
      <span aria-hidden="true">{emoji}</span>
    </button>
  );
}
