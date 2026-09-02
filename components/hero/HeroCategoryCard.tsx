"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type HeroCategoryCardData = {
  label: string;
  accent: string;
  Icon: ComponentType<{ className?: string; size?: number, style?: React.CSSProperties }>;
  isLive?: boolean;
  href?: string;
  bgImage?: string;
};

const TRANSPARENT_BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

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

function hexToRgb(hex: string) {
  const raw = hex.replace("#", "").trim();
  const normalized =
    raw.length === 3 ? raw.split("").map((c) => `${c}${c}`).join("") : raw;
  if (normalized.length !== 6) return null;
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) return null;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

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
  const accentRgb = hexToRgb(card.accent);
  const cardLabel = card.label;

  const handleNavigate = () => {
    if (isClickable && card.href) {
      router.push(card.href);
    }
  };

  const glowStyle = accentRgb
    ? {
        background: `radial-gradient(circle at top left, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.35), rgba(15, 23, 42, 0.08) 45%, rgba(2, 6, 23, 0.65) 100%)`,
      }
    : undefined;

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
        group relative h-full w-full overflow-hidden rounded-[24px] border
        transition-all duration-500 ease-out
        cursor-pointer
        ${dark ? "border-white/10" : "border-white/30"}
        ${isActive ? "-translate-y-1 shadow-[0_26px_60px_rgba(15,23,42,0.18)]" : "shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(15,23,42,0.16)]"}
      `}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          isActive ? "scale-[1.04]" : "scale-100 group-hover:scale-[1.04]"
        }`}
      >
        {card.bgImage && (
          <Image
            src={card.bgImage}
            alt=""
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={TRANSPARENT_BLUR_DATA_URL}
          />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 opacity-80" style={glowStyle} />

      <div className="absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md sm:text-[10px]">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${card.isLive ? "animate-ping bg-emerald-400" : "bg-rose-400"}`}
          />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${card.isLive ? "bg-emerald-400" : "bg-rose-400"}`} />
        </span>
        {card.isLive ? "Live" : "Soon"}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/75 sm:text-[11px]">
              Discover
            </p>
            <h3 className="mt-1 text-xl font-black tracking-[-0.06em] text-white sm:text-2xl">
              {cardLabel}
            </h3>
          </div>

          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-sm text-white backdrop-blur-md transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ boxShadow: "0 12px 28px rgba(15, 23, 42, 0.24)" }}
          >
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
