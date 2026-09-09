"use client";
import MovieRow, { type MovieRowItem } from "./components/MovieRow";
import UpcomingMovieRow from "./components/UpcomingMovieRow";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TrendingFooter from "./components/TrendingFooter";
import HeroCategoryCards from "@/components/hero/HeroCategoryCards";
import HomeTestimonials from "./components/HomeTestimonials";
import PinterestMovieHero from "@/components/hero/PinterestMovieHero";
import { apiFetch } from "@/lib/api";
import HeroSectionNewAgain from "@/components/HeroSectionNewAgain";
import LandingFloatingAiButton from "@/components/LandingFloatingAiButton";

function SectionLoader({ title }: { title: string }) {
  return (
    <section className="relative z-10 mx-auto mb-16 max-w-7xl sm:mb-24">
      <div className="mb-5 flex flex-col items-start gap-3 text-left">
        <h2 className="section-header text-2xl lg:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="flex min-h-50 items-center justify-center text-slate-500 dark:text-slate-300">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70" />
        <span className="ml-3 text-sm">Loading...</span>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [latestReleaseItems, setLatestReleaseItems] = useState<MovieRowItem[]>([]);
  const [latestLoading, setLatestLoading] = useState(true);
  const [upcomingItems, setUpcomingItems] = useState<MovieRowItem[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [loadPercent, setLoadPercent] = useState(0);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const heroMovieItems = latestReleaseItems.slice(0, 5);

  useEffect(() => {
    const blockBack = () => {
      window.history.pushState(null, "", "/");
      window.addEventListener("popstate", blockBack);

      return () => window.removeEventListener("popstate", blockBack);
    };

    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, []);

  useEffect(() => {
    let active = true;

    const loadLatestReleases = async () => {
      if (active) setLatestLoading(true);
      try {
        const data = await apiFetch("/movies/latest?limit=5", {
          method: "GET",
          notifyOnError: false,
          publicRequest: true,
        });
        const items = Array.isArray(data) ? data : data?.movies ?? [];
        const mapped = items.map((movie: {
          _id?: string;
          name?: string;
          title?: string;
          imageUrl?: string | null;
          description?: string | null;
          genre?: string[] | string | null;
          rating?: number | null;
          releaseDate?: string | null;
        }) => ({
          id: movie._id || movie.name || movie.title,
          title: movie.name || movie.title || "Untitled",
          imageUrl: movie.imageUrl,
          description: movie.description || "A premium movie pick curated for your next watchlist.",
          genre: Array.isArray(movie.genre)
            ? movie.genre
            : movie.genre
              ? [String(movie.genre)]
              : ["Drama", "Action", "Adventure"],
          rating: typeof movie.rating === "number" ? movie.rating : 8.6,
          releaseDate: movie.releaseDate || null,
        }));

        const now = Date.now();
        const releasedOnly = mapped.filter(
          (m: MovieRowItem) => !m.releaseDate || new Date(m.releaseDate).getTime() <= now
        );

        if (active) setLatestReleaseItems(releasedOnly);
      } catch {
        if (active) setLatestReleaseItems([]);
      } finally {
        if (active) setLatestLoading(false);
      }
    };

    loadLatestReleases();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadUpcoming = async () => {
      if (active) setUpcomingLoading(true);
      try {
        const data = await apiFetch("/movies/upcoming", {
          method: "GET",
          notifyOnError: false,
          publicRequest: true,
        });
        const items = Array.isArray(data) ? data : data?.movies ?? [];
        const mapped = items.map((movie: {
          _id?: string;
          name?: string;
          title?: string;
          imageUrl?: string | null;
          description?: string | null;
          genre?: string[] | string | null;
          rating?: number | null;
          releaseDate?: string | null;
        }) => ({
          id: movie._id || movie.name || movie.title,
          title: movie.name || movie.title || "Untitled",
          imageUrl: movie.imageUrl,
          description: movie.description || "An upcoming blockbuster releasing soon.",
          genre: Array.isArray(movie.genre)
            ? movie.genre
            : movie.genre
              ? [String(movie.genre)]
              : ["Drama", "Action"],
          rating: typeof movie.rating === "number" ? movie.rating : 8.5,
          releaseDate: movie.releaseDate || null,
        }));

        if (active) setUpcomingItems(mapped);
      } catch {
        if (active) setUpcomingItems([]);
      } finally {
        if (active) setUpcomingLoading(false);
      }
    };

    loadUpcoming();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLoadPercent((current) => {
        const next = Math.min(current + Math.random() * 12 + 8, 100);
        return next;
      });
    }, 120);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loadPercent < 100) return;

    const timer = window.setTimeout(() => setShowLoadingScreen(false), 500);
    return () => window.clearTimeout(timer);
  }, [loadPercent]);

  return (
    <div
      className="relative min-h-screen select-none overflow-x-hidden"
      style={{ backgroundColor: "var(--hero-page-bg)" }}
    >
      <div className="relative z-10 flex flex-col pb-[calc(env(safe-area-inset-bottom)+3rem)] sm:pb-0">
        <HeroSectionNewAgain />

        <div className="mx-auto w-full max-w-7xl space-y-20 px-4 pb-20 pt-6 sm:space-y-24 sm:px-6 sm:pb-24 sm:pt-10 lg:space-y-28 lg:px-2 lg:pb-28 lg:pt-12">
          {/* Luxury 4-Category Portals Section */}
          <HeroCategoryCards className="mt-2" />

          {latestLoading ? (
            <SectionLoader title="Latest Releases" />
          ) : (
            latestReleaseItems.length > 0 && (
              <MovieRow
                title="Latest Releases"
                movies={latestReleaseItems}
                showTitles={false}
                showViewAll={false}
                onMovieClick={(movie) => {
                  if (!movie.id) return;
                  router.push(`/movies/${movie.id}`);
                }}
              />
            )
          )}

          {upcomingLoading ? (
            <SectionLoader title="Upcoming Movies" />
          ) : (
            upcomingItems.length > 0 && (
              <UpcomingMovieRow
                title="Upcoming Movies"
                movies={upcomingItems.slice(0, 5)}
                limit={5}
                showViewAll={true}
                viewAllHref="/movies"
              />
            )
          )}

          <HomeTestimonials />
        </div>

        <TrendingFooter />
      </div>
      <LandingFloatingAiButton />
    </div>
  );
}
