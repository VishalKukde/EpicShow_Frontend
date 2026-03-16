"use client";

import type { ComponentType } from "react";
import { useRouter } from "next/navigation";

export type HeroCategoryCardData = {
  label: string;
  accent: string;
  Icon: ComponentType<{ className?: string; size?: number, style?: React.CSSProperties }>;
  comingSoon?: boolean;
  href?: string;
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
  isSmall = false,
  isTiny = false,
}: HeroCategoryCardProps) {
  const router = useRouter();
  const { Icon } = card;

  const isClickable = Boolean(card.href) && !card.comingSoon;

  const handleNavigate = () => {
    if (isClickable && card.href) {
      router.push(card.href);
    }
  };

  const cardHeight = isTiny
    ? "clamp(110px, 20vh, 150px)"
    : "clamp(120px, 18vh, 170px)";

  return (
    <div
      style={{ height: cardHeight }}
      onMouseEnter={() => !card.comingSoon && onEnter(index)}
      onMouseLeave={onLeave}
      onClick={handleNavigate}
      className={`
        relative
        rounded-2xl
        border
        overflow-hidden
        transition-all duration-300 ease-out
        flex flex-col
        items-center
        justify-center
        gap-2

        ${dark
          ? "bg-neutral-900 border-neutral-700"
          : "bg-neutral-50 border-neutral-200"
        }

        ${isActive
          ? "shadow-xl scale-[1.04] -translate-y-1"
          : "shadow-sm"
        }

        ${isClickable ? "cursor-pointer" : "opacity-60"}
      `}
    >
      {/* HUGE BACKGROUND TEXT */}

      {/* <div
        className="
    absolute inset-0
    flex items-center justify-center
    pointer-events-none
    select-none
    overflow-hidden
  "
      >
        <span
          className={`
      font-black
      uppercase
      leading-none
      tracking-[-0.08em]
      whitespace-nowrap
      text-center
      transition-all duration-300
      ${dark ? "text-white/5" : "text-black/5"}
      ${isActive ? "scale-105" : ""}
    `}
          style={{
            display:"flex",
            justifyContent:"center",
            fontSize: "clamp(60px, 7vw, 100px)",
            transform: "scaleX(0.82)",
            transformOrigin: "center",
            width: "100%",
          }}
        >
          {card.label}
        </span>
      </div> */}

      {/* icon */}

      <div
        className={`
          relative z-10
          rounded-xl
          flex items-center justify-center
          transition-all duration-300
          ${dark
            ? "bg-neutral-800 border-neutral-700"
            : "bg-white border-neutral-200"
          }
          shadow-sm border
          ${isActive ? "scale-110 shadow-md" : ""}
        `}
        style={{
          width: isSmall ? 40 : 52,
          height: isSmall ? 40 : 52,
        }}
      >
        <Icon
          size={isSmall ? 20 : 24}
          style={{ color: card.accent }}
        />
      </div>

      {/* text */}

      <span
        className={`
          relative z-10
          font-semibold
          ${isSmall
            ? "text-sm"
            : "text-[15px]"
          }
          ${dark ? "text-white" : "text-neutral-900"}
        `}
      >
        {card.label}
      </span>

      {/* coming soon */}

      {card.comingSoon && (
        <div className="absolute top-2 right-2 text-[10px] px-2 py-[2px] rounded-full bg-black/70 text-white z-20">
         Coming Soon
        </div>
      )}
    </div>
  );
}