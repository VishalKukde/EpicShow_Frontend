"use client";

import { useEffect, useState } from "react";
import type { Ref } from "react";
import { useThemeStore } from "@/store/themeStore";
import { Film, Trophy, Gamepad2, TrainFront } from "lucide-react";

import HeroCategoryCard, {
  type HeroCategoryCardData,
} from "./HeroCategoryCard";

type HeroCategoryCardsProps = {
  className?: string;
  containerRef?: Ref<HTMLDivElement>;
  cards?: HeroCategoryCardData[];
};

const DEFAULT_CARDS: HeroCategoryCardData[] = [
  {
    label: "Movies",
    subtitle: "Cinema & Blockbusters",
    badge: "Now Showing & Upcoming",
    accent: "#818cf8",
    Icon: Film,
    href: "/movies",
    isLive: true,
    bgImage: "/assets/category/Movie.png",
  },
  {
    label: "Sports",
    subtitle: "Arenas & Live Matches",
    badge: "Stadium Live Passes",
    accent: "#10b981",
    Icon: Trophy,
    href: "/sports",
    isLive: true,
    bgImage: "/assets/category/Sport.png",
  },
  {
    label: "Train",
    subtitle: "Express Railways & Tickets",
    badge: "Instant Seat Booking",
    accent: "#06b6d4",
    Icon: TrainFront,
    href: "/trains",
    isLive: true,
    bgImage: "/assets/category/Train.png",
  },
  {
    label: "Gaming",
    subtitle: "Esports & Live Tournaments",
    badge: "Upcoming Esports",
    accent: "#f59e0b",
    Icon: Gamepad2,
    href: "/gaming",
    isLive: true,
    bgImage: "/assets/category/Gaming.png",
  },
];

export default function HeroCategoryCards({
  className,
  containerRef,
  cards = DEFAULT_CARDS,
}: HeroCategoryCardsProps) {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isSmall, setIsSmall] = useState(false);
  const [isTiny, setIsTiny] = useState(false);

  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsSmall(width <= 640);
      setIsTiny(width <= 380);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const cardHeight = isSmall ? "h-48" : "h-52 lg:h-60";

  const gridCols = isSmall
    ? "grid-cols-1 sm:grid-cols-2"
    : "grid-cols-2 lg:grid-cols-4";

  return (
    <div ref={containerRef} className={className}>
      <div className="py-8 sm:py-12">
        {/* Minimal Professional Header */}
        <div className="mb-6 sm:mb-8 text-center space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
            Categories
          </p>
          <h2
            className={`text-xl sm:text-2xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"
              }`}
          >
            Explore Experience Portals
          </h2>
        </div>

        {/* 4 Category Grid */}
        <div
          className={`
            grid ${gridCols}
            mx-auto max-w-7xl
            gap-5 lg:gap-6
            px-2 sm:px-4
          `}
        >
          {cards.map((card, i) => (
            <div
              key={card.label}
              className={`${cardHeight}`}
            >
              <HeroCategoryCard
                card={card}
                index={i}
                dark={dark}
                isActive={activeCard === i}
                onEnter={setActiveCard}
                onLeave={() => setActiveCard(null)}
                isSmall={isSmall}
                isTiny={isTiny}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
