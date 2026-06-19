"use client";

import { useEffect, useState } from "react";
import type { Ref } from "react";
import { useThemeStore } from "@/store/themeStore";
import {
  Film,
  Trophy,
  CalendarDays,
  Gamepad2,
  TrainFront,
  Plane,
  Hotel,
  Music2,
} from "lucide-react";

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
    accent: "#818cf8",
    Icon: Film,
    href: "/movies",
    isLive: true,
    bgImage: "/assets/category/Movie.png",
  },
  {
    label: "Sports",
    accent: "#34d399",
    Icon: Trophy,
    href: "/sports",
    isLive: true,
    bgImage: "/assets/category/Sport.png",
  },
   {
    label: "Train",
    accent: "#60a5fa",
    Icon: TrainFront,
    href: "/trains",
    isLive: true,
    bgImage: "/assets/category/Train.png",
  },
 
  {
    label: "Gaming",
    accent: "#a78bfa",
    Icon: Gamepad2,
    href: "/gaming",
    isLive: true,
    bgImage: "/assets/category/Gaming.png",
  },
   {
    label: "Events",
    accent: "#fb7185",
    Icon: CalendarDays,
    href: "/events",
    isLive: false,
    bgImage: "/assets/category/Event.png",
  },
  {
    label: "Flight",
    accent: "#4ade80",
    Icon: Plane,
    href: "/flights",
    isLive: false,
    bgImage: "/assets/category/Flight.png",
  },
  {
    label: "Hotel",
    accent: "#fbbf24",
    Icon: Hotel,
    href: "/hotels",
        isLive: false,
    bgImage: "/assets/category/Hotel.png",
  },
  {
    label: "Concerts",
    accent: "#e879f9",
    Icon: Music2,
    href: "/concerts",
    isLive: false,
    bgImage: "/assets/category/Concert.png",
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

  const gridCols = isSmall
    ? "grid-flow-col auto-cols-[70%] grid-rows-1 overflow-x-auto pb-2 no-scrollbar"
    : "grid-cols-4";

  return (
    <div ref={containerRef} className={className}>
      <div className="py-12">

        {/* title */}

        <div className="text-center mb-6 sm:mb-10">

          <p
            className={`font-bold uppercase tracking-[0.3em] 
            ${isSmall ? "text-lg" : "text-2xl"}
            ${dark ? "text-blue-300" : "text-blue-600"}`}
          >
            Browse by category
          </p>

        </div>

        {/* grid */}

        <div
          className={`
            grid ${gridCols}
            gap-3 sm:gap-6
            max-w-[1360px]
            mx-auto
            px-1 sm:px-0
          `}
        >
          {cards.map((card, i) => (
            <div
              key={card.label}
              className={`
                rounded-2xl
                transition
              `}
            >
              <HeroCategoryCard
                card={card}
                index={i}
                dark={dark}
                isActive={activeCard === i}
                onEnter={setActiveCard}
                onLeave={() => setActiveCard(null)}
                // borderColor="transparent"
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
