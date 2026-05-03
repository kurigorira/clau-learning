"use client";

interface Props {
  total: number;
  current: number;
  results: Array<"correct" | "wrong" | null>;
}

export function ProgressDots({ total, current, results }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const r = results[i];
        const cls =
          r === "correct"
            ? "bg-magic-mint"
            : r === "wrong"
              ? "bg-magic-ember"
              : i === current
                ? "bg-magic-gold animate-pulse"
                : "bg-sage-700";
        return (
          <span
            key={i}
            className={`h-3 w-3 rounded-full transition ${cls}`}
            aria-label={`問題 ${i + 1}`}
          />
        );
      })}
    </div>
  );
}
