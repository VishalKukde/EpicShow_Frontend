"use client";

import { Star } from "lucide-react";

type RatingStarsProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  className?: string;
};

export default function RatingStars({
  value,
  onChange,
  readOnly = false,
  size = 18,
  className = "",
}: RatingStarsProps) {
  const roundedValue = Math.max(0, Math.min(5, Math.round(value)));
  const interactive = typeof onChange === "function" && !readOnly;

  return (
    <div className={`flex items-center gap-1 ${className}`.trim()}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const active = starValue <= roundedValue;

        if (!interactive) {
          return (
            <span key={starValue} className="inline-flex">
              <Star
                size={size}
                className={active ? "fill-amber-400 text-amber-400" : "text-slate-300"}
              />
            </span>
          );
        }

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue)}
            className="inline-flex cursor-pointer rounded-md p-1 transition hover:scale-105"
            aria-label={`Rate ${starValue} star${starValue === 1 ? "" : "s"}`}
          >
            <Star
              size={size}
              className={active ? "fill-amber-400 text-amber-400" : "text-slate-300"}
            />
          </button>
        );
      })}
    </div>
  );
}
