"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export type PinterestMovieHeroItem = {
  id: string;
  title: string;
  subtitle?: string;
  year?: string;
  genre?: string[];
  rating?: number;
  description?: string;
  accent?: string;
  image: string;
  href?: string;
  trailerUrl?: string;
};

type PinterestMovieHeroProps = {
  items?: PinterestMovieHeroItem[];
  className?: string;
};

const getYouTubeTrailerUrl = (movieTitle: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${movieTitle} official trailer`)}`;

const DEFAULT_ITEMS: PinterestMovieHeroItem[] = [
  {
    id: "upcoming-1",
    title: "The Last Stand",
    subtitle: "Coming soon",
    year: "2025",
    genre: ["Action", "Drama", "Thriller"],
    rating: 9.0,
    description:
      "A final push against impossible odds turns one last chance into a citywide showdown of courage and sacrifice.",
    accent: "#c084fc",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    href: "/movies?filter=upcoming",
    trailerUrl: getYouTubeTrailerUrl("The Last Stand trailer"),
  },
  {
    id: "upcoming-2",
    title: "Night Run",
    subtitle: "Midnight chase",
    year: "2025",
    genre: ["Crime", "Adventure", "Suspense"],
    rating: 8.8,
    description:
      "A relentless pursuit across the dark starts with a single mistake and ends with the city holding its breath.",
    accent: "#f59e0b",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    href: "/movies?filter=upcoming",
    trailerUrl: getYouTubeTrailerUrl("Night Run trailer"),
  },
  {
    id: "upcoming-3",
    title: "Velvet Horizon",
    subtitle: "Dreamlike and bold",
    year: "2025",
    genre: ["Drama", "Fantasy", "Romance"],
    rating: 8.6,
    description:
      "A luminous journey through wonder and longing reveals how far the heart will go to chase the impossible.",
    accent: "#38bdf8",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    href: "/movies?filter=upcoming",
    trailerUrl: getYouTubeTrailerUrl("Velvet Horizon trailer"),
  },
  {
    id: "upcoming-4",
    title: "Abyssal Skies",
    subtitle: "A new frontier",
    year: "2025",
    genre: ["Sci-Fi", "Adventure", "Mystery"],
    rating: 9.1,
    description:
      "Above the clouds, an impossible signal unlocks a mystery that changes everything humanity thought it knew.",
    accent: "#22c55e",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    href: "/movies?filter=upcoming",
    trailerUrl: getYouTubeTrailerUrl("Abyssal Skies trailer"),
  },
  {
    id: "upcoming-5",
    title: "Iron Echo",
    subtitle: "Breakthrough fury",
    year: "2025",
    genre: ["Action", "Sci-Fi", "Thriller"],
    rating: 8.9,
    description:
      "The next war begins not with fire, but with one signal, one memory, and a city running out of time.",
    accent: "#fb7185",
    image:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80",
    href: "/movies?filter=upcoming",
    trailerUrl: getYouTubeTrailerUrl("Iron Echo trailer"),
  },
];

export default function PinterestMovieHero({
  items = DEFAULT_ITEMS,
  className = "",
}: PinterestMovieHeroProps) {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";
  const [activeIndex, setActiveIndex] = useState(0);
  const safeItems = Array.isArray(items) && items.length > 0 ? items : DEFAULT_ITEMS;
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Keep a bounded index to avoid setting state inside effects when items length changes
  const boundedIndex = useMemo(() => {
    if (!safeItems || safeItems.length === 0) return 0;
    return activeIndex >= safeItems.length ? 0 : activeIndex;
  }, [activeIndex, safeItems]);

  const activeMovie = useMemo(() => safeItems[boundedIndex] ?? safeItems[0], [boundedIndex, safeItems]);

  // Auto-advance every 3s when not paused
  useEffect(() => {
    if (safeItems.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % safeItems.length);
    }, 3000);

    return () => window.clearInterval(id);
  }, [safeItems]);

  // No scrollIntoView or focus changes: hero will only loop images automatically

  return (
    <section className={`relative w-full ${className}`}>
      <div
        className={`mx-auto w-full max-w-380 px-3 pb-2 pt-2 sm:px-5 lg:px-7 lg:pt-16 ${
          dark ? "text-slate-50" : "text-slate-900"
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-[26px] border shadow-[0_24px_70px_rgba(15,23,42,0.14)] transition-colors duration-300 ${
            dark
              ? "border-zinc-800 bg-zinc-950/90 shadow-[0_24px_70px_rgba(2,6,23,0.6)]"
              : "border-white/60 bg-white/75 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
          }`}
        >
          <div
            className="relative h-105 overflow-hidden transition-all duration-700 ease-out sm:h-117.5 lg:h-136"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.88), rgba(2,6,23,0.34) 45%, rgba(2,6,23,0.18) 100%), url(${activeMovie.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transitionProperty: "background-image, filter, opacity",
              filter: "saturate(1.05) contrast(1.02)",
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_25%)]" />

            <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5 lg:p-7">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/80 backdrop-blur-md sm:text-[10px]">
                  Curated this week
                </div>
                {/* <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-2.5 py-1 text-[9px] font-medium text-white/80 backdrop-blur-md sm:text-[10px]">
                  {editorialDemoItems.map((item) => (
                    <span key={item.label} className="inline-flex items-center gap-1">
                      <span className="font-semibold text-white">{item.value}</span>
                      <span className="text-white/60">{item.label}</span>
                    </span>
                  ))}
                </div> */}
              </div>

              <div className="relative z-10 max-w-xl pb-2 sm:pb-4">
                <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.34em] text-white/75 sm:text-[10px]">
                  {activeMovie.subtitle || "Now showing"}
                </p>
                <h1 className="max-w-xl text-3xl font-black leading-none tracking-[-0.06em] text-white sm:text-4xl lg:text-[4rem]">
                  {activeMovie.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-medium text-white/80 sm:text-[11px]">
                  {activeMovie.year ? <span>{activeMovie.year}</span> : null}
                  {activeMovie.genre?.map((genre) => (
                    <span key={genre} className="rounded-full border border-white/15 bg-white/5 px-2 py-1">
                      {genre}
                    </span>
                  ))}
                </div>

                <p className="mt-5 max-w-lg text-sm leading-6 text-white/75 sm:text-[15px]">
                  {activeMovie.description}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href={activeMovie.href || "/movies?filter=upcoming"}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:scale-[1.02] hover:bg-slate-100"
                  >
                    Book Now
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={activeMovie.trailerUrl || "https://www.youtube.com/results?search_query=movie+official+trailer"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/15"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Trailer
                  </a>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 z-20 flex w-105 max-w-[calc(100%-2rem)] justify-end">
                <div className="flex items-end gap-2 [transform:translateZ(0)]">
                  {safeItems.slice(0, 5).map((movie, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <button
                        key={movie.id}
                        type="button"
                        ref={(el) => (thumbRefs.current[index] = el)}
                        onClick={() => setActiveIndex(index)}
                        className={`group relative shrink-0 overflow-hidden rounded-[15px] border text-left outline-none transition-all duration-500 ease-out ${
                          isActive
                            ? "w-32 border-white/60 shadow-[0_16px_28px_rgba(15,23,42,0.3)]"
                            : "w-20.5 border-white/15"
                        } ${!isActive ? "hover:border-white/30" : ""}`}
                      >
                        <div
                          className="relative h-39 w-full bg-cover bg-center transition-all duration-500 ease-out sm:h-41"
                          style={{
                            backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.08), rgba(2,6,23,0.5)), url(${movie.image})`,
                            transform: "scale(1)",
                            opacity: isActive ? 1 : 0.88,
                            filter: isActive ? "saturate(1.1)" : "saturate(0.8)",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
