"use client";

import type { ComponentType } from "react";
import { useRouter } from "next/navigation";

export type HeroCategoryCardData = {
  label: string;
  subtitle?: string;
  badge?: string;
  accent: string;
  Icon: ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>;
  isLive?: boolean;
  href?: string;
  bgImage?: string;
};

type HeroCategoryCardProps = {
  card: HeroCategoryCardData;
  index: number;
  dark: boolean;
  isActive: boolean;
  onEnter: (index: number) => void;
  onLeave: () => void;
  isSmall?: boolean;
  isTiny?: boolean;
};

export default function HeroCategoryCard({
  card,
  index,
  dark,
  isActive,
  onEnter,
  onLeave,
}: HeroCategoryCardProps) {
  const router = useRouter();
  const isClickable = true;

  const handleNavigate = () => {
    if (isClickable && card.href) {
      router.push(card.href);
    }
  };

  return (
    <div
      onMouseEnter={() => onEnter(index)}
      onMouseLeave={onLeave}
      onClick={handleNavigate}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={(event) => {
        if (!isClickable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleNavigate();
        }
      }}
      className={`
        group relative h-full w-full overflow-hidden rounded-[28px] border
        transition-all duration-500 ease-out cursor-pointer select-none
        border-white/15 bg-slate-950
        ${isActive
          ? "-translate-y-2 shadow-[0_28px_60px_rgba(0,0,0,0.5)] border-indigo-500/60"
          : "shadow-[0_12px_32px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-[0_26px_56px_rgba(0,0,0,0.45)] hover:border-indigo-500/40"
        }
      `}
    >
      {/* Full-Bleed Imagery with Pinterest-Style Smooth Zoom */}
      {card.bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${card.bgImage})` }}
        />
      )}

      {/* Dark Subtle Overlay for High Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40" />

      {/* Top Floating Glass Badge */}
      <div className="absolute left-4 top-4 z-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md shadow-sm">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${card.isLive ? "animate-ping bg-emerald-400" : "bg-amber-400"
                }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${card.isLive ? "bg-emerald-400" : "bg-amber-400"
                }`}
            />
          </span>
          <span>{card.badge || (card.isLive ? "Live Catalog" : "Upcoming")}</span>
        </div>
      </div>

      {/* Bottom Pinterest-Style Minimal Metadata */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-5">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[11px] font-medium tracking-wider text-white/75">
              {card.subtitle || "Explore Catalog"}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-indigo-200">
              {card.label}
            </h3>
          </div>

          {/* Action Button */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md shadow-md transition-all duration-300 group-hover:bg-white group-hover:text-slate-950 group-hover:scale-110"
          >
            <span className="text-sm font-bold transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
