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
  isSmall = false,
  isTiny = false,
}: HeroCategoryCardProps) {
  const router = useRouter();

  // const isClickable = Boolean(card.href) && card.isLive;
  const isClickable = true
  const accentRgb = hexToRgb(card.accent);
  const badgeText = card.label;

  const handleNavigate = () => {
    if (isClickable && card.href) {
      router.push(card.href);
    }
  };

  const cardHeight = isTiny
    ? "clamp(110px, 20vh, 150px)"
    : "clamp(120px, 18vh, 170px)";

  const paddingClass = isTiny ? "p-3" : isSmall ? "p-4" : "p-5";

  return (
    <div
      style={{ height: cardHeight }}
      onMouseEnter={() => !card.isLive && onEnter(index)}
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
        group relative overflow-hidden rounded-2xl border
        transition-all duration-300 ease-out
        flex flex-col items-center justify-center text-center
        ${paddingClass}

        ${dark ? "bg-neutral-950/70 border-white/10" : "bg-white/80 border-black/10"}

        ${isClickable ? "cursor-pointer" : "cursor-default opacity-70"}

        ${isActive
          ? "shadow-2xl -translate-y-1"
          : isClickable
            ? "shadow-sm hover:shadow-xl hover:-translate-y-0.5"
            : "shadow-sm"
        }
      `}
    >
      {/* background image */}
      <div
        aria-hidden="true"
        className={`
          absolute inset-0 pointer-events-none
          transition-transform duration-500 ease-out
          will-change-transform
          group-hover:scale-[1.03]
          ${isActive ? "scale-[1.03]" : ""}
        `}
      >
        {card.bgImage && (
          <Image
            src={card.bgImage}
            alt=""
            fill
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={TRANSPARENT_BLUR_DATA_URL}
          />
        )}
      </div>

      {/* top-right badge */}
      {badgeText && (
        <div
          className={`
            absolute top-3 right-3 z-20
            text-[10px] font-semibold tracking-[0.14em]
            px-3 py-1
            rounded-full
            border
            backdrop-blur-xl
            shadow-[0_8px_24px_rgba(0,0,0,0.18)]
            ring-1 ring-white/40
            ${dark ? "text-white border-white/25" : "text-neutral-900 border-white/40"}
          `}
          style={{
            backgroundColor: "rgba(255,255,255,0.22)",
            borderColor: "rgba(255,255,255,0.45)",
            textShadow: dark
              ? "0 10px 22px rgba(0,0,0,0.65)"
              : "0 8px 16px rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`relative flex h-1.5 w-1.5 ${card.isLive ? "text-green-500" : "text-red-500"
                }`}
            >
              {/* Ping animation */}
              {/* <span
                className={`absolute inline-flex h-full w-full rounded-full animate-ping opacity-75 ${card.isLive ? "bg-green-500" : "bg-red-500"
                  }`}
              /> */}
              {/* Solid dot */}
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${card.isLive ? "bg-green-500" : "bg-red-500"
                  }`}
              />
            </span>

            <span>{badgeText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
